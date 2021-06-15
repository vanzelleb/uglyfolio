import { reactive, watch } from "vue";

export const store = reactive({});

watch(store, (newStore, prevStore) => {
  localStorage.store = JSON.stringify(store);
  console.log("Local storage updated with current state.");
});
