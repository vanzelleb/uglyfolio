import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import VueApexCharts from "vue3-apexcharts";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./public/service-worker.js");
  });
}

console.log("in main");

const app = createApp(App).use(router).use(VueApexCharts);
app.mount("#app");
