<template>
  <fieldset>
    <legend>Stats</legend>
    <div>Return over chart period: {{ periodReturn.toFixed(2) }}%</div>
    <div>
      Predicted yearly change:
      {{ asset.predictYearlyChangePct() * 100 }}%
    </div>
    <div>
      Predicted yearly volatility:
      {{ asset.predictYearlyVolatility() * 100 }}%
    </div>
  </fieldset>
</template>

<script>
import { asset } from "../composables/use-asset";
import { ref, watchEffect } from "vue";

export default {
  setup() {
    const periodReturn = ref(0);

    watchEffect(
      () =>
        (periodReturn.value = (asset.lastPrice / asset.prices()[0] - 1) * 100)
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
</style>
