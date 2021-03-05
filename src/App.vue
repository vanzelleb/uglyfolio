<template>
  <div v-cloak class="noselect">
    <header>
      <h1 class="handFont">Uglyfolio</h1>
    </header>
    <main>
      <div v-if="asset.name">
        <h3>{{ asset.name }}</h3>
        <div>
          <button @click="setAsset()">❌ Close</button>
          <button v-if="asset.id" @click="remove(asset)">🗑️ Delete</button>
        </div>
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
import {
  store,
  asset,
  assets,
  setAsset,
  removeAsset,
  initState,
} from "./composables/use-store";
import { onMounted, ref, reactive, provide, readonly } from "vue";
import { today } from "./utils";
import Settings from "./components/Settings.vue";
import KPIs from "./components/KPIs.vue";
import SearchAsset from "./components/SearchAsset.vue";
import Portfolio from "./components/Portfolio.vue";
import Form from "./components/Form.vue";
import Info from "./components/Info.vue";

export default {
  components: {
    KPIs,
    Portfolio,
    SearchAsset,
    Info,
    Form,
    Settings,
  },
  setup() {
    initState();

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

    const remove = (asset) => {
      if (confirm("Are you sure you want delete it?")) {
        removeAsset(asset);
      }
    };

    return {
      remove,
      asset,
      setAsset,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

