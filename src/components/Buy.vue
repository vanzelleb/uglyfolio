<template>
  <form @submit.prevent="save()">
    <label for="dateBuy">Purchase date</label>
    <input id="dateBuy" type="date" required v-model="trx.date" :max="today" />

    <label for="amount">Number of shares bought</label>
    <input
      id="amount"
      required
      v-model.number="trx.amount"
      type="number"
      step="0.01"
      min="0"
    />

    <label for="buyPrice">Buy price per share (in {{ asset.currency }})</label>
    <input
      id="buyPrice"
      v-model.number="trx.price"
      type="number"
      step="0.01"
      min="0"
      required
    />

    <label for="buyValue">Invested amount (in {{ appCurrency }})</label>
    <input
      id="buyValue"
      v-model.number="trx.value"
      type="number"
      step="0.01"
      min="0"
      required
    />
    <div>
      <button type="submit">✔️ Save</button>
      <button v-if="id >= 0" @click.prevent="removeTrx(id)">❌ Delete</button>
    </div>
  </form>
</template>

<script>
import { computed, reactive, ref, watch, toRefs } from "vue";
import { requestHandler } from "../composables/use-api";
import { today } from "../utils";
import { store } from "../composables/use-store";
import { asset, removeAsset, selectAsset } from "../composables/use-asset";
import { Trx, saveTrx, removeTrx } from "../composables/use-transactions";

export default {
  props: ["id"],
  setup(props) {
    let trx = reactive(new Trx());
    if (props.id !== undefined)
      Object.assign(trx, new Trx(asset.trxns[props.id]));

    const save = () => {
      trx.type = "buy";
      saveTrx(trx, props.id);
      // reset transaction object after saving
      Object.assign(trx, new Trx());
    };

    return {
      trx,
      save,
      removeTrx,
      today,
      asset,
      appCurrency: store.settings.currency,
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
