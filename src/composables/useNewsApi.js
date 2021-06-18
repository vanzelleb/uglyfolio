import useBackend from "../composables/useBackend";
import { finnhubAPI } from "../modules/finnhub";

const apiOptions = {
  1: {
    prepareRequest: function ({ asset, from, to }) {
      return finnhubAPI.newsRequest(asset, from, to);
    },
    handleResponse: function (json, { asset }) {
      finnhubAPI.newsResponse(json, asset);
    }
  }
};

export default function (asset) {
  const { callServer } = useBackend(apiOptions);

  const getNews = async (from, to) => {
    await callServer({ asset: asset, from: from, to: to }, { asset: asset });
  };

  return {
    getNews
  };
}
