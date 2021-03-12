import { reactive, computed } from "vue";
import Asset from "../asset-class";

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

export const asset = reactive(new Asset());

export const assets = computed(() =>
  // convert items into Asset class before using them
  store.assetList.map((item) => new Asset(item))
);

export const saveAsset = (asset) => {
  if (asset.id) {
    const IDs = assets.value.map((item) => item.id);
    const idx = IDs.indexOf(asset.id);
    if (idx === -1) store.assetList.push(new Asset(asset));
    else store.assetList[idx] = new Asset(asset);
    persistState();
  }
};

export const removeAsset = (asset) => {
  store.assetList = store.assetList.filter((item) => item.id !== asset.id);
  persistState();
};

export const setAsset = (item) => {
  Object.assign(asset, new Asset(item));
};

export const initState = () => {
  if (localStorage.store) {
    // copy store from local storage
    Object.assign(store, JSON.parse(localStorage.store));
    store.settings.benchmark = new Asset(store.settings.benchmark);
    //assets.value = store.assetList.map((item) => new Asset(item));
  }
};

export const persistState = () => {
  localStorage.store = JSON.stringify(store);
};
