import { saveAsset } from "../modules/asset";
import { getFxRate } from "../modules/currencies";
import { today } from "../utils";

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

export function useTransactions(asset) {
  function saveTrx(trx, trxId) {
    if (trxId >= 0) asset.trxns[trxId] = new Trx(trx);
    else asset.trxns.push(new Trx(trx));
    getFxRate(asset.dataload.currency, trx.date);
    getFxRate(asset.dataload.currency, today);
    saveAsset(asset);
  }

  function removeTrx(trxId) {
    asset.trxns.splice(trxId, 1);
    saveAsset(asset);
  }

  return {
    saveTrx,
    removeTrx
  };
}
