<template>
  <form @submit.prevent="save()">
    <div class="container">
      <div class="flexbox">
        <fieldset>
          <legend>Buy transaction details</legend>

          <label for="dateBuy">Purchase date</label>
          <input
            id="dateBuy"
            type="date"
            required
            v-model="asset.dateBuy"
            :max="today"
            @change="requestHandler('history', { asset: asset })"
          />

          <label for="buyValue"
            >Invested amount (in {{ settings.currency }})</label
          >
          <input
            id="buyValue"
            v-model.number="asset.buyValue"
            type="number"
            step="0.01"
            min="0"
            required
          />

          <label for="amount">Number of shares</label>
          <input
            id="amount"
            required
            v-model.number="asset.amount"
            type="number"
            step="0.01"
            min="0"
          />

          <label for="buyPrice"
            >Buy price per share (in {{ asset.currency }})</label
          >
          <input
            id="buyPrice"
            v-model.number="asset.buyPrice"
            type="number"
            step="0.01"
            min="0"
            required
          />
        </fieldset>
        <fieldset>
          <legend>Sell transaction details</legend>

          <label for="dateSell">Sell date</label>
          <input
            id="dateSell"
            type="date"
            v-model="asset.dateSell"
            :max="today"
          />

          <label for="sellValue">Sell value (in {{ settings.currency }})</label>
          <input
            id="sellValue"
            v-model.number="asset.sellValue"
            type="number"
            step="0.01"
            min="0"
          />

          <label for="sellPrice"
            >Sell price per share (in {{ asset.currency }})</label
          >
          <input
            id="sellPrice"
            v-model.number="asset.sellPrice"
            type="number"
            step="0.01"
            min="0"
          />
        </fieldset>
      </div>
    </div>
    <div v-for="(error, id) of errors" :key="id" style="color: red">
      {{ error }}
    </div>
    <div>
      <button type="submit">✔️ Save</button>
    </div>
  </form>
</template>

<script>
import { computed, reactive, ref, watch, inject, toRefs } from "vue";
import { useAPI } from "../composables/use-api";
import { today } from "../utils";
import { store, asset, saveAsset, setAsset } from "../composables/use-store";

export default {
  setup(props) {
    const errors = ref([]);

    // get latest stock price every time the stock is loaded
    useAPI.requestHandler("quote", { asset: asset });
    // update other stock info only once a day
    if (asset.lastChecked !== today) {
      useAPI.requestHandler("signal", { asset: asset });
      useAPI.requestHandler("target", { asset: asset });
    }

    /*const allowedDates = (val) => {
      let date = new Date(val);
      // only show dates that are bigger/equal than the buy date
      if (
        asset._dateBuy &&
        asset.buyValue &&
        date <= asset._dateBuy
      )
        return false;
      return ![0, 6].includes(date.getDay()) && date <= new Date();
    };*/

    const checkForm = () => {
      errors.value = [];

      if (asset.dateSell && asset.dateSell < asset.dateBuy)
        errors.value.push("Sell date is before purchase date.");
      if (asset.dateSell && !asset.sellPrice)
        errors.value.push("Sell price is missing.");
      if (!asset.dateSell && asset.sellPrice)
        errors.value.push("Sell date is missing.");
      if (asset.dateSell && asset.sellPrice && !asset.sellValue)
        errors.value.push("Sell value is missing.");
    };

    const save = () => {
      checkForm();
      if (errors.value.length === 0) {
        if (!asset.id)
          // give asset a random ID
          asset.id = Math.random().toString(36).substr(2, 16);
        saveAsset(asset);
        // clear global asset variable in order to return to home screen
        setAsset();
      }
    };

    return {
      save,
      today,
      asset,
      settings: store.settings,
      errors,
      ...useAPI,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
</style>
