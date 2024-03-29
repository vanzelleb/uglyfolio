import { saveAsset } from "../modules/asset";

const provider = "finnhub";

function historyRequest(asset, start, end) {
  let params = {
    path: "stock/candle",
    symbol: asset.ticker,
    resolution: "D",
    from: toTimestamp(start),
    to: toTimestamp(end)
  };
  return { provider, params };
}

function historyResponse(json, asset) {
  if (!json.t) throw Error("No data");
  asset.dates = json.t.map((date) => toDate(date));
  console.log("Adding prices to asset...");
  asset.prices = json.c.map((price) =>
    parseFloat(parseFloat(price).toFixed(2))
  );
  saveAsset(asset);
}

function quoteRequest(asset) {
  const params = {
    path: "quote",
    symbol: asset.ticker,
    adjusted: true
  };
  return { provider, params };
}

function quoteResponse(json, asset) {
  if (!json.c) throw Error("No data");
  asset.dataload.lastPrice = parseFloat(json.c);
  saveAsset(asset);
}

const companyRequest = (asset) => {
  const params = {
    path: "stock/profile2",
    symbol: asset.ticker
  };
  return { provider, params };
};

const companyResponse = (json, asset) => {
  asset.dataload.name = json.dataload.name;
  asset.dataload.currency = json.dataload.currency;
  asset.dataload.industry = json.finnhubIndustry;
  saveAsset(asset);
};

function signalRequest(asset) {
  const params = {
    path: "scan/technical-indicator",
    symbol: asset.ticker,
    resolution: "M"
  };
  return { provider, params };
}

function signalResponse(json, asset) {
  Object.assign(asset.dataload, json);
  saveAsset(asset);
}

function toTimestamp(date) {
  date = date ? new Date(date) : new Date();
  return (date.getTime() / 1000) | 0;
}

function toDate(date) {
  return new Date(date * 1000).toISOString().substring(0, 10);
}

export const finnhubAPI = {
  companyNews: "company-news",
  toDate: toDate,
  historyRequest,
  quoteRequest,
  companyRequest,
  signalRequest,
  historyResponse,
  quoteResponse,
  companyResponse,
  signalResponse
};
