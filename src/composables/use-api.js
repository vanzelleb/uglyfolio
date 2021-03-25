import { ref } from "vue";
import { finnhubAPI } from "../composables/use-finnhub-api";
import { iexAPI } from "../composables/use-iex-api";
import { exchangeratesAPI } from "../composables/use-exchangerates-api";

const error = ref("");

const resources = {
  history: {
    2: {
      getUri: function ({ asset }) {
        return iexAPI.historyURI(asset);
      },
      handleResponse: function (json, { asset }) {
        iexAPI.historyResponse(json, asset);
      }
    },
    1: {
      getUri: function ({ asset }) {
        return finnhubAPI.historyURI(asset);
      },
      handleResponse: function (json, { asset }) {
        finnhubAPI.historyResponse(json, asset);
      }
    }
  },
  quote: {
    1: {
      getUri: function ({ asset }) {
        return finnhubAPI.quoteURI(asset);
      },
      handleResponse: function (json, { asset }) {
        finnhubAPI.quoteResponse(json, asset);
      }
    },
    2: {
      getUri: function ({ asset }) {
        return iexAPI.quoteURI(asset);
      },
      handleResponse: function (json, { asset }) {
        iexAPI.quoteResponse(json, asset);
      }
    }
  },
  company: {
    1: {
      getUri: function ({ asset }) {
        return iexAPI.companyURI(asset);
      },
      handleResponse: function (json, { asset }) {
        iexAPI.companyResponse(json, asset);
      }
    },
    2: {
      getUri: function ({ asset }) {
        return finnhubAPI.companyURI(asset);
      },
      handleResponse: function (json, { asset }) {
        finnhubAPI.companyResponse(json, asset);
      }
    }
  },
  signal: {
    1: {
      getUri: function ({ asset }) {
        return finnhubAPI.signalURI(asset);
      },
      handleResponse: function (json, { asset }) {
        finnhubAPI.signalResponse(json, asset);
      }
    }
  },
  target: {
    1: {
      getUri: function ({ asset }) {
        return finnhubAPI.targetURI(asset);
      },
      handleResponse: function (json, { asset }) {
        finnhubAPI.targetResponse(json, asset);
      }
    }
  },
  news: {
    1: {
      getUri: function ({ asset, from, to }) {
        return finnhubAPI.newsURI(asset, from, to);
      },
      handleResponse: function (json, { asset }) {
        finnhubAPI.newsResponse(json, asset);
      }
    }
  },
  forexByDate: {
    1: {
      getUri: function ({ currency, date }) {
        return exchangeratesAPI.forexByDateURI({ currency, date });
      },
      handleResponse: function (json, { currency, date }) {
        exchangeratesAPI.forexByDateResponse(json, { currency, date });
      }
    }
  },
  currencies: {
    1: {
      getUri: function () {
        return exchangeratesAPI.currencyURI();
      },
      handleResponse: function (json) {
        exchangeratesAPI.currencyResponse(json);
      }
    }
  }
};

async function queryBackend(option, requestObj) {
  let resString = null;
  const backendURL = "https://uglyfolio.netlify.app/.netlify/functions/";

  try {
    // generate the the address to call the API with
    let { provider, url, params } = option.getUri(requestObj);
    let string = JSON.stringify({ url, params });
    const res = await fetch(backendURL + provider, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: string
    });
    resString = await res.text();
    console.log("API return string: ", resString);
    option.handleResponse(JSON.parse(resString), requestObj);
  } catch (e) {
    if (e instanceof SyntaxError) throw Error(resString);
    else throw Error(e.message);
  }
}

// handles requests that have a fallback API provider, e.g. when request limit is reached or when symbol is unknown
async function requestHandler(type, requestObj) {
  let options = Object.keys(resources[type]).length;
  let i = 1;
  // reset error variable
  error.value = "";

  while (i <= options) {
    try {
      // call the netlify functions that trigger the API calls
      await queryBackend(resources[type][i], requestObj);
      i = options + 1;
    } catch (e) {
      // catch API errors and try the next option
      error.value = e.message + " " + error.value;
      console.log("API error for request type " + type + ": " + error.value);
      i++;
    }
  }
}

export const useAPI = {
  error,
  requestHandler
};
