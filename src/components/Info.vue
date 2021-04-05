<template>
  <fieldset>
    <legend>Asset info</legend>
    <template v-if="asset.dataload.industry">
      <h4>Industry:</h4>
      <div>{{ asset.dataload.industry }}</div>
    </template>
    <template v-if="asset.dataload.description">
      <h4>Description:</h4>
      <div>
        {{ asset.dataload.description }}
      </div>
    </template>
    <template v-if="asset.dataload.address">
      <h4>Country:</h4>
      <div>{{ asset.dataload.address }}</div>
    </template>
  </fieldset>
</template>

<script>
import { asset } from "../composables/use-asset";

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
div {
  font-size: 10pt;
  margin: 0 0 10px 0;
}
</style>
