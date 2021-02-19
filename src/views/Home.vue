<template>
  <main>
    <KPIs />
    <br />
    <SearchAsset />
    <br />
    <Portfolio />
  </main>
</template>

<script>
import KPIs from "../components/KPIs.vue";
import SearchAsset from "../components/SearchAsset.vue";
import Portfolio from "../components/Portfolio.vue";
import { setAsset } from "../composables/use-store";

export default {
  components: {
    KPIs,
    Portfolio,
    SearchAsset,
  },
  setup() {
    // reset the asset object every time we return to the home screen
    setAsset();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
