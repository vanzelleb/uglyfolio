<template>
  <div v-cloak class="noselect">
    <Header />
    <main>
      <div v-if="asset.name">
        <Info />
        <Form />
      </div>
      <div v-else>
        <Settings />
        <KPIs />
        <SearchAsset />
        <Portfolio />
      </div>
    </main>
  </div>
</template>


<script>
import { useAPI } from "./composables/use-api";
import { store, asset, initState } from "./composables/use-store";
import { onMounted, watch, computed } from "vue";
import { today } from "./utils";
import Settings from "./components/Settings.vue";
import KPIs from "./components/KPIs.vue";
import SearchAsset from "./components/SearchAsset.vue";
import Portfolio from "./components/Portfolio.vue";
import Form from "./components/Form.vue";
import Info from "./components/Info.vue";
import Header from "./components/Header.vue";
import Asset from "./asset-class";

export default {
  components: {
    KPIs,
    Portfolio,
    SearchAsset,
    Info,
    Form,
    Settings,
    Header,
  },
  setup() {
    initState();

    const assets = computed(() =>
      // convert items into Asset class before using them
      store.assetList.map((item) => new Asset(item))
    );

    onMounted(() => {
      // do all the updates once the application is mounted
      for (const item of assets.value) {
        if (!item.isUpdated()) {
          useAPI.requestHandler("history", { asset: item });
          if (!item.isSold()) {
            useAPI.requestHandler("quote", { asset: item });
            useAPI.requestHandler("signal", { asset: item });
            useAPI.requestHandler("target", { asset: item });
          }
        }
      }

      /*async function fetchBenchmarkPrices() {
  store.state.settings.benchmark.dateBuy = store.getters.firstPortfolioDate;
  if (!store.state.settings.benchmark.isUpdated()) {
    if (!this.benchmark.lastTrade || this.benchmark.lastTrade < this.yesterday)
      await dispatch("getQuote", this.benchmark);
    store.commit("setBenchmark", this.benchmark);
  }
}*/
    });

    watch(
      () => asset.name,
      (name, prevName) => {
        window.scrollTo(0, 0);
      }
    );

    return {
      asset,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
main {
  margin: 8px 8px;
}
</style>

