import { reactive } from "vue";
import { Trx } from "./useTransactions";

class Asset {
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

function highPrice(asset) {
  let max = Math.max(...asset.prices);
  return max ? max : 0;
}

function hasAlarm(asset) {
  return asset.stopLoss > asset.dataload.lastPrice;
}

function lastChangePct(asset) {
  if (asset.dataload.lastPrice && asset.prices.length > 0)
    return asset.dataload.lastPrice / asset.prices[asset.prices.length - 1] - 1;
  return null;
}

function income(asset) {
  let sum = 0;
  for (let date in asset._payouts)
    sum += parseFloat(asset._payouts[date].value);
  return sum;
}

function holdingPeriod(asset) {
  let diff = null;
  if (!isSold(asset)) diff = new Date() - firstTrxDate(asset);
  else diff = lastTrxDate(asset) - firstTrxDate(asset);
  return parseInt(diff / (1000 * 60 * 60 * 24), 10);
}

function roi(asset) {
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

function totalSharesBought(asset) {
  const count = buys(asset).reduce((acc, cur) => {
    return acc + cur.amount;
  }, 0);
  return count;
}

function totalSharesSold(asset) {
  const count = sells(asset).reduce((acc, cur) => {
    return acc + cur.amount;
  }, 0);
  return count;
}

function isSold(asset) {
  if (totalSharesSold(asset) === totalSharesBought(asset)) return true;
  else return false;
}

function firstTrxDate(asset) {
  const dates = asset.trxns.map((trx) => trx.date);
  return dates.length > 0 ? new Date(dates.sort()[0]) : null;
}

function lastTrxDate(asset) {
  const dates = asset.trxns.map((trx) => trx.date);
  return dates.length > 0 ? new Date(dates.sort()[dates.length - 1]) : null;
}

function buys(asset) {
  return asset.trxns.filter((trx) => trx.type === "buy");
}

function sells(asset) {
  return asset.trxns.filter((trx) => trx.type === "sell");
}

function buyDates(asset) {
  return buys(asset).map((trx) => trx.date);
}

function sellDates(asset) {
  return sells(asset).map((trx) => trx.date);
}

function avgBuyPrice(asset) {
  let sum = 0;
  for (const trx of buys(asset)) {
    sum += trx.price * trx.amount;
  }
  const price = sum / totalSharesBought(asset);
  return price;
}

function totalBuyValue(asset) {
  const value = buys(asset).reduce((acc, cur) => {
    return acc + cur.value;
  }, 0);
  return value;
}

function totalSellValue(asset) {
  const value = sells(asset).reduce((acc, cur) => {
    return acc + cur.value;
  }, 0);
  return value;
}

function change(asset) {
  if (isSold(asset)) return 0;
  if (asset.dataload.lastPrice)
    return (
      (asset.dataload.lastPrice / avgBuyPrice(asset)) * totalBuyValue(asset) -
      totalBuyValue(asset)
    );
  return 0;
}

function nominalReturn(asset) {
  if (isSold(asset)) return totalSellValue(asset) - totalBuyValue(asset);
  else return 0;
}

const asset = reactive(new Asset());

const selectAsset = (item) => {
  // makes a copy of the asset
  Object.assign(asset, new Asset(item));
};

export {
  Asset,
  asset,
  selectAsset,
  change,
  totalBuyValue,
  totalSellValue,
  totalSharesBought,
  totalSharesSold,
  buyDates,
  sellDates,
  buys,
  sells,
  firstTrxDate,
  lastTrxDate,
  isSold,
  roi,
  avgBuyPrice,
  holdingPeriod,
  nominalReturn,
  income,
  highPrice,
  lastChangePct,
  hasAlarm
};
