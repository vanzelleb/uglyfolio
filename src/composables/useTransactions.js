import { saveAsset } from "../modules/asset";
import { today } from "../modules/utils";
import useFxApi from "./useFxApi";

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
    if (this._date) return this._date;
    else return null;
  }

  set date(date) {
    if (date) {
      let dt = new Date(date);
      this._date = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
        .toISOString()
        .substring(0, 10);
    } else this._date = null;
  }
}

export function useTransactions(asset) {
  const { getFx } = useFxApi();

  function saveTrx(trx, trxIdx) {
    if (trxIdx >= 0) asset.trxns[trxIdx] = new Trx(trx);
    else asset.trxns.push(new Trx(trx));
    saveAsset(asset);
    getFx(asset, trx.date);
    getFx(asset, today);
  }

  function removeTrx(trxIdx) {
    asset.trxns.splice(trxIdx, 1);
    saveAsset(asset);
  }

  return {
    saveTrx,
    removeTrx
  };
}
