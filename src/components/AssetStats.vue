<template>
  <fieldset v-if="asset.trxns.length > 0">
    <legend>Statistics</legend>
    <table>
      <tr v-for="stat of stats">
        <td>{{ stat.name }}</td>
        <td class="number">
          <h5>{{ stat.number }}</h5>
          <h6>&nbsp;{{ stat.unit }}</h6>
        </td>
      </tr>
    </table>
  </fieldset>
</template>

<script>
import { computed, ref } from "vue";
import { avgBuyPrice } from "../modules/stats";

export default {
  props: ["asset"],
  setup(props) {
    const stats = ref([
      {
        name: "Avg. purchase price/share:",
        number: computed(() => avgBuyPrice(props.asset).toFixed(2)),
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
