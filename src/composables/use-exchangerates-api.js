import { today } from "../utils";
const provider = "exchangeratesapi";

function forexByDateRequest({ appCurrency, currency, date }) {
  const params = {
    path: date instanceof Date ? today : date,
    base: appCurrency.value,
    symbols: currency
  };
  return { provider, params };
}

function forexByDateResponse(json, { currency, fxBase }) {
  console.log("in exchangerateAPI: ", fxBase);
  fxBase[currency][json.date] = json.rates[currency];
}

function currencyRequest({ appCurrency }) {
  const params = {
    path: "latest",
    base: appCurrency
  };
  return { provider, params };
}

function currencyResponse(json, { currencies }) {
  const fxList = Object.keys(json.rates);
  currencies.value = fxList;
}

export const exchangeratesAPI = {
  forexByDateRequest,
  currencyRequest,
  forexByDateResponse,
  currencyResponse
};
