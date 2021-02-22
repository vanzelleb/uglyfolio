import { ref } from "vue";
import { resources, netlifyFuncBaseUrl } from "../api/config";
import { today } from "../utils";
import { store, assets } from "../composables/use-store";

const error = ref("");

async function getResponse(option, requestObj) {
  let resString = null;

  try {
    // generate the the address to call the API with
    let { uri, params } = option.getUri(requestObj);
    const res = await fetch(netlifyFuncBaseUrl + option.provider, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ uri, params })
    });
    resString = await res.text();
    console.log("API return string: ", resString);
    const json = JSON.parse(resString);
    option.handleResponse(json, requestObj);
  } catch (e) {
    if (e instanceof SyntaxError) throw Error(resString);
    else throw Error(e.message);
  }
}

// handles requests that have a fallback API provider, e.g. when request limit is reached or when symbol is unknown
async function requestHandler(type, requestObj) {
  let options = Object.keys(resources[type]).length;
  let i = 1;
  error.value = "";

  while (i <= options) {
    try {
      // call the netlify function/backend to trigger the API call
      await getResponse(resources[type][i], requestObj);
      // set i so that while loop will end
      i = options + 1;
    } catch (e) {
      // catch API errors and try the next option
      error.value = e.message + " " + error.value;
      console.log("API error for request type " + type + ": " + error.value);
      i++;
    }
  }
}

const updateCurrencies = () => {
  requestHandler("currencies");
};

const updateHistory = (item) => {
  requestHandler("history", { asset: item });
};

const updateAssets = () => {
  for (const item of assets.value) {
    if (!item.isUpdated()) {
      requestHandler("history", { asset: item });
      if (!item.isSold()) {
        requestHandler("quote", { asset: item });
        requestHandler("signal", { asset: item });
        requestHandler("target", { asset: item });
      }
    }
  }
};

const updateFXRates = () => {
  const FXbase = store.settings.currency;

  for (const item of assets.value) {
    // retrieve latest exchange rates for all currency combinations
    if (item.currency && item.currency !== FXbase) {
      let hasFXForBuyDate = false;
      let hasLatestFX = false;
      const hasCurrencyPair = store.exchangeRates[FXbase].hasOwnProperty(
        item.currency
      );

      if (!hasCurrencyPair) store.exchangeRates[FXbase][item.currency] = {};
      else
        hasFXForBuyDate = store.exchangeRates[FXbase][
          item.currency
        ].hasOwnProperty(item.dateBuy);
      if (!hasFXForBuyDate)
        useAPI.requestHandler("forexByDate", {
          currency: item.currency,
          date: item.dateBuy
        });
      if (!hasLatestFX)
        useAPI.requestHandler("forexByDate", {
          currency: item.currency,
          date: today
        });
    }
  }
};

export const useAPI = {
  error,
  requestHandler,
  updateFXRates,
  updateAssets,
  updateCurrencies,
  updateHistory
};
