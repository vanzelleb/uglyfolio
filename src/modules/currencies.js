import { assets } from "../modules/asset";
import { toRef } from "vue";
import { requestHandler } from "../composables/use-api";
import { today } from "../utils";
import { store } from "../modules/store";

if (!store.appCurrency) store.appCurrency = "EUR";
if (!store.currencies) store.currencies = ["EUR"];
if (!store.fx)
  store.fx = {
    EUR: {}
  };

export const appCurrency = toRef(store, "appCurrency");
export const currencies = toRef(store, "currencies");
export const fx = toRef(store, "fx");

// add more currencies to the default one
if (currencies.value.length === 1) {
  requestHandler("currencies", {
    currencies: currencies
  });
}

export const updateFx = () => {
  assets.value.forEach((asset) => {
    asset.trxns.forEach((trx) => {
      getFxRate(asset.dataload.currency, today);
      getFxRate(asset.dataload.currency, trx.date);
    });
  });
};

export const getFxRate = (currency, date) => {
  //let fxBase = toRef(fx, appCurrency.value);
  let fxBase = fx[appCurrency.value];
  if (!fxBase) fxBase = {};
  // retrieve latest exchange rates for all currency combinations
  if (currency !== appCurrency.value) {
    const hasFXPair = !!fxBase[currency];
    // reset the exchange rates for the currency pair
    if (!hasFXPair) fxBase[currency] = {};
    const hasDate = !!fxBase[currency][date];
    if (!hasDate)
      requestHandler("forexByDate", {
        appCurrency: appCurrency,
        currency: currency,
        date: date,
        fxBase: fxBase
      });
  }
};
