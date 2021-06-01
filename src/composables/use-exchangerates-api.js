import { store, persistState } from "./use-store";


const provider = "exchangeratesapi";

function forexByDateURI({ currency, date }) {
  const params = {
    path: date,
    base: store.settings.currency,
    symbols: currency
  };
  return { provider, params };
}

function forexByDateResponse(json, { currency, date }) {
  store.exchangeRates[store.settings.currency][currency][date] =
    json.rates[currency];
  persistState();
}

function currencyURI() {
  const params = {
    path: "latest",
    base: store.settings.currency
  };
  return { provider, params };
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
