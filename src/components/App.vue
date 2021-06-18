<template>
  <Header :asset="asset" />

  <div class="container" id="mainContainer">
    <main id="main">
      <template v-if="asset.dataload.name">
        <DetailChart :asset="asset" />
        <AssetStats :asset="asset" />
        <BuySell :asset="asset" />
        <Info :asset="asset" />
        <News :asset="asset" />
        <div class="space-between">
          <button v-if="asset.id" @click="remove(asset)">❌ Delete</button>
          <button @click="close()">🏠 Home</button>
        </div>
      </template>
      <template v-else>
        <Settings />
        <PortfolioStats :assets="assets" />
        <Optimize :assets="assets" />
        <SearchAsset />
        <div class="flexbox" id="flexbox">
          <Card
            v-for="(item, id) of assets"
            :key="id"
            @click="selectAsset(item)"
            :asset="item"
          />
        </div>
      </template>
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
import { Asset, assets, saveAsset, removeAsset } from "../modules/asset";
import { store } from "../modules/store";
import { reactive, onMounted, computed } from "vue";
import { today } from "../modules/utils";
import DetailChart from "./DetailChart.vue";
import Settings from "./Settings.vue";
import PortfolioStats from "./PortfolioStats.vue";
import SearchAsset from "./SearchAsset.vue";
import Card from "./Card.vue";
import News from "./News.vue";
import BuySell from "./BuySell.vue";
import Info from "./Info.vue";
import Header from "./Header.vue";
import AssetStats from "./AssetStats.vue";
import Optimize from "./Optimize.vue";
import useCurrencyApi from "../composables/useCurrencyApi";
import useFxApi from "../composables/useFxApi";
import { currencies } from "../modules/currencies";

export default {
  components: {
    Optimize,
    AssetStats,
    DetailChart,
    PortfolioStats,
    Card,
    SearchAsset,
    Info,
    BuySell,
    News,
    Settings,
    Header,
  },

  setup() {
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
          getFx(today);
          getFx(trx.date);
        });
      });
    });

    const remove = (asset) => {
      if (confirm("Are you sure you want delete this asset?")) {
        removeAsset(asset);
        close();
      }
    };

    const close = () => {
      // clear asset variable in order to return from detail screen
      selectAsset(null);
    };

    const selectAsset = (item) => {
      Object.assign(asset, new Asset(item));
    };

    return {
      asset,
      assets,
      close,
      remove,
      selectAsset,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
main {
  width: 100%;
}

.flexbox {
  display: flex;
  overflow: hidden;
  flex-flow: row wrap;
  gap: 15px 15px;
  padding: 1.2rem 0 0.4rem 0;
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

