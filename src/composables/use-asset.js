import { reactive } from "vue";
import { Trx } from "./use-transactions";

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
    this._payouts = {};
    // for backwards compatibility
    if (Array.isArray(val))
      for (let payout of val)
        this._payouts[payout.year] = { value: payout.value };
    else if (val) this._payouts = val;
  }

  highPrice() {
    let max = Math.max(...this.prices);
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
    return this.stopLoss > this.dataload.lastPrice;
  }

  firstTrxDate() {
    const dates = this.trxns.map((trx) => trx.date);
    return dates.length > 0 ? new Date(dates.sort()[0]) : null;
  }

  lastTrxDate() {
    const dates = this.trxns.map((trx) => trx.date);
    return dates.length > 0 ? new Date(dates.sort()[dates.length - 1]) : null;
  }

  buys() {
    return this.trxns.filter((trx) => trx.type === "buy");
  }

  sells() {
    return this.trxns.filter((trx) => trx.type === "sell");
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
    if (this.dataload.lastPrice)
      return (
        (this.dataload.lastPrice / this.avgBuyPrice()) * this.totalBuyValue() -
        this.totalBuyValue()
      );
    return 0;
  }

  return() {
    if (this.isSold()) return this.totalSellValue() - this.totalBuyValue();
    else return 0;
  }

  lastChangePct() {
    if (!this.isSold() && this.dates.length > 1)
      return this.dataload.lastPrice / this.prices[this.prices.length - 1];
    return null;
  }
}

const asset = reactive(new Asset());

const selectAsset = (item) => {
  // makes a copy of the asset
  Object.assign(asset, new Asset(item));
};

export { Asset, asset, selectAsset };
