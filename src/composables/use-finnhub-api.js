import { saveAsset } from "./use-asset";

const provider = "finnhub";

function historyURI(asset, start, end) {
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
  asset.prices = json.c.map((price) =>
    parseFloat(parseFloat(price).toFixed(2))
  );
  saveAsset(asset);
}

function quoteURI(asset) {
  const params = {
    path: "quote",
    symbol: asset.ticker,
    adjusted: true
  };
  return { provider, params };
}

function quoteResponse(json, asset) {
  if (!json.c) throw Error("No data");
  asset.lastPrice = json.c;
  saveAsset(asset);
}

const companyURI = (asset) => {
  const params = {
    path: "stock/profile2",
    symbol: asset.ticker
  };
  return { provider, params };
};

const companyResponse = (json, asset) => {
  asset.name = json.name;
  asset.currency = json.currency;
  asset.dataload.industry = json.finnhubIndustry;
  saveAsset(asset);
};

function signalURI(asset) {
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

function newsURI(asset, from, to) {
  const params = {
    path: "company-news",
    symbol: asset.ticker,
    from: from,
    to: to
  };
  return { provider, params };
}

function newsResponse(json, asset) {
  const headlines = json.map((item) => item.headline);
  const IDs = headlines.map((headline, i) => headlines.indexOf(headline));
  const uniqueIDs = [...new Set(IDs)];
  const uniqueNews = uniqueIDs.map((id) => json[id]);
  uniqueNews.map((item) => {
    item.datetime = toDate(item.datetime);
    return item;
  });
  asset.news = uniqueNews;
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
  historyURI,
  quoteURI,
  companyURI,
  signalURI,
  newsURI,
  historyResponse,
  quoteResponse,
  companyResponse,
  signalResponse,
  newsResponse
};
