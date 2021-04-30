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
import { asset } from "../composables/use-asset";
import { ref, watchEffect } from "vue";

export default {
  setup() {
    const periodReturn = ref(0);

    watchEffect(
      () => (periodReturn.value = (asset.lastPrice / asset.prices[0] - 1) * 100)
    );

    return {
      periodReturn,
      asset,
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
