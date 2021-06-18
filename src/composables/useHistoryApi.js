import useBackend from "../composables/useBackend";
import { firstTrxDate } from "../modules/stats";
import { finnhubAPI } from "../modules/finnhub";
import { iexAPI } from "../modules/iex";

// amount of months before the first transaction we want data for
const defaultMonths = 6;

const apiOptions = {
  1: {
    prepareRequest: function ({ asset, start, end }) {
      return finnhubAPI.historyRequest(asset, start, end);
    },
    handleResponse: function (json, { asset }) {
      finnhubAPI.historyResponse(json, asset);
    }
  },
  2: {
    prepareRequest: function ({ asset, start, end }) {
      return iexAPI.historyRequest(asset, start, end);
    },
    handleResponse: function (json, { asset }) {
      iexAPI.historyResponse(json, asset);
    }
  }
};

export default function (asset) {
  const { callServer } = useBackend(apiOptions);

  const getPriceHistory = async () => {
    const startDate = asset.trxns.length > 0 ? firstTrxDate(asset) : new Date();
    startDate.setMonth(startDate.getMonth() - defaultMonths);
    const endDate = new Date();

    await callServer(
      { asset: asset, start: startDate, end: endDate },
      { asset: asset }
    );
  };

  return {
    getPriceHistory
  };
}
