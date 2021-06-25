""<template>
  <details>
    <summary>🏆 <span class="link">Portfolio Performance</span></summary>
    <fieldset>
      <table>
        <tr v-for="(kpi, id) of stats" :key="id">
          <td>{{ kpi.icon }}</td>
          <td>{{ kpi.title }}:</td>
          <td class="number">
            <h5>{{ toLocaleNumber(kpi.value, 0) }}</h5>
            <h6>&nbsp;{{ kpi.unit }}</h6>
          </td>
        </tr>
      </table>
    </fieldset>
  </details>
</template>

<script>
import { reactive, computed, watch } from "vue";
import { store } from "../modules/store";
import { appCurrency } from "../modules/currencies";
import {
  change,
  totalBuyValue,
  nominalReturn,
  isSold,
  income,
  lastChangePct,
  highPrice,
} from "../modules/stats";
import { toLocaleNumber } from "../modules/utils";

export default {
  props: ["assets"],
  setup(props) {
    const kpis = reactive([
      {
        title: "Currently invested",
        icon: "🛒",
        subtitle: "Purchase value of your assets.",
        info: "https://www.investopedia.com/terms/i/investment.asp",
        method: (asset) => (isSold(asset) ? 0 : totalBuyValue(asset)),
        unit: appCurrency.value,
      },
      {
        title: "Day's change",
        icon: "📯",
        subtitle: "How much you are up/down.",
        info: null,
        method: (asset) =>
          asset.dates.length > 0
            ? lastChangePct(asset) * totalBuyValue(asset)
            : 0,
        unit: appCurrency.value,
      },
      {
        title: "Total change",
        icon: "📈",
        subtitle: "How much you are up/down.",
        info: null,
        method: (asset) => (isSold(asset) ? 0 : change(asset)),
        unit: appCurrency.value,
      },
      {
        title: "Current balance",
        icon: "🗓️",
        subtitle: "Your assets' current value.",
        info: "https://www.investopedia.com/terms/m/marketvalue.asp",
        method: (asset) =>
          isSold(asset) ? 0 : totalBuyValue(asset) + change(asset),
        unit: appCurrency.value,
      },
      {
        title: "Profit/Loss from selling",
        icon: "💰",
        subtitle: "Gain/Loss from sold assets & dividends.",
        info: "https://www.investopedia.com/terms/r/return.asp",
        method: (asset) => (isSold(asset) ? nominalReturn(asset) : 0),
        unit: appCurrency.value,
      },
      {
        title: "Dividend payments",
        icon: "🤑",
        subtitle: "Income from receiving dividends.",
        info: "https://www.investopedia.com/terms/d/dividend.asp",
        method: (asset) => income(asset),
        unit: appCurrency.value,
      },
      {
        title: "Missed Profit",
        icon: "😢",
        subtitle: "Drop in value from highest price.",
        info: null,
        method: (asset) => {
          const incRatio = highPrice(asset) / asset.dataload.lastPrice;
          return incRatio > 1 ? (incRatio - 1) * totalBuyValue(asset) : 0;
        },
        unit: appCurrency.value,
      },
      /*"Currency effects": {
        icon: "😢",
        subtitle: "Effect of currency exchange rate changes.",
        info: null,
        value: computed(() => toLocaleNumber(useKPI.FXChange(assets.value), 0)),
        unit: computed(() => store.settings.currency),
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
  },*/
    ]);

    const sum = (array) => {
      const method = (acc, cur) => acc + cur;
      return array.reduce(method, 0);
    };

    const stats = computed(() => {
      const calculatedKpi = kpis.map((kpi) => {
        const values = props.assets.map((asset) => kpi.method(asset));
        kpi.value = sum(values);
        return kpi;
      });
      console.log("Computed KPIs");
      return calculatedKpi;
    });

    return { stats, toLocaleNumber };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h5,
h6 {
  display: inline-block;
}

number {
  text-align: right;
}
</style>
