import { today, timestamp } from "../utils";
import { store, saveAsset, persistState } from "../composables/use-store";

export const netlifyFuncBaseUrl =
  "https://pollofolio.netlify.app/.netlify/functions/";

const providers = {
  finnhub: {
    provider: "finnhub",
    baseUrl: "https://finnhub.io/api/v1/"
  },
  iex: {
    provider: "iex",
    baseUrl: "https://cloud.iexapis.com/stable/"
  },
  exchangeratesapi: {
    provider: "exchangeratesapi",
    baseUrl: "https://api.exchangeratesapi.io/"
  }
};

const checkTicker = (asset) => {
  if (!asset || !asset.ticker) throw Error("User error: No ticker provided.");
};

export const resources = {
  history: {
    2: {
      provider: "iex",
      getUri: function ({ asset }) {
        checkTicker(asset);
        const uri =
          providers.iex.baseUrl +
          "stock/" +
          asset.ticker +
          "/chart/date/" +
          asset.dateBuy.replace(/-/g, "");
        const params = {
          chartByDay: true
        };
        return { uri, params };
      },
      handleResponse: function (json, { asset }) {
        if (!json[0]) throw Error("No data");
        asset.buyPrice = asset.buyPrice
          ? asset.buyPrice
          : parseFloat(json[0]["close"]).toFixed(2);
        this.lastChecked = today;
        saveAsset(asset);
      }
    },
    1: {
      provider: providers.finnhub.provider,
      getUri: function ({ asset }) {
        checkTicker(asset);
        const uri = providers.finnhub.baseUrl + "stock/candle";
        const endDate = asset.isSold() ? asset.dateSell : new Date();
        let params = {
          symbol: asset.ticker,
          resolution: "D",
          from: timestamp(asset.dateBuy),
          to: timestamp(endDate)
        };
        return { uri, params };
      },
      handleResponse: function (json, { asset }) {
        let timeseries = {};
        if (!json.t) throw Error("No data");
        for (let i = 0; i < json.t.length - 1; i++) {
          let date = new Date(json.t[i] * 1000).toISOString().substring(0, 10);
          timeseries[date] = parseFloat(json.c[i]).toFixed(2);
        }
        asset.timeseries = timeseries;
        asset.buyPrice = asset.buyPrice
          ? asset.buyPrice
          : parseFloat(json.c[0]).toFixed(2);
        asset.lastChecked = today;
        asset.currency = "USD";
        saveAsset(asset);
      }
    }
  },
  quote: {
    1: {
      provider: providers.finnhub.provider,
      getUri: function ({ asset }) {
        checkTicker(asset);
        const uri = providers.finnhub.baseUrl + "quote";
        const params = {
          symbol: asset.ticker,
          adjusted: true
        };
        return { uri, params };
      },
      handleResponse: function (json, { asset }) {
        if (!json.c) throw Error("No data");
        asset.lastChecked = today;
        asset.lastPrice = json.c;
        asset.currency = "USD";
        saveAsset(asset);
      }
    },
    2: {
      provider: providers.iex.provider,
      getUri: function ({ asset }) {
        checkTicker(asset);
        const uri = providers.iex.baseUrl + "stock/" + asset.ticker + "/quote";
        const params = {
        };
        return { uri, params };
      },
      handleResponse: function (json, { asset }) {
        asset.lastChecked = today;
        asset.lastPrice = json.latestPrice;
        saveAsset(asset);
      }
    }
  },
  company: {
    1: {
      provider: providers.iex.provider,
      getUri: function ({ asset }) {
        checkTicker(asset);
        const uri =
          providers.iex.baseUrl + "stock/" + asset.ticker + "/company";
        const params = {
        };
        return { uri, params };
      },
      handleResponse: function (json, { asset }) {
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
    },
    2: {
      provider: providers.finnhub.provider,
      getUri: function ({ asset }) {
        checkTicker(asset);
        const uri = providers.finnhub.baseUrl + "stock/profile2";
        const params = {
          symbol: asset.ticker
        };
        return { uri, params };
      },
      handleResponse: function (json, { asset }) {
        // prevent overwriting user's naming
        asset.name = json.name;
        asset.currency = json.currency;
        asset.industry = json.finnhubIndustry;
        saveAsset(asset);
      }
    }
  },
  signal: {
    1: {
      provider: providers.finnhub.provider,
      getUri: function ({ asset }) {
        checkTicker(asset);
        const uri = providers.finnhub.baseUrl + "scan/technical-indicator";
        const params = {
          symbol: asset.ticker,
          resolution: "M",
        };
        return { uri, params };
      },
      handleResponse: function (json, { asset }) {
        if (json.technicalAnalysis)
          asset.signal = json.technicalAnalysis.signal.toUpperCase();
        if (json.trend) asset.trending = json.trend.trending;
        saveAsset(asset);
      }
    }
  },
  target: {
    1: {
      provider: providers.finnhub.provider,
      getUri: function ({ asset }) {
        checkTicker(asset);
        const uri = providers.finnhub.baseUrl + "stock/price-target";
        const params = {
          symbol: asset.ticker,
        };
        return { uri, params };
      },
      handleResponse: function (json, { asset }) {
        asset.targetPrice = json.targetMean;
        saveAsset(asset);
      }
    }
  },
  news: {
    1: {
      provider: providers.finnhub.provider,
      getUri: function ({ asset, from, to }) {
        checkTicker(asset);
        const uri = providers.finnhub.baseUrl + "company-news";
        const params = {
          symbol: asset.ticker,
          from: from,
          to: to
        };
        return { uri, params };
      },
      handleResponse: function (json, { asset }) {
        asset.news = json;
        saveAsset(asset);
      }
    }
  },
  forexByDate: {
    1: {
      provider: "exchangeratesapi",
      getUri: function ({ currency, date }) {
        const uri = providers.exchangeratesapi.baseUrl + date;
        const params = {
          base: store.settings.currrency,
          symbols: currency
        };
        return { uri, params };
      },
      handleResponse: function (json, { currency, date }) {
        store.exchangeRates[store.settings.currency][currency][date] =
          json.rates[currency];
        persistState();
      }
    }
  },
  currencies: {
    1: {
      provider: "exchangeratesapi",
      getUri: function () {
        const uri = providers.exchangeratesapi.baseUrl + "latest";
        const params = {
          base: store.settings.currency
        };
        return { uri, params };
      },
      handleResponse: function (json) {
        store.currencies = [
          ...Object.keys(json.rates),
          store.settings.currency
        ];
        persistState();
      }
    }
  }
};
