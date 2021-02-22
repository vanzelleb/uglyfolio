<template>
  <div v-cloak class="noselect">
    <header>
      <h1 class="handFont" @click="$router.push('/')">Uglyfolio</h1>
      <Settings />
    </header>
    <router-view />
  </div>
</template>


<script>
import { useAPI } from "./composables/use-api";
import { store, assets, initState } from "./composables/use-store";
import { onMounted, ref, reactive, provide, readonly } from "vue";
import { today } from "./utils";
import SearchAsset from "./components/SearchAsset.vue";
import Settings from "./components/Settings.vue";
import KPIs from "./components/KPIs.vue";

export default {
  components: {
    SearchAsset,
    Settings,
    KPIs,
  },
  setup() {
    initState();

    onMounted(() => {
      // do all the updates once the application is mounted
      useAPI.updateAssets();
      useAPI.updateFXRates();

      /*async function fetchBenchmarkPrices() {
  store.state.settings.benchmark.dateBuy = store.getters.firstPortfolioDate;
  if (!store.state.settings.benchmark.isUpdated()) {
    if (!this.benchmark.lastTrade || this.benchmark.lastTrade < this.yesterday)
      await dispatch("getQuote", this.benchmark);
    store.commit("setBenchmark", this.benchmark);
  }
}*/
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

