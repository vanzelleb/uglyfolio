import { store, persistState } from "./useStore";

const provider = "exchangeratesapi";

function forexByDateRequest({ currency, date }) {
  const params = {
    path: date instanceof Date ? date.toISOString().substring(0, 10) : date,
    base: store.settings.currency,
    symbols: currency
  };
  return { provider, params };
}

function forexByDateResponse(json, { currency }) {
  store.exchangeRates[store.settings.currency][currency][json.date] =
    json.rates[currency];
  persistState();
}

function currencyRequest() {
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
  forexByDateRequest,
  currencyRequest,
  forexByDateResponse,
  currencyResponse
};
