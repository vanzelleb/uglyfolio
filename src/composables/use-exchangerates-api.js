import { store, persistState } from "./use-store";

const baseURL = "https://api.exchangeratesapi.io/";
const provider = "exchangeratesapi";

function forexByDateURI({ currency, date }) {
  const url = baseURL + date;
  const params = {
    base: store.settings.currency,
    symbols: currency
  };
  return { provider, url, params };
}

function forexByDateResponse(json, { currency, date }) {
  store.exchangeRates[store.settings.currency][currency][date] =
    json.rates[currency];
  persistState();
}

function currencyURI() {
  const url = baseURL + "latest";
  const params = {
    base: store.settings.currency
  };
  return { provider, url, params };
}

function currencyResponse(json) {
  store.currencies = [...Object.keys(json.rates), store.settings.currency];
  persistState();
}

export const exchangeratesAPI = {
  forexByDateURI,
  currencyURI,
  forexByDateResponse,
  currencyResponse
};
