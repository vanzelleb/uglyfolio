<template>
  <fieldset>
    <legend>Stats</legend>
    <div>Return over period: {{ periodReturn.toFixed(2) }}%</div>
    <div>Avg. daily return: {{ avgDailyReturns.toFixed(2) }}%</div>
    <div>
      Extrapolated yearly return: {{ extrapolYearlyReturns.toFixed(2) }}%
    </div>
    <div>
      Daily std. deviation of returns: {{ dailyStdReturns.toFixed(2) }}%
    </div>
    <div>
      Annual. std. deviation of returns:
      {{ yearlyStdReturns.toFixed(2) }}%
    </div>
  </fieldset>
</template>

<script>
import { asset } from "../composables/use-asset";
import { mean, std, sqrt } from "mathjs";

export default {
  setup() {
    const prices = asset.prices();
    const firstPrice = prices[0];
    const periodReturn = (asset.lastPrice / firstPrice - 1) * 100;
    let prevPrice = null;
    const dailyReturns = [];
    for (let i = 0; i < prices.length; i++) {
      prevPrice = i === 0 ? prices[i] : prices[i - 1];
      dailyReturns.push((prices[i] / prevPrice - 1) * 100);
    }
    const avgDailyReturns = mean(dailyReturns);
    const extrapolYearlyReturns = avgDailyReturns * 252;
    const dailyStdReturns = std(dailyReturns);
    const yearlyStdReturns = dailyStdReturns * sqrt(252);

    return {
      periodReturn,
      avgDailyReturns,
      extrapolYearlyReturns,
      dailyStdReturns,
      yearlyStdReturns,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
</style>
