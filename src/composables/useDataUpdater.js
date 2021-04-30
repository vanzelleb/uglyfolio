import { requestHandler } from "../composables/use-api";
import { today } from "../utils";

export default function useDataUpdater(asset) {
  // get 3 years of data by default
  const defaultMonths = 12;

  const isUpdated = () => {
    const hasNoPrice = !asset.lastPrice;
    const hasNoChart = asset.dates.length === 0;
    const checkedToday = asset.lastChecked === today;
    if (hasNoPrice || hasNoChart || !checkedToday) return false;
    return true;
  };

  const refreshPrices = async () => {
    console.log("Updating prices...");
    const startDate =
      asset.trxns.length > 0 ? asset.firstTrxDate() : new Date();

    startDate.setMonth(startDate.getMonth() - defaultMonths);
    const endDate = new Date();
    // refresh chart data if necessary
    await requestHandler("history", {
      asset: asset,
      start: startDate,
      end: endDate
    });
  };

  const refreshData = async () => {
    if (!isUpdated()) {
      // flag to prevent repeated API calls per day
      asset.lastChecked = today;
      requestHandler("quote", { asset: asset });
      requestHandler("signal", { asset: asset });
      await refreshPrices();
    }
  };

  return {
    refreshData,
    refreshPrices
  };
}
