import { today } from "../utils";
import { saveAsset } from "./use-store";

const baseURL = "https://cloud.iexapis.com/stable/";
const provider = "iex";

function historyURI(asset) {
  const url =
    baseURL +
    "stock/" +
    asset.ticker +
    "/chart/date/" +
    asset.dateBuy.replace(/-/g, "");
  const params = {
    chartByDay: true
  };
  return { provider, url, params };
}

function historyResponse(json, asset) {
  if (!json[0]) throw Error("No data");
  if (!asset.buyPrice) asset.buyPrice = parseFloat(json[0]["close"]).toFixed(2);
  saveAsset(asset);
}

function quoteURI(asset) {
  const url = baseURL + "stock/" + asset.ticker + "/quote";
  const params = {};
  return { provider, url, params };
}

function quoteResponse(json, asset) {
  asset.lastChecked = today;
  asset.lastPrice = json.latestPrice;
  saveAsset(asset);
}

function companyURI(asset) {
  const url = baseURL + "stock/" + asset.ticker + "/company";
  const params = {};
  return { provider, url, params };
}

function companyResponse(json, asset) {
  asset.name = json.companyName;
  asset.address = [
    json.address,
    json.zip,
    json.city,
    json.state,
    json.country
  ].join(", ");
  asset.industry = json.industry;
  asset.description = json.description;
  saveAsset(asset);
}

export const iexAPI = {
  historyURI,
  quoteURI,
  companyURI,
  historyResponse,
  quoteResponse,
  companyResponse
};
