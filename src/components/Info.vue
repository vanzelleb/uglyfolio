<template>
  <fieldset>
    <legend>Asset info</legend>
    Industry:
    <div v-if="asset.industry">{{ asset.industry }}</div>
    Description:
    <div>
      <template v-if="asset.description">
        {{ asset.description }}
      </template>
      <template v-else> None </template>
    </div>
    Address:
    <div>
      <address v-if="asset.address">{{ asset.address }}</address>
    </div>
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
h2,
h4 {
  margin: 0.8rem 0 0.3rem 0;
}

div {
  font-size: 10pt;
  margin: 0 0 10px 0;
}
</style>
