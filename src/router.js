import Home from "./views/Home.vue";
import Details from "./views/Details.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/details",
    name: "details",
    component: Details
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

export default router;
