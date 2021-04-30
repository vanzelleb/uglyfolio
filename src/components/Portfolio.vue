<template>
  <div class="flexbox">
    <div
      v-for="(item, id) of assets"
      :key="id"
      class="card number"
      @click="selectAsset(item)"
    >
      <figcaption>
        <h4>
          {{ item.dataload.name }} <small>({{ item.ticker }})</small>
        </h4>
        <div v-if="item.buys().length > 0">
          <h5 v-if="!item.isSold()">
            You're {{ change([item]) >= 0 ? "up " : "down " }}
            {{ toLocaleNumber(change([item]), 0) }}
          </h5>
          <h5 v-else :class="{ posColor: returns([item]) >= 0 }">
            You {{ returns([item]) >= 0 ? "made " : "lost " }}
            {{ toLocaleNumber(returns([item]), 0) }}
          </h5>
          <h6>&nbsp;{{ appCurrency }}</h6>
        </div>
        <h5 v-if="item.dataload.technicalAnalysis?.signal">
          <!--<span v-if="item.hasAlarm()" class="ml-2">⏰</span>
          <span v-if="item.forexChange" class="ml-2">💵</span>
          <span v-if="item.return" class="ml-2">💰</span>-->
          Analyst Rating:
          <span v-if="item.dataload.technicalAnalysis?.signal === 'buy'"
            >👍</span
          >
          <span v-if="item.dataload.technicalAnalysis?.signal === 'neutral'">
            😐
          </span>
          <span v-if="item.dataload.technicalAnalysis?.signal === 'sell'"
            >👎</span
          >
        </h5>
        <h5 v-if="item.dataload.trend?.trending">
          <span> / Trending: ✔️</span>
        </h5>
      </figcaption>
      <Sparkline :asset="item" class="sparkline" />
    </div>
  </div>
</template>

<script>
import Sparkline from "../components/Sparkline.vue";
import { assets, useKPI } from "../composables/use-portfolio";
import { computed } from "vue";
import { toLocaleNumber } from "../utils";
import { store } from "../composables/use-store";
import { asset, removeAsset, selectAsset } from "../composables/use-asset";

export default {
  components: {
    Sparkline,
  },
  setup() {
    /*const filteredAssets = computed(() => {
      let filtered = [];
      assets.value.forEach((asset) => {
        if (asset[this.kpi.key]) filtered.push(asset);
      });
      return filtered;
    });*/

    return {
      toLocaleNumber,
      appCurrency: store.settings.currency,
      asset,
      selectAsset,
      assets,
      ...useKPI,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flexbox {
  display: flex;
  overflow: hidden;
  flex-flow: row wrap;
  gap: 10px 5px;
  margin: 1.5rem 0 0 0;
}

.card {
  display: grid;
  grid-template-rows: 1fr auto;
  border: 3px solid;
  border-radius: 5px;
  box-shadow: 6px 6px #bd93f9;
  margin: 0 10px 10px 0;
  padding-top: 0.5rem;
  cursor: pointer;
}

figcaption {
  margin: 0 0 0.4rem 0.8rem;
}

h5,
h6 {
  display: inline-block;
  color: rgb(59, 59, 59);
}
</style>
