<template>
  <div class="flexbox">
    <fieldset class="col" v-for="(item, id) of assets" :key="id">
      <legend class="link" @click="selectAsset(item)">
        {{ item.name }} ({{ item.ticker }})
      </legend>
      <div v-if="item.buys().length > 0" class="summary">
        <h4 v-if="!item.isSold()" class="number">
          You're {{ change([item]) >= 0 ? "up " : "down " }}
          {{ toLocaleNumber(change([item]), 0) }}
        </h4>
        <h4 v-else :class="{ posColor: returns([item]) >= 0 }" class="number">
          You {{ returns([item]) >= 0 ? "made " : "lost " }}
          {{ toLocaleNumber(returns([item]), 0) }}
        </h4>
        <h6 class="number">&nbsp;{{ appCurrency }}</h6>
      </div>
      <div class="summary">
        <!--<span v-if="item.hasAlarm()" class="ml-2">⏰</span>
          <span v-if="item.forexChange" class="ml-2">💵</span>
          <span v-if="item.return" class="ml-2">💰</span>-->
        <span v-if="item.dataload.technicalAnalysis?.signal === 'buy'">👍</span>
        <h5 v-if="item.dataload.technicalAnalysis?.signal === 'neutral'">
          Analyst Rating: 😐
        </h5>
        <span v-if="item.dataload.technicalAnalysis?.signal === 'sell'"
          >👎</span
        >
      </div>
      <Sparkline :asset="item" />
    </fieldset>
  </div>
</template>

<script>
import Sparkline from "../components/Sparkline.vue";
import { assets, useKPI } from "../composables/use-portfolio";
import { computed } from "vue";
import { toLocaleNumber } from "../utils";
import { store, asset, selectAsset } from "../composables/use-store";
import Asset from "../asset-class";

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
h4,
h5,
h6 {
  display: inline-block;
}

legend {
  margin: 0 0 0 0.8rem;
  padding: 0 0;
}

.summary {
  margin: 5px 0 0 0.8rem;
  padding: 0 0;
}

.numberFont {
  font-family: "Lato", sans-serif;
  font-size: 1rem;
}

fieldset {
  margin: 0.4rem 0;
  padding: 0.4rem 0 0 0;
}
</style>
