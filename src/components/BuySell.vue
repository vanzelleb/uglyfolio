<template>
  <details>
    <summary><span class="link">Buy & Sell</span></summary>
    <fieldset>
      <legend>Shares bought</legend>
      You bought {{ totalSharesBought(asset) }} shares for
      {{ toLocaleNumber(totalBuyValue(asset), 2) }} {{ appCurrency }}
      <br />
      <template v-for="(trx, id) of asset.trxns" :key="`buy-${id}`">
        <details v-if="trx.type === 'Buy'">
          <summary class="link">
            {{ trx.date }}: {{ toLocaleNumber(trx.value, 2) }} {{ appCurrency }}
          </summary>
          <Transaction :asset="asset" :trxIdx="id" type="Buy" />
        </details>
      </template>
      <details :open="buyFormOpen">
        <summary class="link" @click.prevent="buyFormOpen = !buyFormOpen">
          Add shares
        </summary>
        <Transaction :asset="asset" type="Buy" />
      </details>
    </fieldset>
    <fieldset v-if="buys(asset).length > 0">
      <legend>Shares sold</legend>
      You sold {{ totalSharesSold(asset) }} shares for
      {{ toLocaleNumber(totalSellValue(asset), 2) }} {{ appCurrency }}
      <br />
      <template v-for="(trx, id) of asset.trxns" :key="`sell-${id}`">
        <details v-if="trx.type === 'Sell'">
          <summary class="link">
            {{ trx.date }}: {{ toLocaleNumber(trx.value, 2) }} {{ appCurrency }}
          </summary>
          <Transaction :asset="asset" :trxIdx="id" type="Sell" />
        </details>
      </template>
      <details :open="sellFormOpen">
        <summary class="link" @click.prevent="sellFormOpen = !sellFormOpen">
          Sell shares
        </summary>
        <Transaction :asset="asset" type="Sell" />
      </details>
    </fieldset>
  </details>
</template>

<script>
import { computed, ref, watch } from "vue";
import Transaction from "./Transaction.vue";
import { toLocaleNumber } from "../modules/utils";
import {
  sells,
  buys,
  totalSharesSold,
  totalSharesBought,
  totalSellValue,
  totalBuyValue,
} from "../modules/stats";
import { appCurrency } from "../modules/currencies";

export default {
  components: {
    Transaction,
  },
  props: ["asset"],
  setup(props) {
    const buyFormOpen = ref(false);
    const sellFormOpen = ref(false);

    watch(
      () => buys(props.asset).length,
      () => {
        buyFormOpen.value = false;
      }
    );

    watch(
      () => sells(props.asset).length,
      () => {
        sellFormOpen.value = false;
      }
    );

    return {
      buyFormOpen,
      sellFormOpen,
      toLocaleNumber,
      appCurrency,
      sells,
      buys,
      totalSharesSold,
      totalSharesBought,
      totalSellValue,
      totalBuyValue,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
</style>
