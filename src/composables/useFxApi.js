import useBackend from "../composables/useBackend";
import { exchangeratesAPI } from "../modules/exchangerates";
import { appCurrency, fx } from "../modules/currencies";

const apiOptions = {
  1: {
    prepareRequest: function ({ appCurrency, currency, date }) {
      return exchangeratesAPI.fxByDateRequest({
        appCurrency,
        currency,
        date
      });
    },
    handleResponse: function (
      json,
      { appCurrency, currency, date, fxInventory }
    ) {
      exchangeratesAPI.fxByDateResponse(json, {
        appCurrency,
        currency,
        date,
        fxInventory
      });
    }
  }
};

export default function () {
  const { callServer } = useBackend(apiOptions);

  const getFx = async (asset, date) => {
    let fxBase = fx[appCurrency.value];
    if (!fxBase) fxBase = {};
    // retrieve latest exchange rates for all currency combinations
    if (asset.currency !== appCurrency.value) {
      const hasFXPair = !!fxBase[asset.currency];
      // reset the exchange rates for the currency pair
      if (!hasFXPair) fxBase[asset.currency] = {};
      const hasDate = !!fxBase[asset.currency][date];
      if (!hasDate)
        await callServer(
          { appCurrency: appCurrency, currency: asset.currency, date: date },
          { asset: asset, fxRates: fx }
        );
    }
  };

  return {
    getFx
  };
}
