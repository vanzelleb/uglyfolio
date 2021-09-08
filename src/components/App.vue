<template>
  <Header :asset="asset" :class="{ scrolled: scrolled }" />
  <main id="main">
    <section>
      <div></div>
      <div id="content" v-if="asset.dataload.name">
        <DetailChart :asset="asset" />
        <AssetStats :asset="asset" />
        <BuySell :asset="asset" />
        <Income :asset="asset" />
        <Info :asset="asset" />
        <News :asset="asset" />
        <button v-if="asset.id" @click="remove(asset)">❌ Delete</button>
      </div>
      <div id="content" v-else>
        <Settings />
        <PortfolioStats :assets="assets" />
        <Optimize :assets="assets" />
        <AddAsset />
        <div class="card-grid">
          <Card
            v-for="(item, id) of assets"
            :key="id"
            @click="selectAsset(item)"
            :asset="item"
          />
        </div>
      </div>
      <div></div>
    </section>
    <footer>
      <p>
        Stock data provided by
        <a href="https://iexcloud.io">IEX Cloud</a>
        and
        <a href="https://finnhub.io/">Finnhub.io</a>
      </p>
      <p>
        <b>
          Made by
          <a
            href="https://twitter.com/VanZelleb"
            target="_blank"
            rel="noreferrer"
            >vanzelleb</a
          >
        </b>
      </p>
    </footer>
  </main>
</template>


<script setup>
import { Asset, assets, saveAsset, removeAsset } from "../modules/asset";
import { store } from "../modules/store";
import { ref, reactive, onMounted, computed } from "vue";
import { today } from "../modules/utils";
import DetailChart from "./DetailChart.vue";
import Settings from "./Settings.vue";
import PortfolioStats from "./PortfolioStats.vue";
import AddAsset from "./AddAsset.vue";
import Card from "./Card.vue";
import News from "./News.vue";
import Income from "./Income.vue";
import BuySell from "./BuySell.vue";
import Info from "./Info.vue";
import Header from "./Header.vue";
import AssetStats from "./AssetStats.vue";
import Optimize from "./Optimize.vue";
import useCurrencyApi from "../composables/useCurrencyApi";
import useFxApi from "../composables/useFxApi";
import { currencies } from "../modules/currencies";

const scrolled = ref(false);
const asset = reactive(new Asset());

if (localStorage.store) {
  // copy store from local storage
  Object.assign(store, JSON.parse(localStorage.store));
  console.log("Local storage loaded into app.");
}

onMounted(() => {
  const { getCurrencies } = useCurrencyApi();
  const { getFx } = useFxApi();

  // add more currencies to the default one
  if (currencies.value.length === 1) {
    getCurrencies();
  }
  // update the exchange rates for all transactions
  assets.value.forEach((asset) => {
    asset.trxns.forEach((trx) => {
      getFx(asset, today);
      getFx(asset, trx.date);
    });
  });

  let scrollArea = document.getElementById("main");
  scrollArea.addEventListener("scroll", () => {
    scrolled.value = scrollArea.scrollTop > 0;
  });
});

const remove = (asset) => {
  if (confirm("Are you sure you want delete this asset?")) {
    removeAsset(asset);
    close();
  }
};

const selectAsset = (item) => {
  Object.assign(asset, new Asset(item));
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
  grid-gap: 1rem;
  padding: 1.2rem 0;
}

.scrolled {
  -webkit-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  -moz-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
}
</style>

