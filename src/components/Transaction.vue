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
      :max="type === 'Sell' ? maxSellAmount : 1000000"
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
      <button v-if="trxIdx >= 0" @click.prevent="remove()">❌ Delete</button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { today } from "../modules/utils";
import { Trx, useTransactions } from "../composables/useTransactions";
import { totalSharesBought, totalSharesSold } from "../modules/stats";
import { appCurrency } from "../modules/currencies";

const props = defineProps({
  asset: Object,
  trxIdx: Number,
  type: String,
});

let trx = reactive(new Trx({ type: props.type }));
const { saveTrx, removeTrx } = useTransactions(props.asset);

// if there is an id it means the transaction has previously been saved
if (props.trxIdx !== undefined)
  Object.assign(trx, props.asset.trxns[props.trxIdx]);

const save = () => {
  saveTrx(trx, props.trxIdx);
  if (props.trxIdx === undefined) {
    // reset new trx form fields after saving a new transaction
    Object.assign(trx, new Trx({ type: props.type }));
  }
};

const remove = () => {
  removeTrx(props.trxIdx);
};

const maxSellAmount = computed(
  () => totalSharesBought(props.asset) - totalSharesSold(props.asset)
);

const assetCurrency = ref(props.asset.dataload.currency);
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
