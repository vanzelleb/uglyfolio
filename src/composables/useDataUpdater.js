import { requestHandler } from "../composables/use-api";
import { today } from "../utils";
import { firstTrxDate } from "../composables/useAsset";

// get 1 year of data by default
const defaultMonths = 12;

const isUpdated = (asset) => {
  const hasNoPrice = !asset.dataload.lastPrice;
  const hasNoChart = asset.prices.length === 0;
  const checkedToday = asset.dataload.lastChecked === today;
  if (hasNoPrice || hasNoChart || !checkedToday) return false;
  return true;
};

export const getAssetPrices = async (asset) => {
  //console.log("Updating prices...");
  const startDate = asset.trxns.length > 0 ? firstTrxDate(asset) : new Date();

  startDate.setMonth(startDate.getMonth() - defaultMonths);
  const endDate = new Date();
  // refresh chart data if necessary
  await requestHandler("history", {
    asset: asset,
    start: startDate,
    end: endDate
  });
  // find the current date in the users timezone
  const timezoneDate = new Date(
    new Date(today).getTime() - new Date(today).getTimezoneOffset() * 60000
  );
  // set a flag to prevent repeated API calls per day and consider timezone offset
  asset.dataload.lastChecked = timezoneDate.toISOString().substring(0, 10);
};

export const getAssetCompany = async (asset) => {
  await requestHandler("company", { asset: asset });
};

export const getAssetAll = async (asset) => {
  if (!isUpdated(asset)) {
    requestHandler("quote", { asset: asset });
    requestHandler("signal", { asset: asset });
    await getAssetPrices(asset);
  }
};
