import { computed, toRef } from "vue";
import { Trx } from "../composables/useTransactions";
import { store } from "../modules/store";

if (!store.assetList) store.assetList = [];

const assetList = toRef(store, "assetList");

export const saveAsset = (asset) => {
  // only save assets that have an ID
  if (asset._id) {
    console.log("Save asset...");
    // To ensure store's Vue watcher notices the change we delete the asset and add it again
    removeAsset(asset);
    // save a new copy of the asset to avoid side effects
    assetList.value.push(new Asset(asset));
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
