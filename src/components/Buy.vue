<template>
  <form @submit.prevent="saveTrx()">
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
import { computed, reactive, ref, watch } from "vue";
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
        props.trx.type = "buy";
        asset.trxns.push(props.trx);
        saveAsset(asset);
        updateHistory();
      }
    };

    const updateHistory = () => {
      const startDate = props.trx.date ? new Date(props.trx.date) : new Date();
      // get 3 months of data before the transaction date for context
      startDate.setMonth(startDate.getMonth() - 3);
      const endDate = new Date();
      requestHandler("history", {
        asset: asset,
        start: startDate,
        end: endDate,
      });
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
