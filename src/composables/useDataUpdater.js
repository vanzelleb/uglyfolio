import { requestHandler } from "../composables/use-api";
import { today } from "../utils";
import { store, assets } from "../composables/use-store";

export default function useDataUpdater() {
  // get 1 year of data by default
  const defaultMonths = 12;

  const isUpdated = (asset) => {
    const hasNoPrice = !asset.dataload.lastPrice;
    const hasNoChart = asset.dates.length === 0;
    const checkedToday = asset.dataload.lastChecked === today;
    if (hasNoPrice || hasNoChart || !checkedToday) return false;
    return true;
  };

  const refreshAssetPrices = async (asset) => {
    //console.log("Updating prices...");
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
    // find the current date in the users timezone
    const timezoneDate = new Date(
      new Date(today).getTime() - new Date(today).getTimezoneOffset() * 60000
    );
    // set a flag to prevent repeated API calls per day and consider timezone offset
    asset.dataload.lastChecked = timezoneDate.toISOString().substring(0, 10);
  };

  const refreshAssetCompany = async (asset) => {
    await requestHandler("company", { asset: asset });
  };

  const refreshAssetAll = async (asset) => {
    if (!isUpdated(asset)) {
      requestHandler("quote", { asset: asset });
      requestHandler("signal", { asset: asset });
      await refreshAssetPrices(asset);
    }
  };

  const getFXRate = (cur, date) => {
    requestHandler("forexByDate", {
      currency: cur,
      date: date
    });
  };

  const refreshFXRates = () => {
    let FXBase = store.exchangeRates[store.settings.currency];
    if (!FXBase) FXBase = {};
    // retrieve latest exchange rates for all currency combinations
    for (const item of assets.value) {
      if (item.currency !== store.settings.currency) {
        const hasFXPair = !!FXBase[item.currency];
        // reset the exchange rates for the currency pair
        if (!hasFXPair) {
          FXBase[item.currency] = {};
        } else {
          let FXPair = FXBase[item.currency];
          var hasFXForBuyDate = !!FXPair[item.firstTrxDate()];
          var hasLatestFX = !!FXPair[today];
        }
        if (!hasFXForBuyDate && item.firstTrxDate())
          getFXRate(item.currency, item.firstTrxDate());
        if (!hasLatestFX) getFXRate(item.currency, today);
      }
    }
  };

  const refreshCurrencies = async () => {
    requestHandler("currencies");
  };

  return {
    refreshAssetAll,
    refreshAssetPrices,
    refreshAssetCompany,
    refreshFXRates,
    refreshCurrencies
  };
}
