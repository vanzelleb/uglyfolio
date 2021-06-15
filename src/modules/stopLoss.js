import { store } from "../modules/store";
import { avgBuyPrice } from "../modules/asset";
import { toRef } from "vue";

if (!store.stopLossPct) store.stopLossPct = 0;

export const stopLossPct = toRef(store, "stopLossPct");

export const stopLossLimit = (asset) => {
  const maxLoss = (avgBuyPrice(asset) * stopLossPct.value) / 100;
  return maxLoss ? avgBuyPrice(asset) - maxLoss : null;
};
