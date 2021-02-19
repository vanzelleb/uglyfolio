<template>
  <fieldset v-for="(item, id) of assets" :key="id" @click="showDetails(item)">
    <legend>{{ item.name }}</legend>
    <h3 :class="change([item]) >= 0 ? 'posColor' : 'negColor'">
      Change
      {{ toLocaleNumber(change([item]), 0) }}
      <span style="font-size: 10pt">{{ settings.currency }}</span>
    </h3>
    <Chart :prices="item.prices" :dates="item.dates" height="60" />
  </fieldset>

  <!--<template v-if="assets.length > 0">
                <v-row class="mx-1">
                  <v-col
                    class="anim2 py-0 px-0"
                    cols="12"
                    sm="6"
                    md="4"
                    v-for="(item, idx) of assets"
                    :key="`asset-${idx}`"
                  >
                    <v-card
                      light
                      outlined
                      ripple
                      :disabled="item.id === assetID"
                      class="mx-2 mb-2"
                      v-on:click="showDetails(item)"
                    >
                      <v-list-item class="pr-2 px-3">
                        <v-list-item-content class="font-weight-regular py-2">
                          {{ item.name }}
                          <div class="numberFont" :class="numberColor(item)">
                            {{ toLocaleNumber(item[kpi.key], 0) }}
                            <span class="caption">&nbsp;{{ unit }}</span>
                            <span v-if="item.hasAlarm()" class="ml-2">⏰</span>
                            <span v-if="item.forexChange" class="ml-2">💵</span>
                  <span v-if="item.return" class="ml-2">💰</span>
                  <span
                    v-if="item.signal && item.signal.toUpperCase().includes('BUY')"
                    class="ml-2"
                  >👍</span>
                  <span
                    v-if="item.signal && item.signal.toUpperCase().includes('SELL')"
                    class="ml-2"
                      >👎</span>
                          </div>
                        </v-list-item-content>
                        <v-list-item-action class="ma-0">
                          <v-btn small icon>
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                      <div
                        v-if="expanded && item.prices.length > 1"
                        class="hidden-sm-and-up"
                        style="height: 55px"
                      >
                        <Sparkline
                          :values="item.prices"
                          height="50"
                          :kpi="item.change"
                        />
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </template>-->
  <!-- </ion-content>
  </div>-->
</template>

<script>
import Chart from "../components/Chart.vue";
import SearchAsset from "../components/SearchAsset.vue";
import { usePortfolio } from "../composables/use-portfolio";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { toLocaleNumber } from "../utils";
import { store, asset, assets, setAsset } from "../composables/use-store";

export default {
  components: {
    SearchAsset,
    Chart,
  },
  setup() {
    const router = useRouter();

    /*const filteredAssets = computed(() => {
      let filtered = [];
      assets.value.forEach((asset) => {
        if (asset[this.kpi.key]) filtered.push(asset);
      });
      return filtered;
    });*/

    const hasAssets = computed(() => store.assetList.length > 0);

    const showDetails = (item) => {
      // create and copy a new object to avoid copying a reference to the original asset
      setAsset(item);
      router.push("/details");
    };

    return {
      hasAssets,
      toLocaleNumber,
      showDetails,
      settings: store.settings,
      asset,
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
