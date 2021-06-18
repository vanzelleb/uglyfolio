import { store } from "../modules/store";
import { toRef } from "vue";

if (!store.appCurrency) store.appCurrency = "EUR";
if (!store.currencies) store.currencies = ["EUR"];
if (!store.fx)
  store.fx = {
    EUR: {}
  };

export const appCurrency = toRef(store, "appCurrency");
export const currencies = toRef(store, "currencies");
export const fx = toRef(store, "fx");
