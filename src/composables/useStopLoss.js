import { store } from "../composables/useStore";
import { avgBuyPrice } from "../composables/useAsset";
import { ref, watch, onMounted } from "vue";

export default function useStopLoss() {
  const stopLossPct = ref(0);

  onMounted(() => {
    // setup the stopLoss obkect in the store if not already done
    if (!store.stopLossPct) store.stopLossPct = stopLossPct.value;
    else stopLossPct.value = store.stopLossPct;
  });

  watch(
    () => stopLossPct.value,
    () => {
      store.stopLossPct = stopLossPct.value;
    }
  );

  const stopLossLimit = (asset) => {
    const maxLoss = (avgBuyPrice(asset) * stopLossPct.value) / 100;
    return maxLoss ? avgBuyPrice(asset) - maxLoss : null;
  };

  return {
    stopLossPct,
    stopLossLimit
  };
}
