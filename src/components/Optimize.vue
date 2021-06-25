<template>
  <details v-if="assets.length > 1">
    <summary>🍰 <span class="link">Optimize</span></summary>
    <fieldset>
      The Markowitz optimization tries to find the asset mix that strikes a
      balance between portfolio returns and volatility. This is based on
      historical data and does not guarantee any future gains.
      <div id="piechart"></div>
      <div v-if="finalreturn && finalvol">
        <br />
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
import { assets } from "../modules/asset";
import usePieChart from "../composables/usePieChart";
// Vite specific worker import with module support
import MyWorker from "../modules/markowitz-optimizer?worker";

export default {
  setup() {
    const inProgress = ref(false);
    const finalvol = ref(0);
    const finalreturn = ref(0);
    const weights = ref([]);
    const { chart } = usePieChart(assets);

    const start = () => {
      inProgress.value = true;
      let prices = assets.value.map((item) => [...item.prices]);
      console.log("Message to be sent to worker: ", prices);

      const worker = new MyWorker();
      worker.postMessage({ prices: prices });
      worker.onmessage = function (msg) {
        console.log("Message received from worker: ", msg.data);
        weights.value = msg.data.weights;
        chart.value.updateSeries(weights.value);
        finalreturn.value = msg.data.return;
        finalvol.value = msg.data.vol;
        inProgress.value = false;
        worker.terminate();
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
