import { computed, toRef } from "vue";
import { Trx } from "../composables/useTransactions";
import { store } from "../modules/store";

if (!store.assetList) store.assetList = [];

const assetList = toRef(store, "assetList");

export const saveAsset = (asset) => {
  // only save assets that have an ID
  if (asset._id) {
    // To ensure Vue watcher notices the change:
    // if the asset is already in the list delete it and add it again
    removeAsset(asset);
    assetList.value.push(asset);
  }
};

export const removeAsset = (asset) => {
  const idx = assetList.value.findIndex(
    (item) => item._ticker === asset._ticker
  );
  if (idx !== -1) assetList.value.splice(idx, 1);
};

// convert items into Asset class before using them
export const assets = computed(() =>
  // convert items into Asset class before using them
  assetList.value.map((item) => new Asset(item))
);

export class Asset {
  constructor(obj) {
    obj = obj ? obj : {};
    this.id = obj._id;
    this.ticker = obj._ticker;
    this.prices = obj._prices;
    this.dates = obj._dates;
    this.payouts = obj._payouts;
    this.trxns = obj._trxns;
    // miscellaneous information that does not need transformation
    this.dataload = obj._dataload;
    // by default all stocks from the APIs are in USD
    if (!this.dataload.currency) this.dataload["currency"] = "USD";
  }

  get id() {
    return this._id;
  }

  set id(val) {
    this._id = val ? val : null;
  }

  get trxns() {
    return this._trxns;
  }

  set trxns(val) {
    this._trxns = val ? val.map((trx) => new Trx(trx)) : [];
  }

  get dataload() {
    return this._dataload;
  }

  set dataload(val) {
    this._dataload = val ? val : {};
  }

  get prices() {
    return this._prices;
  }

  set prices(val) {
    this._prices = val ? val : [];
  }

  get dates() {
    return this._dates;
  }

  set dates(val) {
    this._dates = val ? val : [];
  }

  get ticker() {
    return this._ticker;
  }

  set ticker(val) {
    if (val) this._ticker = val.toString().toUpperCase();
    else this._ticker = "";
  }

  get payouts() {
    if (!this._payouts) return {};
    return Object.entries(this._payouts);
  }

  set payouts(val) {
    this._payouts = val ? val : {};
  }
}

export function highPrice(asset) {
  let max = Math.max(...asset.prices);
  return max ? max : 0;
}

export function hasAlarm(asset) {
  return asset.stopLoss > asset.dataload.lastPrice;
}

export function lastChangePct(asset) {
  if (asset.dataload.lastPrice && asset.prices.length > 0)
    return asset.dataload.lastPrice / asset.prices[asset.prices.length - 1] - 1;
  return null;
}

export function income(asset) {
  let sum = 0;
  for (let date in asset._payouts)
    sum += parseFloat(asset._payouts[date].value);
  return sum;
}

export function holdingPeriod(asset) {
  let diff = null;
  if (!isSold(asset)) diff = new Date() - firstTrxDate(asset);
  else diff = lastTrxDate(asset) - firstTrxDate(asset);
  return parseInt(diff / (1000 * 60 * 60 * 24), 10);
}

export function roi(asset) {
  // calculate the annualized return on investment
  if (asset.holdingPeriod(asset) > 365) {
    return (
      (Math.pow(
        1 + nominalReturn(asset) / totalBuyValue(asset),
        1 / (holdingPeriod(asset) / 365)
      ) -
        1) *
      100
    );
  }
  // any investment that does not have a track record of at least 365 days cannot "ratchet up" its performance to be annualized
  // https://www.investopedia.com/terms/a/annualized--return.asp
  else return (nominalReturn(asset) / totalBuyValue(asset)) * 100;
}

export function totalSharesBought(asset) {
  const count = buys(asset).reduce((acc, cur) => {
    return acc + cur.amount;
  }, 0);
  return count;
}

export function totalSharesSold(asset) {
  const count = sells(asset).reduce((acc, cur) => {
    return acc + cur.amount;
  }, 0);
  return count;
}

export function isSold(asset) {
  if (totalSharesSold(asset) === totalSharesBought(asset)) return true;
  else return false;
}

export function firstTrxDate(asset) {
  const dates = asset.trxns.map((trx) => trx.date);
  return dates.length > 0 ? new Date(dates.sort()[0]) : null;
}

export function lastTrxDate(asset) {
  const dates = asset.trxns.map((trx) => trx.date);
  return dates.length > 0 ? new Date(dates.sort()[dates.length - 1]) : null;
}

export function buys(asset) {
  return asset.trxns.filter((trx) => trx.type === "Buy");
}

export function sells(asset) {
  return asset.trxns.filter((trx) => trx.type === "Sell");
}

export function buyDates(asset) {
  return buys(asset).map((trx) => trx.date);
}

export function sellDates(asset) {
  return sells(asset).map((trx) => trx.date);
}

export function avgBuyPrice(asset) {
  let sum = 0;
  for (const trx of buys(asset)) {
    sum += trx.price * trx.amount;
  }
  return sum === 0 ? null : sum / totalSharesBought(asset);
}

export function totalBuyValue(asset) {
  const value = buys(asset).reduce((acc, cur) => {
    return acc + cur.value;
  }, 0);
  return value;
}

export function totalSellValue(asset) {
  const value = sells(asset).reduce((acc, cur) => {
    return acc + cur.value;
  }, 0);
  return value;
}

export function change(asset) {
  if (isSold(asset)) return 0;
  if (asset.dataload.lastPrice)
    return (
      (asset.dataload.lastPrice / avgBuyPrice(asset)) * totalBuyValue(asset) -
      totalBuyValue(asset)
    );
  return 0;
}

export function nominalReturn(asset) {
  if (isSold(asset)) return totalSellValue(asset) - totalBuyValue(asset);
  else return 0;
}
