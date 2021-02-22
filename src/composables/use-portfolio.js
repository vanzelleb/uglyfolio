import { today } from "../utils";
import { store } from "../composables/use-store";

const sum = (array) => {
  const method = (acc, cur) => acc + cur;
  return array.reduce(method, 0);
};

const last = (array) => {
  return array[array.length - 1];
};

const monthlyMean = (array) => {
  const method = (acc, cur) => acc + cur;
  let sum = array.reduce(method, 0);
  // 30 days per month on average
  let avg = array.length >= 30 ? sum / (array.length / 30) : sum;
  return isNaN(avg) ? 0 : avg;
};

const lastDiff = (array) => {
  return array[array.length - 1] - array[array.length - 2];
};

function relativeChange(items, benchmark) {
  return items.map((asset) => {
    // calculate annulaized relative return/alpha in comparison to the benchmark
    const hasData =
      asset.dates.length > 0 && benchmark.hasOwnProperty("_timeseries");
    if (!asset.isSold() && hasData) {
      let startPrice = benchmark._timeseries[asset.dateBuy];
      // by default assume the asset is active, therefore use the last available benchmark price
      let benchmarkPrices = Object.values(benchmark._timeseries);
      let endPrice = benchmarkPrices[benchmarkPrices.length - 1];
      if (asset.dateSell) endPrice = benchmark._timeseries[asset.dateSell];

      if (startPrice && endPrice)
        return asset.changePct - ((endPrice - startPrice) / startPrice) * 100;
    }
    return null;
  });
}

function change(items) {
  const result = items.map((asset) => {
    if (asset.isSold()) return 0;
    if (asset.lastPrice)
      return (
        (asset.lastPrice / asset.buyPrice) * asset.buyValue - asset.buyValue
      );
    return null;
  });
  return sum(result);
}

function FXChange(items) {
  // calculate exchange rate effects
  const result = items.map((item) => {
    if (!store.exchangeRates.hasOwnProperty(store.settings.currency))
      return null;

    const hasCurrencyPair = store.exchangeRates[
      store.settings.currency
    ].hasOwnProperty(item.currency);

    if (hasCurrencyPair) {
      let lastRate =
        store.exchangeRates[store.settings.currency][item.currency][today];
      let buyRate =
        store.exchangeRates[store.settings.currency][item.currency][
          item.dateBuy
        ];
      let changeRatio = buyRate / lastRate;
      return (
        (item.lastPrice / item.buyPrice) * item.buyValue * changeRatio -
        (item.lastPrice / item.buyPrice) * item.buyValue
      );
    }
    return null;
  });
  return sum(result);
}

function invested(items) {
  const result = items.map((asset) => {
    if (!asset.isSold()) return asset.buyValue;
    return null;
  });
  return sum(result);
}

function returns(items) {
  const result = items.map((asset) => {
    let sanitizedIncome = asset.income ? asset.income : 0;
    if (asset.isSold())
      asset._return = asset.sellValue - asset.buyValue + sanitizedIncome;
    else asset._return = sanitizedIncome;
    return asset._return;
  });
  return sum(result);
}

function diffToTargetPrice(items) {
  const result = items.map((asset) => {
    if (!asset.isSold() && asset.targetPrice && asset.lastPrice)
      return (
        (asset.targetPrice / asset.lastPrice) * value([asset]) - value([asset])
      );
    return null;
  });
  return sum(result);
}

function lastChange(items) {
  const result = items.map((asset) => {
    if (asset.dates.length > 1) return asset.lastChangePct * asset.buyValue;
    return null;
  });
  return sum(result);
}

/*function changePct(items) {
  const result = items.map((asset) => {
    if (!asset.isSold()) return (asset.change / asset.buyValue) * 100;
    return null;
  });
}*/

function value(items) {
  return (
    invested(items) +
    change(items) +
    returns(items) +
    income(items) +
    FXChange(items)
  );
}

function missedGain(items) {
  const result = items.map((asset) => {
    if (asset.lastPrice && asset.highPrice)
      if (asset.highPrice > asset.lastPrice)
        return (
          (asset.highPrice / asset.lastPrice) * value([asset]) - value([asset])
        );
    return null;
  });
  return sum(result);
}

function income(items) {
  const result = items.map((asset) => {
    let sum = 0;
    for (let date in asset._payouts)
      sum += parseFloat(asset._payouts[date].value);
    return sum;
  });
  return sum(result);
}

/*
soldAssets(state, getters) {
  return state.assets.filter((asset) => asset._dateSell);
},
holdAssets(state, getters) {
  return state.assets.filter((asset) => !asset._dateSell);
},
firstPortfolioDate(state, getters) {
  let dates = state.assets.map((item) => new Date(item._dateBuy));
  return new Date(Math.min(...dates));
},
lastPortfolioDate(state, getters) {
  if (getters.holdAssets.length > 0) return new Date();
  let dates = state.assets.map((item) => new Date(item._dateSell));
  return new Date(Math.max(...dates));
}
    assetIDs(state) {
      return state.assets.map((item) => item._id);
    },
*/

export const usePortfolio = {
  change,
  value,
  income,
  diffToTargetPrice,
  missedGain,
  invested,
  returns,
  FXChange,
  relativeChange,
  lastChange
};
