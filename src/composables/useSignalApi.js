import useBackend from "../composables/useBackend";
import { finnhubAPI } from "../modules/finnhub";

const apiOptions = {
  1: {
    prepareRequest: function ({ asset }) {
      return finnhubAPI.signalRequest(asset);
    },
    handleResponse: function (json, { asset }) {
      finnhubAPI.signalResponse(json, asset);
    }
  }
};

export default function (asset) {
  const { callServer } = useBackend(apiOptions);

  const getSignal = async () => {
    await callServer({ asset: asset }, { asset: asset });
  };

  return {
    getSignal
  };
}
