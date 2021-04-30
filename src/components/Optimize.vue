<template>
  <details v-if="assets.length > 1">
    <summary>🍰 <span class="link">Optimize</span></summary>
    <fieldset>
      <legend>Recommended asset allocation</legend>
      <div v-show="weights.length > 0" id="piechart"></div>
      <div v-if="finalreturn && finalvol">
        <BR />
        <h4>{{ finalreturn.toFixed(0) }}% expected return</h4>
        <h4>{{ finalvol.toFixed(0) }}% expected volatility</h4>
      </div>
      <div v-else>
        <button
          v-if="!inProgress"
          @click="start()"
          :disabled="inProgress"
          style="display: inline-block"
        >
          Optimize
        </button>
        <span v-else>Doing the math...</span>
      </div>
    </fieldset>
  </details>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { asset } from "../composables/use-asset";
import { assets } from "../composables/use-portfolio";
import usePieChart from "../composables/usePieChart";
// Vite specific worker import with module support
import MyWorker from "../markowitz-optimizer?worker";

const worker = new MyWorker();

export default {
  setup() {
    const inProgress = ref(false);
    const finalvol = ref(0);
    const finalreturn = ref(0);
    const worker = new MyWorker();
    const { chart } = usePieChart(assets);
    const weights = ref([]);

    const start = () => {
      inProgress.value = true;
      worker.postMessage({
        prices: assets.value.map((asset) => asset.prices()),
      });
      worker.onmessage = function (msg) {
        console.log("Message received from worker: ", msg.data);
        weights.value = msg.data.weights;
        chart.value.updateSeries(weights.value);
        finalreturn.value = msg.data.return;
        finalvol.value = msg.data.vol;
        inProgress.value = false;
      };
    };

    return {
      weights,
      assets,
      finalreturn,
      finalvol,
      start,
      inProgress,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
</style>
