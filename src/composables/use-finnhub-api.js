import { today } from "../utils";
import { saveAsset } from "./use-store";

const baseURL = "https://finnhub.io/api/v1/";
const provider = "finnhub";

function historyURI(asset) {
  const url = baseURL + "stock/candle";
  const endDate = asset.isSold() ? asset.dateSell : new Date();
  let params = {
    symbol: asset.ticker,
    resolution: "D",
    from: timestamp(asset.dateBuy),
    to: timestamp(endDate)
  };
  return { provider, url, params };
}

function historyResponse(json, asset) {
  let timeseries = {};
  if (!json.t) throw Error("No data");
  for (let i = 0; i < json.t.length - 1; i++) {
    let date = new Date(json.t[i] * 1000).toISOString().substring(0, 10);
    timeseries[date] = parseFloat(json.c[i]).toFixed(2);
  }
  asset.timeseries = timeseries;
  // if buy price was not set manually use the first value of the timeseries
  if (!asset.buyPrice) asset.buyPrice = parseFloat(json.c[0]).toFixed(2);
  asset.currency = "USD";
  saveAsset(asset);
}

function quoteURI(asset) {
  const url = baseURL + "quote";
  const params = {
    symbol: asset.ticker,
    adjusted: true
  };
  return { provider, url, params };
}

function quoteResponse(json, asset) {
  if (!json.c) throw Error("No data");
  asset.lastChecked = today;
  asset.lastPrice = json.c;
  asset.currency = "USD";
  saveAsset(asset);
}

const companyURI = (asset) => {
  const url = baseURL + "stock/profile2";
  const params = {
    symbol: asset.ticker
  };
  return { provider, url, params };
};

const companyResponse = (json, asset) => {
  asset.name = json.name;
  asset.currency = json.currency;
  asset.industry = json.finnhubIndustry;
  saveAsset(asset);
};

function signalURI(asset) {
  const url = baseURL + "scan/technical-indicator";
  const params = {
    symbol: asset.ticker,
    resolution: "M"
  };
  return { provider, url, params };
}

function signalResponse(json, asset) {
  if (json.technicalAnalysis)
    asset.signal = json.technicalAnalysis.signal.toUpperCase();
  if (json.trend) asset.trending = json.trend.trending;
  saveAsset(asset);
}

function targetURI(asset) {
  const url = baseURL + "stock/price-target";
  const params = {
    symbol: asset.ticker
  };
  return { provider, url, params };
}

function targetResponse(json, asset) {
  asset.targetPrice = json.targetMean;
  saveAsset(asset);
}

function newsURI(asset, from, to) {
  const url = baseURL + "company-news";
  const params = {
    symbol: asset.ticker,
    from: from,
    to: to
  };
  return { provider, url, params };
}

function newsResponse(json, asset) {
  const headlines = json.map((item) => item.headline);
  const IDs = headlines.map((headline, i) => headlines.indexOf(headline));
  const uniqueIDs = [...new Set(IDs)];
  const uniqueNews = uniqueIDs.map((id) => json[id]);
  uniqueNews.map((item) => {
    item.datetime = convertNewsDate(item.datetime);
    return item;
  });
  asset.news = uniqueNews;
  saveAsset(asset);
}

function timestamp(date) {
  date = date ? new Date(date) : new Date();
  return (date.getTime() / 1000) | 0;
}

function convertNewsDate(date) {
  return new Date(date * 1000).toISOString().substring(0, 10);
}

export const finnhubAPI = {
  historyURI,
  quoteURI,
  companyURI,
  signalURI,
  newsURI,
  targetURI,
  historyResponse,
  quoteResponse,
  companyResponse,
  signalResponse,
  targetResponse,
  newsResponse
};
