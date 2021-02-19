<template>
  <form @submit.prevent="save()">
    <fieldset>
      <legend>Transaction details</legend>
      <div v-for="(error, id) of errors" :key="id">
        {{ error }}
      </div>

      <label for="dateBuy">Purchase date</label>
      <input
        id="dateBuy"
        type="date"
        required
        v-model="asset.dateBuy"
        :max="today"
      />

      <label for="buyValue">Invested amount (in {{ settings.currency }})</label>
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
        >Price per share @ purchase date (in {{ asset.currency }})</label
      >
      <input
        id="buyPrice"
        v-model.number="asset.buyPrice"
        type="number"
        step="0.01"
        min="0"
        required
      />

      <label for="dateSell">Sell date</label>
      <input id="dateSell" type="date" v-model="asset.dateSell" :max="today" />

      <label for="sellValue">Sell value (in {{ settings.currency }})</label>
      <input
        id="sellValue"
        v-model.number="asset.sellValue"
        type="number"
        step="0.01"
        min="0"
      />
      <div>
        <button type="submit">Save</button>
      </div>
    </fieldset>
  </form>
</template>

<script>
import { computed, reactive, ref, watch, inject, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useAPI } from "../composables/use-api";
import { today, toLocaleNumber } from "../utils";
import { store, asset, saveAsset } from "../composables/use-store";

export default {
  setup(props) {
    const router = useRouter();
    const errors = ref([]);

    // get latest data about the stock
    useAPI.requestHandler("quote", { asset: asset });
    useAPI.requestHandler("signal", { asset: asset });
    useAPI.requestHandler("target", { asset: asset });

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

      if (!asset.dateBuy) {
        errors.value.push("Buy date required.");
      }

      if (!asset.buyValue) {
        errors.value.push("Invested amount required.");
      }

      if (!asset.amount) {
        errors.value.push("Number of shares required.");
      }

      if (asset.dateSell && asset.dateSell < asset.dateBuy) {
        errors.value.push("Sell date is before Purchase date.");
      }
    };

    const save = () => {
      checkForm();
      if (errors.value.length === 0) {
        if (!asset.id)
          // give asset a random ID
          asset.id = Math.random().toString(36).substr(2, 16);
        saveAsset(asset);
        router.push("/");
      }
    };

    watch(
      () => asset.dateBuy,
      (dateBuy, oldDateBuy) => {
        // gets executed when store.settings.currency changes
        console.log("change in buy date detected");
        useAPI.requestHandler("history", { asset: asset });
      }
    );

    return {
      save,
      today,
      asset,
      settings: store.settings,
      errors,
      toLocaleNumber,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
</style>
