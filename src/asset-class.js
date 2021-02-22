import { today } from "./utils";

export default class Asset {
  constructor(item) {
    item = item ? item : {};
    this.id = item._id;
    this.currency = item._currency;
    this.name = item._name;
    this.ticker = item._ticker;
    this.amount = item._amount;
    this.buyValue = item._buyValue;
    this.sellValue = item._sellValue;
    this.dateBuy = item._dateBuy;
    this.dateSell = item._dateSell;
    this.timeseries = item._timeseries;
    this.payouts = item._payouts;
    this.buyPrice = item._buyPrice;
    this.sellPrice = item._sellPrice;
    this.targetPrice = item._targetPrice;
    this.yearlyHigh = item._yearlyHigh;
    this.yearlyLow = item._yearlyLow;
    this.lastChecked = item._lastChecked;
    this.lastPrice = item._lastPrice;
    // values that don't need setters/getters
    this.peRatio = item.peRatio;
    this.address = item.address;
    this.industry = item.industry;
    this.description = item.description;
    this.error = item.error;
    this.news = [];
    this.signal = item.signal;
  }

  get id() {
    return this._id;
  }

  set id(val) {
    if (!val) this._id = null;
    else this._id = val;
  }

  get currency() {
    return this._currency;
  }

  set currency(val) {
    this._currency = val ? val : null;
  }

  get highPrice() {
    let max = Math.max(...Object.values(this.timeseries));
    return max ? max : 0;
  }

  get dateBuy() {
    if (this._dateBuy) return this._dateBuy.toISOString().substring(0, 10);
    else return null;
  }

  set dateBuy(date) {
    if (date) {
      let dt = new Date(date);
      this._dateBuy = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000);
    } else this._dateBuy = null;
  }

  set yearlyHigh(val) {
    this._yearlyHigh = val ? parseFloat(val) : null;
  }

  get yearlyHigh() {
    return this._yearlyHigh ? this._yearlyHigh : null;
  }

  set yearlyLow(val) {
    this._yearlyLow = val ? parseFloat(val) : null;
  }

  get yearlyLow() {
    return this._yearlyLow ? this._yearlyLow : null;
  }

  set targetPrice(val) {
    this._targetPrice = val ? parseFloat(val) : null;
  }

  get targetPrice() {
    return this._targetPrice ? this._targetPrice : null;
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

  get lastChangePct() {
    if (!this.isSold() && this.dates.length > 1)
      return (
        this.lastPrice / this.timeseries[this.dates[this.dates.length - 2]] - 1
      );
    return null;
  }

  get holdingPeriod() {
    if (!this._dateBuy) return null;
    return parseInt(
      ((this.isSold() ? this._dateSell : new Date()) - this._dateBuy) /
        (1000 * 60 * 60 * 24),
      10
    );
  }

  get roi() {
    // calculate the annualized return on investment
    if (this.holdingPeriod > 365) {
      return (
        (Math.pow(
          1 + this.return / this.buyValue,
          1 / (this.holdingPeriod / 365)
        ) -
          1) *
        100
      );
    }
    // any investment that does not have a track record of at least 365 days cannot "ratchet up" its performance to be annualized
    // https://www.investopedia.com/terms/a/annualized--return.asp
    else return (this.return / this.buyValue) * 100;
  }

  get dateSell() {
    if (this._dateSell) return this._dateSell.toISOString().substring(0, 10);
    else return "";
  }

  set dateSell(date) {
    if (date) {
      let dt = new Date(date);
      this._dateSell = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000);
      // trim timeseries if needed
      /*for (date in this.timeseries) {
        if (date > this.dateSell) {
          delete this.timeseries[date];
        }
      }*/
    } else this._dateSell = null;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    if (name) this._name = name.toString();
    else this._name = "";
  }

  get ticker() {
    return this._ticker;
  }

  set ticker(val) {
    if (val) this._ticker = val.toString().toUpperCase();
    else this._ticker = "";
  }

  get timeseries() {
    let ts = this._timeseries;
    // update the timeseries with the buy and sell prices
    if (this.buyPrice) ts[this.dateBuy] = this.buyPrice;
    if (this.sellPrice && this.dateSell) ts[this.dateSell] = this.sellPrice;
    if (!this.isSold() && this.lastChecked && this.lastPrice)
      ts[this.lastChecked] = this.lastPrice;
    return ts;
  }

  set timeseries(val) {
    this._timeseries = {};
    if (val) {
      let dates = Object.keys(val);
      dates.sort();
      for (let date of dates) this._timeseries[date] = parseFloat(val[date]);
    }
  }

  get prices() {
    return Object.values(this.timeseries);
  }

  get dates() {
    return Object.keys(this.timeseries);
  }

  get buyValue() {
    return this._buyValue;
  }

  set buyValue(val) {
    this._buyValue = val ? parseFloat(val) : "";
  }

  get sellValue() {
    return this._sellValue;
  }

  set sellValue(val) {
    this._sellValue = val ? parseFloat(val) : "";
  }

  get amount() {
    return this._amount;
  }

  set amount(val) {
    this._amount = val ? parseFloat(val) : "";
  }

  set buyPrice(val) {
    this._buyPrice = val ? parseFloat(val) : null;
  }

  get buyPrice() {
    return this._buyPrice;
  }

  set sellPrice(val) {
    this._sellPrice = val ? parseFloat(val) : null;
  }

  get sellPrice() {
    return this._sellPrice;
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

  getYear() {
    if (this.isSold()) return this._dateSell.getFullYear();
    else return this._dateBuy.getFullYear();
  }

  isUpdated() {
    const hasNoTicker = !this.ticker;
    const hasNoPrice = !this.lastPrice && !this.isSold();
    const hasNoChart = this.dates.length === 0 && this.isSold();
    // flag to prevent repeated API calls per day for assets with unknown tickers
    const checkedToday = this.lastChecked === today;
    if (hasNoTicker || hasNoPrice || hasNoChart || !checkedToday) return false;
    return true;
  }

  isSold() {
    if (this._dateSell) return true;
    else return false;
  }

  hasAlarm() {
    return this.stopLoss > this.lastPrice;
  }
}
