<template>
  <Header />
  <main>
    <div class="container">
      <div v-if="asset.name">
        <Info v-if="asset.id" />
        <News v-if="asset.id" />
        <Form />
      </div>
      <div v-else>
        <Settings />
        <KPIs />
        <SearchAsset />
        <Portfolio />
      </div>
    </div>
  </main>
  <footer>
    <div>
      <small style="text-align: center">
        <p>
          An experimental app for tracking the performance of a stock portfolio.
          Data provided by
          <a href="https://iexcloud.io">IEX Cloud</a>
          and
          <a href="https://finnhub.io/">Finnhub.io</a>
        </p>
        <br />
        <p>
          Made by
          <a href="https://twitter.com/VanZelleb" target="_blank">vanzelleb</a>
        </p>
      </small>
    </div>
  </footer>
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
import News from "./components/News.vue";
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
    News,
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

    // scroll to the top of the page when the detail screen is opened or closed
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
  padding: 8px 8px;
}

footer {
  padding: 20px 8px;
}
</style>

