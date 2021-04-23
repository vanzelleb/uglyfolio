<template>
  <details v-if="assets.length > 1">
    <summary>🍰 <span class="link">Optimize</span></summary>
    <fieldset>
      <legend>Recommended asset allocation</legend>
      <button @click="optimize()">Optimize</button>
      <div id="piechart"></div>
      <h3 v-if="finalreturn">{{ finalreturn.toFixed(0) }}% expected return</h3>
      <h3 v-if="finalvol">{{ finalvol.toFixed(0) }}% volatility</h3>
    </fieldset>
  </details>
</template>

<script>
import { asset } from "../composables/use-asset";
import { assets } from "../composables/use-portfolio";
import { ref, watchEffect, onMounted } from "vue";
import usePieChart from "../composables/usePieChart";
import useOptimizer from "../composables/useOptimizer";

export default {
  setup() {
    const { chart } = usePieChart(assets);
    const { optimize, finalvol, finalreturn } = useOptimizer(assets, chart);

    return {
      assets,
      finalreturn,
      finalvol,
      optimize,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
</style>
