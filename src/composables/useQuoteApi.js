import useBackend from "../composables/useBackend";
import { finnhubAPI } from "../modules/finnhub";
import { iexAPI } from "../modules/iex";

const apiOptions = {
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
};

export default function (asset) {
  const { callServer } = useBackend(apiOptions);

  const getQuote = async () => {
    await callServer({ asset: asset }, { asset: asset });
  };

  return {
    getQuote
  };
}
