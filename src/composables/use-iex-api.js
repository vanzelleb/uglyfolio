import { saveAsset } from "./use-asset";


const provider = "iex";

function historyURI(asset, start, end) {
  // + start.toISOString().substring(0, 10).replace(/-/g, "");
  const params = {
    path: "stock/" + asset.ticker + "/chart/1y",
    chartCloseOnly: true
  };
  return { provider, params };
}

function historyResponse(json, asset) {
  if (json.length === 0) throw Error("No data");
  asset.dates = json.map((item) => item.date);
  asset.prices = json.c.map((item) =>
    parseFloat(parseFloat(item.price).toFixed(2))
  );
  saveAsset(asset);
}

function quoteURI(asset) {
  const params = {
    path: "stock/" + asset.ticker + "/quote",
  };
  return { provider, params };
}

function quoteResponse(json, asset) {
  asset.lastPrice = json.latestPrice;
  saveAsset(asset);
}

function companyURI(asset) {
  const params = {
    path: "stock/" + asset.ticker + "/company",
  };
  return { provider, params };
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
