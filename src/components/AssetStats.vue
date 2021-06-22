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

<script>
import { computed, ref } from "vue";
import { avgBuyPrice, totalPayoutValue } from "../modules/stats";

export default {
  props: ["asset"],
  setup(props) {
    const stats = ref([
      {
        name: "Avg. purchase price/share:",
        number: computed(() => {
          const val = avgBuyPrice(props.asset);
          return val ? val.toFixed(2) : null;
        }),
        unit: props.asset.dataload.currency,
      },
      {
        name: "Total of dividends received:",
        number: computed(() => {
          const val = totalPayoutValue(props.asset);
          return val ? val.toFixed(2) : null;
        }),
        unit: props.asset.dataload.currency,
      },
    ]);

    return {
      stats,
    };
  },
};
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
