import useBackend from "../composables/useBackend";
import { exchangeratesAPI } from "../modules/exchangerates";
import { appCurrency, fxRates } from "../modules/currencies";

const apiOptions = {
  1: {
    prepareRequest: function ({ appCurrency, currency, date }) {
      return exchangeratesAPI.fxByDateRequest({
        appCurrency,
        currency,
        date
      });
    },
    handleResponse: function (json, { appCurrency, currency, date, fxRates }) {
      exchangeratesAPI.fxByDateResponse(json, {
        appCurrency,
        currency,
        date,
        fxRates
      });
    }
  }
};

export default function () {
  const { callServer } = useBackend(apiOptions);

  const getFx = async (asset, date) => {
    // retrieve latest exchange rates for all currency combinations
    const hasFxBase = fxRates.value.hasOwnProperty(appCurrency.value);
    if (!hasFxBase) throw Error("useFxApi: Missing FxBase");
    if (asset.dataload.currency !== appCurrency.value) {
      const hasFxPair = fxRates.value[appCurrency.value].hasOwnProperty(
        asset.dataload.currency
      );
      // reset the exchange rates for the currency pair
      if (!hasFxPair)
        fxRates.value[appCurrency.value][asset.dataload.currency] = {};
      const hasDate = fxRates.value[appCurrency.value][
        asset.dataload.currency
      ].hasOwnProperty(date);
      if (!hasDate)
        await callServer(
          {
            appCurrency: appCurrency.value,
            currency: asset.dataload.currency,
            date
          },
          {
            appCurrency: appCurrency.value,
            currency: asset.dataload.currency,
            date,
            fxRates
          }
        );
    }
  };

  return {
    getFx
  };
}
