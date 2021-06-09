<template>
  <fieldset>
    <legend>Stats</legend>
    <table>
      <tr>
        <td>Return over chart period:</td>
        <td class="number">
          <h5>{{ periodReturn.toFixed(1) }}</h5>
          <h6>&nbsp;%</h6>
        </td>
      </tr>
    </table>
    <!--<div>
      Avg. yearly change:
      {{ (asset.predictYearlyChangePct() * 100).toFixed(1) }}%
    </div>
    <div>
      Avg. yearly volatility:
      {{ (asset.predictYearlyVolatility() * 100).toFixed(1) }}%
    </div>-->
  </fieldset>
</template>

<script>
import { computed } from "vue";

export default {
  props: ["asset"],
  setup(props) {
    const periodReturn = computed(
      () => (props.asset.dataload.lastPrice / props.asset.prices[0] - 1) * 100
    );

    return {
      periodReturn,
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
