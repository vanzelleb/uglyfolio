import { today } from "../utils";
import { saveAsset } from "./use-asset";

const baseURL = "https://cloud.iexapis.com/stable/";
const provider = "iex";

function historyURI(asset, start, end) {
  const url =
    baseURL +
    "stock/" +
    asset.ticker +
    "/chart/date/" +
    start.toISOString().substring(0, 10).replace(/-/g, "");
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
  asset.dataload.name = json.companyName;
  asset.dataload.address = json.country;
  asset.dataload.industry = json.industry;
  asset.dataload.description = json.description;
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
