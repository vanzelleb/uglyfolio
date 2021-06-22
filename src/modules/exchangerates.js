import { today } from "../modules/utils";
const provider = "exchangeratesapi";

function fxByDateRequest({ appCurrency, currency, date }) {
  const params = {
    path: date instanceof Date ? today : date,
    base: appCurrency,
    symbols: currency
  };
  return { provider, params };
}

function fxByDateResponse(json, { appCurrency, currency, date, fxRates }) {
  fxRates.value[appCurrency][currency][date] = json.rates[currency];
}

function currencyRequest({ appCurrency }) {
  const params = {
    path: "latest",
    base: appCurrency
  };
  return { provider, params };
}

function currencyResponse(json, { currencies }) {
  const currencyList = Object.keys(json.rates);
  currencies.value = currencyList;
}

export const exchangeratesAPI = {
  fxByDateRequest,
  currencyRequest,
  fxByDateResponse,
  currencyResponse
};
