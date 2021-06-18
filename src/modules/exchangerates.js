import { today } from "../modules/utils";
const provider = "exchangeratesapi";

function fxByDateRequest({ appCurrency, currency, date }) {
  const params = {
    path: date instanceof Date ? today : date,
    base: appCurrency.value,
    symbols: currency
  };
  return { provider, params };
}

function fxByDateResponse(json, { appCurrency, currency, fxRates }) {
  fxRates[appCurrency][currency][json.date] = json.rates[currency];
}

function currencyRequest({ appCurrency }) {
  const params = {
    path: "latest",
    base: appCurrency.value
  };
  return { provider, params };
}

function currencyResponse(json, { currencies }) {
  const fxList = Object.keys(json.rates);
  currencies.value = fxList;
}

export const exchangeratesAPI = {
  fxByDateRequest,
  currencyRequest,
  fxByDateResponse,
  currencyResponse
};
