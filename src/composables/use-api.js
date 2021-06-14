import { ref } from "vue";
import { finnhubAPI } from "../composables/use-finnhub-api";
import { iexAPI } from "../composables/use-iex-api";
import { exchangeratesAPI } from "../composables/use-exchangerates-api";
import axios from "axios";

export const error = ref("");

const resources = {
  history: {
    2: {
      prepareRequest: function ({ asset, start, end }) {
        return iexAPI.historyRequest(asset, start, end);
      },
      handleResponse: function (json, { asset }) {
        iexAPI.historyResponse(json, asset);
      }
    },
    1: {
      prepareRequest: function ({ asset, start, end }) {
        return finnhubAPI.historyRequest(asset, start, end);
      },
      handleResponse: function (json, { asset }) {
        finnhubAPI.historyResponse(json, asset);
      }
    }
  },
  quote: {
    1: {
      prepareRequest: function ({ asset }) {
        return finnhubAPI.quoteRequest(asset);
      },
      handleResponse: function (json, { asset }) {
        finnhubAPI.quoteResponse(json, asset);
      }
    },
    2: {
      prepareRequest: function ({ asset }) {
        return iexAPI.quoteRequest(asset);
      },
      handleResponse: function (json, { asset }) {
        iexAPI.quoteResponse(json, asset);
      }
    }
  },
  company: {
    1: {
      prepareRequest: function ({ asset }) {
        return iexAPI.companyRequest(asset);
      },
      handleResponse: function (json, { asset }) {
        iexAPI.companyResponse(json, asset);
      }
    },
    2: {
      prepareRequest: function ({ asset }) {
        return finnhubAPI.companyRequest(asset);
      },
      handleResponse: function (json, { asset }) {
        finnhubAPI.companyResponse(json, asset);
      }
    }
  },
  signal: {
    1: {
      prepareRequest: function ({ asset }) {
        return finnhubAPI.signalRequest(asset);
      },
      handleResponse: function (json, { asset }) {
        finnhubAPI.signalResponse(json, asset);
      }
    }
  },
  news: {
    1: {
      prepareRequest: function ({ asset, from, to }) {
        return finnhubAPI.newsRequest(asset, from, to);
      },
      handleResponse: function (json, { asset }) {
        finnhubAPI.newsResponse(json, asset);
      }
    }
  },
  forexByDate: {
    1: {
      prepareRequest: function ({ appCurrency, currency, date }) {
        return exchangeratesAPI.forexByDateRequest({
          appCurrency,
          currency,
          date
        });
      },
      handleResponse: function (json, { currency, date, fxBase }) {
        exchangeratesAPI.forexByDateResponse(json, {
          currency,
          date,
          fxBase
        });
      }
    }
  },
  currencies: {
    1: {
      prepareRequest: function ({ appCurrency }) {
        return exchangeratesAPI.currencyRequest({ appCurrency });
      },
      handleResponse: function (json, { currencies }) {
        exchangeratesAPI.currencyResponse(json, { currencies });
      }
    }
  }
};

async function queryBackend(option, requestObj) {
  const backendUrl = "https://uglyfolio.netlify.app/.netlify/functions/";
  try {
    // generate the the address to call the API with
    let { provider, params } = option.prepareRequest(requestObj);
    const { data } = await axios.get(backendUrl + provider, { params: params });
    //console.log("API return string: ", data);
    option.handleResponse(data, requestObj);
  } catch (e) {
    throw Error(e.message);
  }
}

// handles requests that have a fallback API provider, e.g. when request limit is reached or when symbol is unknown
export async function requestHandler(type, requestObj) {
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
      // fill error variable for display to user
      error.value = e.message;
      // catch API errors and try the next option
      console.log("API error for request type " + type + ": " + e.message);
      i++;
    }
  }
}
