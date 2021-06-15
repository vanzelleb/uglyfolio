<template>
  <form @submit.prevent="save()">
    <label for="date">Transaction date</label>
    <input id="date" type="date" required v-model="trx.date" :max="today" />

    <label for="amount">Number of shares</label>
    <input
      id="amount"
      required
      v-model.number="trx.amount"
      type="number"
      step="0.01"
      min="0"
      :max="type === 'Sell' ? boughtAmount : 1000000"
    />

    <label for="price">Price per share (in {{ assetCurrency }})</label>
    <input
      id="price"
      v-model.number="trx.price"
      type="number"
      step="0.01"
      min="0"
      :max="1000000"
      required
    />

    <label for="value">Total transaction amount (in {{ appCurrency }})</label>
    <input
      id="value"
      v-model.number="trx.value"
      type="number"
      step="0.01"
      min="0"
      max="100000000"
      required
    />
    <div>
      <button type="submit">✔️ Save</button>
      <button v-if="trxId >= 0" @click.prevent="remove(trxId)">
        ❌ Delete
      </button>
    </div>
  </form>
</template>

<script>
import { reactive } from "vue";
import { today } from "../utils";
import { Trx, useTransactions } from "../composables/useTransactions";
import { totalSharesBought } from "../modules/asset";
import { appCurrency } from "../modules/currencies";

export default {
  props: ["asset", "trxId", "type"],
  setup(props) {
    let trx = reactive(new Trx({ type: props.type }));
    const { saveTrx, removeTrx } = useTransactions(props.asset);

    // if there is an id it means the transaction has previously been saved
    if (props.trxId !== undefined)
      Object.assign(trx, props.asset.trxns[props.trxId]);

    const save = () => {
      saveTrx(trx, props.trxId);
      if (!props.trxId) {
        // reset new trx form fields after saving a new transaction
        Object.assign(trx, new Trx({ type: props.type }));
      }
    };

    const remove = (trxId) => {
      removeTrx(trxId);
    };

    return {
      trx,
      save,
      remove,
      today,
      boughtAmount: totalSharesBought,
      assetCurrency: props.asset.dataload.currency,
      appCurrency,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
button {
  margin: 10px 0;
}

.error {
  color: red;
}
</style>
