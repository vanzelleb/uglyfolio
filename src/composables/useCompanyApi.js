import useBackend from "../composables/useBackend";
import { finnhubAPI } from "../modules/finnhub";
import { iexAPI } from "../modules/iex";

const apiOptions = {
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
};

export default function (asset) {
  const { callServer } = useBackend(apiOptions);

  const getCompany = async () => {
    await callServer({ asset: asset }, { asset: asset });
  };

  return {
    getCompany
  };
}
