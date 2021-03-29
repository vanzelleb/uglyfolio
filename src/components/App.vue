<template>
  <Header />
  <main>
    <div class="container">
      <div v-if="asset.name">
        <Chart />
        <Info />
        <News />
        <Edit />
      </div>
      <div v-else>
        <Settings />
        <KPIs />
        <SearchAsset />
        <Portfolio />
      </div>
    </div>
  </main>
  <footer style="text-align: center">
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
  </footer>
</template>


<script>
import { store, asset, initState } from "../composables/use-store";
import { onMounted, watch, computed } from "vue";
import { today } from "../utils";
import Chart from "./Chart.vue";
import Settings from "./Settings.vue";
import KPIs from "./KPIs.vue";
import SearchAsset from "./SearchAsset.vue";
import Portfolio from "./Portfolio.vue";
import News from "./News.vue";
import Edit from "./Edit.vue";
import Info from "./Info.vue";
import Header from "./Header.vue";

export default {
  components: {
    Chart,
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
  padding: 0 12px;
}

footer {
  padding: 20px 8px;
  font-size: 0.8rem;
}
</style>
