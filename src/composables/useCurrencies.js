import { assets } from "../composables/useStore";
import { ref, reactive, watch, onMounted, toRef } from "vue";
import { requestHandler } from "../composables/use-api";
import { today } from "../utils";

export const appCurrency = ref("EUR");
export const currencies = ref(["EUR"]);
export const fx = reactive({
  EUR: {}
});

export default function useCurrencies() {
  onMounted(() => {
    // setup the currency related variables in the store if not already done
    if (!localStorage.fx) localStorage.fx = JSON.stringify(fx);
    else Object.assign(fx, JSON.parse(localStorage.fx));

    if (!localStorage.currencies)
      localStorage.currencies = JSON.stringify(currencies.value);
    else currencies.value = JSON.parse(localStorage.currencies);

    if (!localStorage.appCurrency)
      localStorage.appCurrency = JSON.stringify(appCurrency.value);
    else appCurrency.value = JSON.parse(localStorage.appCurrency);

    // add more currencies to the default one
    if (currencies.value.length === 1) {
      requestHandler("currencies", {
        currencies: currencies
      });
    }
    updateFx();
  });

  // gets executed when app's currency changes
  watch(
    () => appCurrency.value,
    () => {
      localStorage.appCurrency = JSON.stringify(appCurrency.value);
      updateFx();
    }
  );

  watch(
    () => currencies.value,
    () => {
      localStorage.currencies = JSON.stringify(currencies.value);
    }
  );

  watch(fx, () => {
    localStorage.fx = JSON.stringify(fx);
  });
}

const updateFx = () => {
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
  console.log("in useCurrencies 0: ", fxBase);
  if (!fxBase) fxBase = {};
  console.log("in useCurrencies 1: ", fxBase);
  // retrieve latest exchange rates for all currency combinations
  if (currency !== appCurrency.value) {
    const hasFXPair = !!fxBase[currency];
    // reset the exchange rates for the currency pair
    if (!hasFXPair) fxBase[currency] = {};
    console.log("in useCurrencies 2: ", fxBase);
    const hasDate = !!fxBase[currency][date];
    console.log("in useCurrencies 3: ", fxBase);
    if (!hasDate)
      requestHandler("forexByDate", {
        appCurrency: appCurrency,
        currency: currency,
        date: date,
        fxBase: fxBase
      });
  }
};

export const getCurrencies = async () => {
  requestHandler("currencies", {
    currencies: currencies
  });
};
