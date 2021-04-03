import { reactive } from "vue";

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
