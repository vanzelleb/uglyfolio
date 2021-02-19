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
<style>
[v-cloak] {
  display: none;
}

a,
summary {
  outline: none;
  text-decoration: none;
}

body {
  font-family: "Lato", sans-serif;
}

.noselect {
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.posColor {
  color: "#1B998B";
}

.negColor {
  color: "#FF4560";
}

.numberFont {
  font-family: "Lato", sans-serif;
}

.handFont {
  font-family: "Indie Flower", cursive;
}

.gradientBg {
  background: #ede7f6;
  background: -webkit-linear-gradient(
    to bottom,
    #ede7f6,
    #ffffff
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #ede7f6,
    #ffffff
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

label {
  display: block;
}

input,
label,
details,
fieldset {
  margin: 0.4rem 0;
}

legend {
  font-weight: bold;
}

details,
summary {
  cursor: pointer;
  margin: 0.8rem 0;
}

summary {
  font-size: 14pt;
  font-weight: bold;
}

button {
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  margin: 4px 2px;
}

dialog {
  text-align: center;
  border: none;
  padding: 2rem;
  border-radius: 6px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.1), 0 0 10px rgba(0, 0, 0, 0.25);
  max-width: 90vw;
}
</style>

