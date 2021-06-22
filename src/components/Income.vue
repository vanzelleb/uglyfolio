<template>
  <details>
    <summary><span class="link">Income</span></summary>
    <fieldset>
      <legend>Dividends received</legend>
      You received {{ totalPayoutValue(asset) }} {{ appCurrency }} in dividends.
      <br />
      <template v-for="(payout, idx) of payouts(asset)" :key="`payout-${idx}`">
        <details>
          <summary class="link">
            {{ payout.date }}: {{ toLocaleNumber(payout.value, 2) }}
            {{ appCurrency }}
          </summary>
          <Payout :asset="asset" :listIdx="idx" type="Payout" />
        </details>
      </template>
      <details :open="payoutFormOpen">
        <summary class="link" @click.prevent="payoutFormOpen = !payoutFormOpen">
          Add dividend
        </summary>
        <Payout :asset="asset" type="Payout" />
      </details>
    </fieldset>
  </details>
</template>

<script>
import { computed, ref, watch } from "vue";
import Payout from "./Payout.vue";
import { toLocaleNumber } from "../modules/utils";
import { totalPayoutValue, payouts } from "../modules/stats";
import { appCurrency } from "../modules/currencies";

export default {
  components: {
    Payout,
  },
  props: ["asset"],
  setup(props) {
    const payoutFormOpen = ref(false);

    watch(
      () => props.asset.trxns.length,
      () => {
        payoutFormOpen.value = false;
      }
    );

    return {
      appCurrency,
      toLocaleNumber,
      payouts,
      payoutFormOpen,
      totalPayoutValue,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
</style>
