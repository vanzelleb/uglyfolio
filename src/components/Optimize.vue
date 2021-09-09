<template>
  <details v-if="assets.length > 1">
    <summary>🍰 <span class="link">Optimize</span></summary>
    <fieldset>
      <small>
        Optimize for the asset mix that strikes a balance between portfolio
        returns and volatility. This is based on historical data and does not
        guarantee any future gains.</small
      >

      <button @click="start()" :disabled="inProgress">
        <template v-if="!inProgress">Optimize</template
        ><template v-else>Doing the math...</template>
      </button>
      <div v-if="vol && ret">
        <h5>{{ ret.toFixed(0) }}% expected return</h5>
        <h5>{{ vol.toFixed(0) }}% expected volatility</h5>
      </div>
      <div id="weights"></div>
    </fieldset>
  </details>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { assets } from "../modules/asset";
import usePieChart from "../composables/usePieChart";
// Vite specific worker import with module support
import MyWorker from "../modules/markowitz-optimizer?worker";

const inProgress = ref(false);
const vol = ref(null);
const ret = ref(null);
const weights = ref([]);
const { chart } = usePieChart("weights", assets);

const start = () => {
  inProgress.value = true;
  const pricesArray = assets.value.map((item) => [...item.prices]);
  console.log("Prices to be sent to worker: ", pricesArray);

  const worker = new MyWorker();
  worker.postMessage({ pricesArray: pricesArray });
  worker.onmessage = function (msg) {
    console.log("Message received from worker: ", msg.data);
    weights.value = msg.data.weights;
    ret.value = msg.data.ret;
    vol.value = msg.data.vol;
    chart.value.updateSeries(weights.value);
    document.getElementById("weights").style.display = "block";
    inProgress.value = false;
    worker.terminate();
  };
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
#weights {
  display: none;
}

button {
  display: block;
}
</style>
