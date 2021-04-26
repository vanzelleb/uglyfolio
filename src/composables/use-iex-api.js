import { saveAsset } from "./use-asset";

const baseURL = "https://cloud.iexapis.com/stable/";
const provider = "iex";

function historyURI(asset, start, end) {
  const url = baseURL + "stock/" + asset.ticker + "/chart/1y";
  // + start.toISOString().substring(0, 10).replace(/-/g, "");
  const params = {
    chartCloseOnly: true
  };
  return { provider, url, params };
}

function historyResponse(json, asset) {
  let timeseries = {};
  if (json.length === 0) throw Error("No data");
  for (let i = 0; i < json.length - 1; i++) {
    timeseries[json[i].date] = parseFloat(parseFloat(json[i].close).toFixed(2));
  }
  asset.timeseries = timeseries;
  saveAsset(asset);
}

function quoteURI(asset) {
  const url = baseURL + "stock/" + asset.ticker + "/quote";
  const params = {};
  return { provider, url, params };
}

function quoteResponse(json, asset) {
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
