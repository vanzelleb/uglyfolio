<template>
  <main>
    <div v-if="asset.name">
      <h2>{{ asset.name }}</h2>
      <button @click="setAsset()">Close</button>
      <button v-if="asset.id" @click="remove(asset)">Delete</button>
      <br />
      <Info />
      <Form />
    </div>
    <div v-else>
      <KPIs />
      <br />
      <SearchAsset />
      <br />
      <Portfolio />
    </div>
  </main>
</template>

<script>
import KPIs from "../components/KPIs.vue";
import SearchAsset from "../components/SearchAsset.vue";
import Portfolio from "../components/Portfolio.vue";
import Form from "../components/Form.vue";
import Info from "../components/Info.vue";
import { asset, setAsset, removeAsset } from "../composables/use-store";

export default {
  components: {
    KPIs,
    Portfolio,
    SearchAsset,
    Info,
    Form,
  },
  setup() {
    const remove = (asset) => {
      if (confirm("Are you sure you want delete it?")) {
        removeAsset(asset);
      }
    };

    return {
      remove,
      asset,
      setAsset,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
