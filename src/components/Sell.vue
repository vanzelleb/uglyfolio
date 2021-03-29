<template>
  <form @submit.prevent="saveTrx()">
    <label for="dateSell">Sell date</label>
    <input id="dateSell" type="date" v-model="trx.date" :max="today" required />

    <label for="amount">Number of shares sold</label>
    <input
      id="amount"
      v-model.number="trx.amount"
      type="number"
      step="0.01"
      min="0"
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

    <div v-for="(error, id) of errors" :key="id" class="error">
      {{ error }}
    </div>
    <div>
      <button type="submit">✔️ Save</button>
      <button v-if="id >= 0" @click.prevent="removeTrx(id)">❌ Delete</button>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import { requestHandler } from "../composables/use-api";
import { today } from "../utils";
import { store, asset, saveAsset } from "../composables/use-store";

export default {
  props: ["trx", "id"],
  setup(props) {
    const errors = ref([]);

    const validated = () => {
      errors.value = [];
      // rules go here
      if (errors.value.length === 0) return true;
      else return false;
    };

    const saveTrx = () => {
      if (validated()) {
        props.trx.type = "sell";
        asset.trxns.push(props.trx);
        saveAsset(asset);
      }
    };

    const removeTrx = (id) => {
      asset.trxns.splice(id, 1);
      saveAsset(asset);
    };

    return {
      saveTrx,
      removeTrx,
      today,
      asset,
      appCurrency: store.settings.currency,
      errors,
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
