import { store, persistState } from "./use-store";
import { reactive } from "vue";
import { Trx } from "./use-transactions";
import { mean, standardDeviation } from "simple-statistics";

class Asset {
  constructor(obj) {
    obj = obj ? obj : {};
    this.id = obj._id;
    // by default all stocks from the APIs are in USD
    this.currency = "USD";
    this.name = obj._name;
    this.ticker = obj._ticker;
    this.timeseries = obj._timeseries;
    this.payouts = obj._payouts;
    this.lastChecked = obj._lastChecked;
    // current price quote from API
    this.lastPrice = obj._lastPrice;
    this.trxns = obj._trxns;
    // miscellaneous information that does not need transformation
    this.dataload = obj._dataload;
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

  get currency() {
    return this._currency;
  }

  set currency(val) {
    this._currency = val ? val : null;
  }

  get lastChecked() {
    if (this._lastChecked)
      return this._lastChecked.toISOString().substring(0, 10);
    else return null;
  }

  set lastChecked(date) {
    if (date) {
      let dt = new Date(date);
      this._lastChecked = new Date(
        dt.getTime() - dt.getTimezoneOffset() * 60000
      );
    } else this._lastChecked = null;
  }

  get lastPrice() {
    return this._lastPrice;
  }

  set lastPrice(val) {
    this._lastPrice = val ? parseFloat(val) : "";
  }

  get ticker() {
    return this._ticker;
  }

  set ticker(val) {
    if (val) this._ticker = val.toString().toUpperCase();
    else this._ticker = "";
  }

  get timeseries() {
    // update the timeseries with the current price
    if (this.lastChecked && this.lastPrice)
      this._timeseries[this.lastChecked] = this.lastPrice;
    return this._timeseries;
  }

  set timeseries(val) {
    this._timeseries = val ? val : {};
    /*this._timeseries = {};
    if (val) {
      let dates = Object.keys(val);
      dates.sort();
      for (let date of dates) this._timeseries[date] = parseFloat(val[date]);
    }*/
  }

  get payouts() {
    if (!this._payouts) return {};
    return Object.entries(this._payouts);
  }

  set payouts(val) {
    this._payouts = {};
    // for backwards compatibility
    if (Array.isArray(val))
      for (let payout of val)
        this._payouts[payout.year] = { value: payout.value };
    else if (val) this._payouts = val;
  }

  lastChangePct() {
    if (!this.isSold() && this.dates().length > 1)
      return (
        this.lastPrice /
          this.timeseries[this.dates()[this.dates().length - 2]] -
        1
      );
    return null;
  }

  highPrice() {
    let max = Math.max(...this.prices());
    return max ? max : 0;
  }

  holdingPeriod() {
    let diff = null;
    if (!this.isSold()) diff = new Date() - this.firstTrxDate();
    else diff = this.lastTrxDate() - this.firstTrxDate();
    return parseInt(diff / (1000 * 60 * 60 * 24), 10);
  }

  roi() {
    // calculate the annualized return on investment
    if (this.holdingPeriod() > 365) {
      return (
        (Math.pow(
          1 + this.return() / this.totalBuyValue(),
          1 / (this.holdingPeriod() / 365)
        ) -
          1) *
        100
      );
    }
    // any investment that does not have a track record of at least 365 days cannot "ratchet up" its performance to be annualized
    // https://www.investopedia.com/terms/a/annualized--return.asp
    else return (this.return() / this.totalBuyValue()) * 100;
  }

  totalSharesBought() {
    const count = this.buys().reduce((acc, cur) => {
      return acc + cur.amount;
    }, 0);
    return count;
  }

  totalSharesSold() {
    const count = this.sells().reduce((acc, cur) => {
      return acc + cur.amount;
    }, 0);
    return count;
  }

  isSold() {
    if (this.totalSharesSold() === this.totalSharesBought()) return true;
    else return false;
  }

  hasAlarm() {
    return this.stopLoss > this.lastPrice;
  }

  firstTrxDate() {
    const dates = this.trxns.map((trx) => trx.date);
    return new Date(dates.sort()[0]);
  }

  lastTrxDate() {
    const dates = this.trxns.map((trx) => trx.date);
    return new Date(dates.sort()[dates.length - 1]);
  }

  buys() {
    return this.trxns.filter((trx) => trx.type === "buy");
  }

  sells() {
    return this.trxns.filter((trx) => trx.type === "sell");
  }

  prices() {
    return Object.values(this.timeseries);
  }

  dates() {
    return Object.keys(this.timeseries);
  }

  buyDates() {
    return this.buys().map((trx) => trx.date);
  }

  sellDates() {
    return this.sells().map((trx) => trx.date);
  }

  avgBuyPrice() {
    let sum = 0;
    for (const trx of this.buys()) {
      sum += trx.price * trx.amount;
    }
    const price = sum / this.totalSharesBought();
    return price;
  }

  totalBuyValue() {
    const value = this.buys().reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);
    return value;
  }

  totalSellValue() {
    const value = this.sells().reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);
    return value;
  }

  change() {
    if (this.isSold()) return 0;
    if (this.lastPrice)
      return (
        (this.lastPrice / this.avgBuyPrice()) * this.totalBuyValue() -
        this.totalBuyValue()
      );
    return 0;
  }

  return() {
    if (this.isSold()) return this.totalSellValue() - this.totalBuyValue();
    else return 0;
  }

  dailyChangePctList() {
    const prices = this.prices();
    // first change percentage is always zero
    const dailyChangePct = [0];
    for (let i = 1; i < prices.length; i++) {
      dailyChangePct.push(prices[i] / prices[i - 1] - 1);
    }
    return dailyChangePct;
  }

  predictYearlyChangePct() {
    const avgDailyChange = mean(this.dailyChangePctList());
    const predictedYearlyChangePct = avgDailyChange * 252;
    return predictedYearlyChangePct;
  }

  predictYearlyVolatility() {
    const volatility = standardDeviation(this.dailyChangePctList());
    const predictedYearlyVolatility = volatility * Math.sqrt(252);
    return predictedYearlyVolatility;
  }
}

const asset = reactive(new Asset());

const saveAsset = (asset) => {
  if (asset._id) {
    // make sure every ticker is only saved once
    const IDs = store.assetList.map((item) => item._id);
    const idx = IDs.indexOf(asset._id);
    if (idx === -1) store.assetList.push(new Asset(asset));
    else store.assetList[idx] = new Asset(asset);
    persistState();
  }
};

const removeAsset = (asset) => {
  store.assetList = store.assetList.filter(
    (item) => item._ticker !== asset._ticker
  );
  persistState();
};

const selectAsset = (item) => {
  Object.assign(asset, new Asset(item));
};

export { Asset, asset, saveAsset, removeAsset, selectAsset };
