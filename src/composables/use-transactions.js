import { asset, saveAsset } from "../composables/use-asset";

export class Trx {
  constructor(obj) {
    this.type = obj ? obj.type : null;
    this.value = obj ? obj.value : null;
    this.amount = obj ? obj.amount : null;
    this.price = obj ? obj.price : null;
    this.date = obj ? obj._date : null;
  }
  // add getter and setter for date to offset timezone differences
  get date() {
    if (this._date) return this._date.toISOString().substring(0, 10);
    else return null;
  }

  set date(date) {
    if (date) {
      let dt = new Date(date);
      this._date = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000);
    } else this._date = null;
  }
}

export function saveTrx(trx, id) {
  if (!Number.isInteger(id)) {
    asset.trxns.push(trx);
  } else asset.trxns[id] = trx;
  saveAsset(asset);
}

export function removeTrx(id) {
  asset.trxns.splice(id, 1);
  saveAsset(asset);
}
