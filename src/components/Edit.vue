<template>
  <details>
    <summary><span class="link">Buy & Sell</span></summary>
    <fieldset>
      <legend>Shares owned</legend>
      You bought {{ totalSharesBought(asset) }} shares for
      {{ toLocaleNumber(totalBuyValue(asset), 2) }} {{ appCurrency }}
      <br />
      <details v-for="(trx, id) of buys(asset)" :key="`buy-${id}`">
        <summary class="link">
          {{ trx.date }}: {{ toLocaleNumber(trx.value, 2) }} {{ appCurrency }}
        </summary>
        <Transaction :asset="asset" :trxId="id" type="Buy" />
      </details>
      <details :open="!trxListChange">
        <summary class="link">Add shares</summary>
        <Transaction :asset="asset" type="Buy" />
      </details>
    </fieldset>
    <fieldset v-if="buys(asset).length > 0">
      <legend>Shares sold</legend>
      You sold {{ totalSharesSold(asset) }} shares for
      {{ toLocaleNumber(totalSellValue(asset), 2) }} {{ appCurrency }}
      <br />
      <details v-for="(trx, id) of sells(asset)" :key="`sell-${id}`">
        <summary class="link">
          {{ trx.date }}: {{ toLocaleNumber(trx.value, 2) }} {{ appCurrency }}
        </summary>
        <Transaction :asset="asset" :trxId="id" type="Sell" />
      </details>
      <details :open="!trxListChange">
        <summary class="link">Sell shares</summary>
        <Transaction :asset="asset" type="Sell" />
      </details>
    </fieldset>
  </details>
</template>

<script>
import { computed, ref, watch } from "vue";
import Transaction from "./Transaction.vue";
import { toLocaleNumber } from "../utils";
import * as useAsset from "../composables/useAsset";
import { appCurrency } from "../composables/useCurrencies";

export default {
  components: {
    Transaction,
  },
  props: ["asset"],
  setup(props) {
    const trxListChange = ref(true);
    const trxCount = computed(() => props.asset.trxns.length);

    watch(trxCount, () => {
      trxListChange.value = true;
    });

    return {
      trxListChange,
      toLocaleNumber,
      appCurrency,
      ...useAsset,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
</style>
