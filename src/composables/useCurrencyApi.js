import useBackend from "../composables/useBackend";
import { exchangeratesAPI } from "../modules/exchangerates";
import { appCurrency, currencies } from "../modules/currencies";

const apiOptions = {
  1: {
    prepareRequest: function ({ appCurrency }) {
      return exchangeratesAPI.currencyRequest({ appCurrency });
    },
    handleResponse: function (json, { currencies }) {
      exchangeratesAPI.currencyResponse(json, { currencies });
    }
  }
};

export default function () {
  const { callServer } = useBackend(apiOptions);

  const getCurrencies = async () => {
    await callServer(
      { appCurrency: appCurrency.value },
      { currencies: currencies }
    );
  };

  return {
    getCurrencies
  };
}
