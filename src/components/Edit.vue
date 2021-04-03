<template>
  <fieldset>
    <legend>Shares owned</legend>
    You bought {{ asset.totalSharesBought() }} shares for
    {{ toLocaleNumber(asset.totalBuyValue(), 2) }} {{ appCurrency }}
    <br />
    <details v-for="(buy, id) of buys" :key="`buy-${id}`">
      <summary class="link">
        {{ buy.date }}: {{ toLocaleNumber(buy.value, 2) }} {{ appCurrency }}
      </summary>
      <Buy :id="id" />
    </details>
    <details :open="!trxListChange">
      <summary class="link">Add shares</summary>
      <Buy />
    </details>
  </fieldset>
  <fieldset v-if="buys.length > 0">
    <legend>Shares sold</legend>
    You sold {{ asset.totalSharesSold() }} shares for
    {{ toLocaleNumber(asset.totalSellValue(), 2) }} {{ appCurrency }}
    <br />
    <details v-for="(sell, id) of sells" :key="`sell-${id}`">
      <summary class="link">
        {{ sell.date }}: {{ toLocaleNumber(sell.value, 2) }} {{ appCurrency }}
      </summary>
      <Sell :id="id" />
    </details>
    <details :open="!trxListChange">
      <summary class="link">Sell shares</summary>
      <Sell />
    </details>
  </fieldset>
</template>

<script>
import { computed, reactive, ref, watch } from "vue";
import Buy from "./Buy.vue";
import Sell from "./Sell.vue";
import { toLocaleNumber } from "../utils";
import { store } from "../composables/use-store";
import { asset } from "../composables/use-asset";

export default {
  components: {
    Buy,
    Sell,
  },
  setup() {
    const trxListChange = ref(null);
    const trxCount = computed(() => asset.trxns.length);
    const buys = computed(() => asset.buys());
    const sells = computed(() => asset.sells());

    watch(
      () => trxCount.value,
      (count, prevCount) => {
        console.log("Transaction count changed");
        trxListChange.value = true;
      }
    );

    return {
      buys,
      sells,
      trxListChange,
      asset,
      toLocaleNumber,
      appCurrency: store.settings.currency,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
</style>
