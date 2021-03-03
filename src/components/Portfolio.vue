<template>
  <div class="container">
    <div class="flexbox">
      <fieldset
        @click="setAsset(item)"
        class="col"
        v-for="(item, id) of assets"
        :key="id"
      >
        <legend>
          {{ item.name }}
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
        <h4 v-if="!item.dateSell" style="display: inline-block">
          {{ change([item]) >= 0 ? "Up " : "Down " }}
          {{ toLocaleNumber(change([item]), 0) }}
        </h4>
        <h4 v-else style="display: inline-block">
          {{ returns([item]) >= 0 ? "You made " : "You lost " }}
          {{ toLocaleNumber(returns([item]), 0) }}
        </h4>
        <h5 style="display: inline-block">&nbsp;{{ settings.currency }}</h5>
        <Chart :prices="item.prices" :dates="item.dates" height="60" />
      </fieldset>
    </div>
  </div>
</template>

<script>
import Chart from "../components/Chart.vue";
import SearchAsset from "../components/SearchAsset.vue";
import { usePortfolio } from "../composables/use-portfolio";
import { computed } from "vue";
import { toLocaleNumber } from "../utils";
import { store, asset, assets, setAsset } from "../composables/use-store";

export default {
  components: {
    SearchAsset,
    Chart,
  },
  setup() {
    /*const filteredAssets = computed(() => {
      let filtered = [];
      assets.value.forEach((asset) => {
        if (asset[this.kpi.key]) filtered.push(asset);
      });
      return filtered;
    });*/

    const hasAssets = computed(() => store.assetList.length > 0);

    return {
      hasAssets,
      toLocaleNumber,
      showDetails,
      settings: store.settings,
      asset,
      setAsset,
      assets,
      ...usePortfolio,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.numberFont {
  font-family: "Lato", sans-serif;
  font-size: 12pt;
}
</style>
