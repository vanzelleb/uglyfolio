<template>
  <Header />

  <div class="container" id="mainContainer">
    <main id="main">
      <div v-if="asset.dataload.name">
        <DetailChart />
        <Stats />
        <Edit />
        <Info />
        <News />
        <div class="space-between">
          <button v-if="asset.id" @click="remove(asset)">❌ Delete</button>
          <button @click="close()">🏠 Home</button>
        </div>
      </div>
      <div v-else>
        <Settings />
        <KPIs />
        <Optimize />
        <SearchAsset />
        <Portfolio />
      </div>
    </main>
  </div>
  <div class="container">
    <footer>
      <p>
        An experimental app for tracking of a stock portfolio. Data provided by
        <a href="https://iexcloud.io">IEX Cloud</a>
        and
        <a href="https://finnhub.io/">Finnhub.io</a>
      </p>
      <p>
        Made by
        <a href="https://twitter.com/VanZelleb" target="_blank">vanzelleb</a>
      </p>
    </footer>
  </div>
</template>


<script>
import { initState } from "../composables/use-store";
import { asset, removeAsset, selectAsset } from "../composables/use-asset";
import { onMounted, watch, computed } from "vue";
import { today } from "../utils";
import DetailChart from "./DetailChart.vue";
import Settings from "./Settings.vue";
import KPIs from "./KPIs.vue";
import SearchAsset from "./SearchAsset.vue";
import Portfolio from "./Portfolio.vue";
import News from "./News.vue";
import Edit from "./Edit.vue";
import Info from "./Info.vue";
import Header from "./Header.vue";
import Stats from "./Stats.vue";
import Optimize from "./Optimize.vue";
import useDataUpdater from "../composables/useDataUpdater";
import { assets } from "../composables/use-portfolio";

export default {
  components: {
    Optimize,
    Stats,
    DetailChart,
    KPIs,
    Portfolio,
    SearchAsset,
    Info,
    Edit,
    News,
    Settings,
    Header,
  },
  setup() {
    initState();

    // scroll to the top of the page when the detail screen is opened or closed
    /*watch(
      () => asset.dataload.name,
      (name, prevName) => {
        window.scrollTo(0, 0);
      }
    );*/

    const remove = (asset) => {
      if (confirm("Are you sure you want delete this asset?")) {
        removeAsset(asset);
        close();
      }
    };

    const close = () => {
      // clear global asset variable in order to return to home screen
      selectAsset(null);
    };

    onMounted(() => {
      assets.value.forEach((asset) => {
        let { refreshAll } = useDataUpdater(asset);
        refreshAll();
      });
    });

    return {
      asset,
      close,
      remove,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
main {
  width: 100%;
}

footer {
  width: 100%;
  font-size: 0.8rem;
  text-align: center;
}

.space-between {
  display: flex;
  justify-content: space-between;
}
</style>

