import { reactive, computed } from "vue";
import { Asset } from "../composables/use-asset";

export const store = reactive({
  assetList: [],
  currencies: ["EUR"],
  exchangeRates: {
    EUR: {}
  },
  settings: {
    stopLoss: {
      pct: 0,
      date: null
    },
    taxes: 0,
    currency: "EUR",
    benchmark: {},
    termsConfirmed: false
  }
});

export const initState = () => {
  if (localStorage.store) {
    // copy store from local storage
    Object.assign(store, JSON.parse(localStorage.store));
    //store.settings.benchmark = new Asset(store.settings.benchmark);
  }
};

export const persistState = () => {
  localStorage.store = JSON.stringify(store);
};

export const saveAsset = (asset) => {
  if (asset._id) {
    // make sure every ticker is only saved once
    const IDs = store.assetList.map((item) => item._id);
    const idx = IDs.indexOf(asset._id);
    if (idx === -1) store.assetList.push(new Asset(asset));
    else store.assetList[idx] = new Asset(asset);
    persistState();
  }
};

export const removeAsset = (asset) => {
  store.assetList = store.assetList.filter(
    (item) => item._ticker !== asset._ticker
  );
  persistState();
};

// convert items into Asset class before using them
export const assets = computed(() =>
  // convert items into Asset class before using them
  store.assetList.map((item) => new Asset(item))
);
