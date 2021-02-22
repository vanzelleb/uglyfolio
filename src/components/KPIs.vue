<template>
  <details>
    <summary>🏆 <span class="link">Portfolio Stats</span></summary>
    <fieldset>
      <legend>Current balance</legend>
      <table>
        <tr v-for="(kpi, name) in kpis" :key="name">
          <td style="font-size: 12pt">{{ name }}:</td>
          <td style="font-size: 12pt; text-align: right">
            {{ toLocaleNumber(kpi.value, 0) }}
            <span style="font-size: 8pt">&nbsp;{{ kpi.unit }}</span>
          </td>
        </tr>
        <tr>
          <th>Current balance:</th>
          <th>
            {{ toLocaleNumber(kpis["Current balance"].value, 0) }}
            <span style="font-size: 8pt"
              >&nbsp;{{ kpis["Current balance"].unit }}</span
            >
          </th>
        </tr>
      </table>
    </fieldset>
  </details>
</template>

<script>
import { usePortfolio } from "../composables/use-portfolio";
import { reactive } from "vue";
import { store, assets } from "../composables/use-store";
import { toLocaleNumber } from "../utils";

export default {
  setup() {
    const kpis = reactive({
      "Curently Invested": {
        icon: "🧾",
        subtitle: "Purchase value of your assets.",
        info: "https://www.investopedia.com/terms/i/investment.asp",
        value: usePortfolio.invested(assets.value),
        unit: store.settings.currency,
      },
      "Day's change": {
        subtitle: "How much you are up or down today.",
        info: null,
        value: usePortfolio.lastChange(assets.value),
        unit: store.settings.currency,
      },
      "Total change": {
        icon: "📈",
        subtitle: "Your assets' change in value.",
        info: "https://www.investopedia.com/terms/c/change.asp",
        value: usePortfolio.change(assets.value),
        unit: store.settings.currency,
      },
      "Currency exchange effects": {
        icon: "😢",
        subtitle: "Effect of currency exchange rate changes.",
        info: null,
        value: usePortfolio.FXChange(assets.value),
        unit: store.settings.currency,
      },
      "Profit/Loss from selling": {
        icon: "💰",
        subtitle: "Gain/Loss from sold assets & dividends.",
        info: "https://www.investopedia.com/terms/r/return.asp",
        value: usePortfolio.returns(assets.value),
        unit: store.settings.currency,
      },
      "Dividend payouts": {
        icon: "🗓️",
        subtitle: "Income from receiving dividends.",
        info: "https://www.investopedia.com/terms/d/dividend.asp",
        value: usePortfolio.income(assets.value),
        unit: store.settings.currency,
      },
      "Current balance": {
        icon: "🏦",
        subtitle: "Your assets' current value.",
        info: "https://www.investopedia.com/terms/m/marketvalue.asp",
        value: usePortfolio.value(assets.value),
        unit: store.settings.currency,
      },
      /*
    {
    name: "Forex effects",
    subtitle: "How much you are up or down today.",
    info: null,
    method: "Object.values(timeseries",
    key: "lastChange",
    value: null,
    unit: "appCurrency"
  },*/

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
        subtitle: "Drop in value from highest point.",
        info: null,
        value: usePortfolio.missedGain(assets.value),
        unit: store.settings.currency,
      },
      "Delta to target": {
        icon: "😢",
        subtitle: "Predicted change based on avg. price target.",
        info: null,
        value: usePortfolio.diffToTargetPrice(assets.value),
        unit: store.settings.currency,
      },
    });

    return { kpis, toLocaleNumber };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
