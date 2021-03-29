<template>
  <div class="flexbox">
    <fieldset class="col" v-for="(item, id) of assets" :key="id">
      <legend>
        <div class="link" @click="selectAsset(item)">
          {{ item.name }} ({{ item.ticker }})
        </div>
        <!--<span v-if="item.hasAlarm()" class="ml-2">⏰</span>
          <span v-if="item.forexChange" class="ml-2">💵</span>
          <span v-if="item.return" class="ml-2">💰</span>
          <span
            v-if="item.signal && item.signal.toUpperCase().includes('BUY')"
            class="ml-2"
            >👍</span
          >
          <span
            v-if="item.signal && item.signal.toUpperCase().includes('SELL')"
            class="ml-2"
            >👎</span
          >-->
      </legend>
      <h4 v-if="!item.isSold()" class="number">
        {{ change([item]) >= 0 ? "You're up " : "down " }}
        {{ toLocaleNumber(change([item]), 0) }}
      </h4>
      <h4 v-else :class="{ posColor: returns([item]) >= 0 }" class="number">
        {{ returns([item]) >= 0 ? "You made " : "You lost " }}
        {{ toLocaleNumber(returns([item]), 0) }}
      </h4>
      <h5 style="display: inline-block">&nbsp;{{ settings.currency }}</h5>
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
      settings: store.settings,
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
.numberFont {
  font-family: "Lato", sans-serif;
  font-size: 1rem;
}

fieldset {
  margin: 0.4rem 0;
}
</style>
