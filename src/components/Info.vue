<template>
  <fieldset>
    <legend>Asset information</legend>
    <label>Industry:</label>
    <i v-if="asset.industry">{{ asset.industry }}</i>
    <label>Address:</label>
    <div v-if="asset.description">{{ asset.description }}</div>
    <address v-if="asset.address">{{ asset.address }}</address>
  </fieldset>
</template>

<script>
import { asset } from "../composables/use-store";

export default {
  setup() {
    return {
      asset,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
</style>
