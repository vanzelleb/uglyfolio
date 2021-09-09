<template>
  <fieldset v-if="asset.trxns.length > 0">
    <legend>Statistics</legend>
    <table>
      <template v-for="stat of stats">
        <tr v-if="stat.number">
          <td>{{ stat.name }}</td>
          <td class="number">
            <h5>{{ stat.number }}</h5>
            <h6>&nbsp;{{ stat.unit }}</h6>
          </td>
        </tr>
      </template>
    </table>
  </fieldset>
</template>

<script setup>
import { computed, ref } from "vue";
import { avgBuyPrice, totalPayoutValue,   totalSellValue,
  totalBuyValue, } from "../modules/stats";
import { appCurrency } from "../modules/currencies";

const props = defineProps({
  asset: Object,
});

const stats = ref([
    {
    name: "Total investment:",
    number: computed(() => {
      const val = totalBuyValue(props.asset)
      return val ? val.toFixed(2) : null;
    }),
    unit: appCurrency,
  },
   {
    name: "Total sold:",
    number: computed(() => {
      const val = totalSellValue(props.asset)
      return val ? val.toFixed(2) : null;
    }),
    unit: appCurrency,
  },
  {
    name: "Avg. purchase price/share:",
    number: computed(() => {
      const val = avgBuyPrice(props.asset);
      return val ? val.toFixed(2) : null;
    }),
    unit: props.asset.dataload.currency,
  },
  {
    name: "Total dividends:",
    number: computed(() => {
      const val = totalPayoutValue(props.asset);
      return val ? val.toFixed(2) : null;
    }),
    unit: appCurrency,
  },

  
]);
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
h5,
h6 {
  display: inline-block;
}

number {
  text-align: right;
}
</style>
