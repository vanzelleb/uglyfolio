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

/*function relativeChange(items, benchmark) {
  return items.map((asset) => {
    // calculate annulaized relative return/alpha in comparison to the benchmark
    const hasData =
      asset.dates.length > 0 && benchmark.hasOwnProperty("_timeseries");
    if (!asset.isSold() && hasData) {
      let startPrice = benchmark._timeseries[asset.firstTrxDate()];
      // by default assume the asset is active, therefore use the last available benchmark price
      let benchmarkPrices = Object.values(benchmark._timeseries);
      let endPrice = benchmarkPrices[benchmarkPrices.length - 1];
      if (asset.dateSell) endPrice = benchmark._timeseries[asset.dateSell];

      if (startPrice && endPrice)
        return asset.changePct - ((endPrice - startPrice) / startPrice) * 100;
    }
    return null;
  });
}*/

function change(items) {
  const results = items.map((asset) => asset.change());
  return sum(results);
}

// calculate exchange rate effects
function FXChange(items) {
  const appCurrency = store.settings.currency;
  const FXBase = store.exchangeRates[appCurrency];
  if (!FXBase) return null;

  const calculateFXChange = (item) => {
    const hasCurrencyPair = !!FXBase[item.dataload.currency];
    if (hasCurrencyPair) {
      const hasTrx = item.firstTrxDate() ? true : false;
      if (hasTrx) {
        const lastRate = FXBase[item.dataload.currency][today];
        const buyRate =
          FXBase[item.dataload.currency][
            item.firstTrxDate().toISOString().substring(0, 10)
          ];
        const changeRatio = buyRate / lastRate;
        const assetValue =
          (item.dataload.lastPrice / item.avgBuyPrice()) * item.totalBuyValue();
        const FXChange = assetValue * changeRatio - assetValue;
        return FXChange;
      }
    }
    return null;
  };

  const result = items.map((item) => {
    return calculateFXChange(item);
  });

  return sum(result);
}

function invested(items) {
  const result = items.map((asset) => {
    if (!asset.isSold()) return asset.totalBuyValue();
    return null;
  });
  return sum(result);
}

function returns(items) {
  const result = items.map((asset) => {
    return asset.return();
  });
  return sum(result) + income(items);
}

/*function diffToTargetPrice(items) {
  const result = items.map((asset) => {
    if (!asset.isSold() && asset.targetPrice && asset.dataload.lastPrice)
      return (
        (asset.targetPrice / asset.dataload.lastPrice) * value([asset]) - value([asset])
      );
    return null;
  });
  return sum(result);
}*/

function lastChange(items) {
  const result = items.map((asset) => {
    if (asset.dates.length > 1)
      return (
        asset.lastChangePct() * asset.totalBuyValue() - asset.totalBuyValue()
      );
    return null;
  });
  return sum(result);
}

/*function changePct(items) {
  const result = items.map((asset) => {
    if (!asset.isSold()) return (asset.change / asset.totalBuyValue) * 100;
    return null;
  });
}*/

function value(items) {
  return invested(items) + change(items) + returns(items) + FXChange(items);
}

function missedGain(items) {
  const result = items.map((asset) => {
    if (asset.dataload.lastPrice && asset.highPrice())
      if (asset.highPrice() > asset.dataload.lastPrice)
        return (
          (asset.highPrice() / asset.dataload.lastPrice) * value([asset]) -
          value([asset])
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

export const useKPI = {
  change,
  value,
  income,
  //diffToTargetPrice,
  missedGain,
  invested,
  returns,
  FXChange,
  //relativeChange,
  lastChange
};
