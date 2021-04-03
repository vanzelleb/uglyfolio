<template>
  <form @submit.prevent="save()">
    <label for="dateSell">Sell date</label>
    <input id="dateSell" type="date" v-model="trx.date" :max="today" required />

    <label for="amount">Number of shares sold</label>
    <input
      id="amount"
      v-model.number="trx.amount"
      type="number"
      step="0.01"
      min="0"
      :max="asset.totalSharesBought()"
      required
    />

    <label for="sellPrice"
      >Sell price per share (in {{ asset.currency }})</label
    >
    <input
      id="sellPrice"
      v-model.number="trx.price"
      type="number"
      step="0.01"
      min="0"
      required
    />

    <label for="sellValue">Sell value (in {{ appCurrency }})</label>
    <input
      id="sellValue"
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
import { ref, toRefs, reactive } from "vue";
import { requestHandler } from "../composables/use-api";
import { today } from "../utils";
import { store } from "../composables/use-store";
import { asset, saveAsset } from "../composables/use-asset";
import { Trx, saveTrx, removeTrx } from "../composables/use-transactions";

export default {
  props: ["trx", "id"],
  setup(props) {
    let trx = reactive(new Trx());
    if (props.id !== undefined) Object.assign(trx, asset.trxns[props.id]);

    const save = () => {
      if (trx.type) saveTrx(new Trx(trx), props.id);
      else {
        trx.type = "sell";
        saveTrx(new Trx(trx), props.id);
        // reset add new share form after saving
        Object.assign(trx, new Trx());
      }
    };

    return {
      trx,
      saveTrx,
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
