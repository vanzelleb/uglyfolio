<template>
  <form @submit.prevent="save()">
    <label for="date">Payout date</label>
    <input id="date" type="date" required v-model="payout.date" :max="today" />

    <label for="value">Dividend amount (in {{ appCurrency }})</label>
    <input
      id="value"
      v-model.number="payout.value"
      type="number"
      step="0.01"
      min="0"
      max="100000000"
      required
    />
    <div>
      <button type="submit">✔️ Save</button>
      <button v-if="listIdx >= 0" @click.prevent="remove()">❌ Delete</button>
    </div>
  </form>
</template>

<script>
import { reactive, computed } from "vue";
import { today } from "../modules/utils";
import { appCurrency } from "../modules/currencies";
import { saveAsset } from "../modules/asset";
import { Trx, useTransactions } from "../composables/useTransactions";

export default {
  props: ["asset", "listIdx", "type"],
  setup(props) {
    let payout = reactive(new Trx({ type: props.type }));
    const { saveTrx, removeTrx } = useTransactions(props.asset);

    // if there is an id it means the transaction has previously been saved
    if (props.listIdx !== undefined)
      Object.assign(payout, props.asset.trxns[props.listIdx]);

    const save = () => {
      saveTrx(payout, props.listIdx);
      if (props.listIdx === undefined) {
        // reset new trx form fields after saving a new transaction
        Object.assign(payout, new Trx({ type: props.type }));
      }
    };

    const remove = () => {
      removeTrx(props.listIdx);
    };

    return {
      payout,
      save,
      remove,
      today,
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
</style>
