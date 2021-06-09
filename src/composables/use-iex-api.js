import { saveAsset } from "../composables/useStore";

const provider = "iex";

function historyRequest(asset, start, end) {
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

function quoteRequest(asset) {
  const params = {
    path: "stock/" + asset.ticker + "/quote"
  };
  return { provider, params };
}

function quoteResponse(json, asset) {
  asset.dataload.lastPrice = parseFloat(json.latestPrice);
  saveAsset(asset);
}

function companyRequest(asset) {
  const params = {
    path: "stock/" + asset.ticker + "/company"
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
  historyRequest,
  quoteRequest,
  companyRequest,
  historyResponse,
  quoteResponse,
  companyResponse
};
