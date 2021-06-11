<template>
  <Header :asset="asset" />

  <div class="container" id="mainContainer">
    <main id="main">
      <div v-if="isAssetSelected">
        <DetailChart :asset="asset" />
        <Stats :asset="asset" />
        <Edit :asset="asset" />
        <Info :asset="asset" />
        <News :asset="asset" />
        <div class="space-between">
          <button v-if="asset.id" @click="remove(asset)">❌ Delete</button>
          <button @click="close()">🏠 Home</button>
        </div>
      </div>
      <div v-else>
        <Settings />
        <KPIs :assets="assets" />
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
import { Asset } from "../composables/useAsset";
import {
  initState,
  assets,
  saveAsset,
  removeAsset,
} from "../composables/useStore";
import useDataUpdater from "../composables/useDataUpdater";
import { reactive, onMounted, computed } from "vue";
import { today } from "../utils";
import DetailChart from "./DetailChart.vue";
import Settings from "./Settings.vue";
import KPIs from "./KPIs.vue";
import SearchAsset from "./SearchAsset.vue";
import Card from "./Card.vue";
import News from "./News.vue";
import Edit from "./Edit.vue";
import Info from "./Info.vue";
import Header from "./Header.vue";
import Stats from "./Stats.vue";
import Optimize from "./Optimize.vue";

export default {
  components: {
    Optimize,
    Stats,
    DetailChart,
    KPIs,
    Card,
    SearchAsset,
    Info,
    Edit,
    News,
    Settings,
    Header,
  },

  setup() {
    initState();
    const asset = reactive(new Asset());
    const { getAssetAll, getFXRate } = useDataUpdater();

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

    const selectAsset = (item) => {
      Object.assign(asset, new Asset(item));
      console.log(asset);
    };

    const isAssetSelected = computed(() => {
      return !!asset.dataload.name;
    });

    onMounted(() => {
      // update application data
    });

    return {
      asset,
      assets,
      close,
      remove,
      selectAsset,
      isAssetSelected,
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

