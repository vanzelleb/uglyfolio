<template>
  <details>
    <summary>🏆 <span class="link">Portfolio Performance</span></summary>
    <fieldset>
      <legend>KPIs</legend>
      <table>
        <tr v-for="(kpi, name) in kpis" :key="name">
          <td style="font-size: 12pt">{{ name }}:</td>
          <td class="number" style="font-size: 12pt; text-align: right">
            {{ kpi.value }}
            <span style="font-size: 10pt">&nbsp;{{ kpi.unit }}</span>
          </td>
        </tr>
      </table>
    </fieldset>
  </details>
</template>

<script>
import { assets, useKPI } from "../composables/use-portfolio";
import { reactive, computed, watch } from "vue";
import { store } from "../composables/use-store";
import { toLocaleNumber } from "../utils";

export default {
  setup() {
    // gets executed when currency changes
    watch(
      () => store.settings.currency,
      (currency, prevCurrency) => {
        console.log("currency change in KPI detected");
      }
    );

    const kpis = reactive({
      "Currently invested": {
        icon: "🧾",
        subtitle: "Purchase value of your assets.",
        info: "https://www.investopedia.com/terms/i/investment.asp",
        value: toLocaleNumber(useKPI.invested(assets.value), 0),
        unit: computed(() => store.settings.currency),
      },
      "Day's/Total change": {
        subtitle: "How much you are up/down.",
        info: null,
        value:
          toLocaleNumber(useKPI.lastChange(assets.value), 0) +
          "/" +
          toLocaleNumber(useKPI.change(assets.value), 0),
        unit: computed(() => store.settings.currency),
      },
      "Currency effects": {
        icon: "😢",
        subtitle: "Effect of currency exchange rate changes.",
        info: null,
        value: computed(() => toLocaleNumber(useKPI.FXChange(assets.value), 0)),
        unit: computed(() => store.settings.currency),
      },
      "Profit/Loss from selling": {
        icon: "💰",
        subtitle: "Gain/Loss from sold assets & dividends.",
        info: "https://www.investopedia.com/terms/r/return.asp",
        value: toLocaleNumber(useKPI.returns(assets.value), 0),
        unit: computed(() => store.settings.currency),
      },
      "Dividend payouts": {
        icon: "🗓️",
        subtitle: "Income from receiving dividends.",
        info: "https://www.investopedia.com/terms/d/dividend.asp",
        value: toLocaleNumber(useKPI.income(assets.value), 0),
        unit: computed(() => store.settings.currency),
      },
      "Current balance": {
        icon: "🏦",
        subtitle: "Your assets' current value.",
        info: "https://www.investopedia.com/terms/m/marketvalue.asp",
        value: computed(() => toLocaleNumber(useKPI.value(assets.value), 0)),
        unit: computed(() => store.settings.currency),
      },
      /*
  {
    name: "Avg. monthly income",
    subtitle: "Average monthly change of your portfolio's valuation.",
    info: null,
    method: "monthlyMean",
    value: null,
    key: "avgPayout",
    unit: "appCurrency"
  },
  {
    name: "Avg. monthly change",
    subtitle: "Average monthly change of your portfolio's valuation.",
    info: null,
    method: "monthlyMean",
    value: null,
    key: "avgChange",
    unit: "appCurrency"
  },
  {
    name: "Taxes",
    subtitle: "How much of your gains you need to let go of.",
    info: null,
    values: Object.values(this.$store.store.stats["Taxes EUR"]),
    method: "sum",
    kpi: null,
    unit: this.$store.store.settings.currency
  },*/ "Missed Profit": {
        icon: "😢",
        subtitle: "Drop in value from highest price.",
        info: null,
        value: toLocaleNumber(useKPI.missedGain(assets.value), 0),
        unit: computed(() => store.settings.currency),
      },
      "Delta to target": {
        icon: "😢",
        subtitle: "Predicted change based on avg. price target.",
        info: null,
        value: toLocaleNumber(useKPI.diffToTargetPrice(assets.value), 0),
        unit: computed(() => store.settings.currency),
      },
    });

    return { kpis };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
