<template>
  <fieldset>
    <legend>Asset info</legend>
    Industry:
    <div>
      <i v-if="asset.industry">{{ asset.industry }}</i>
    </div>
    Description:
    <div>
      <i>
        <template v-if="asset.description">
          {{ asset.description }}
        </template>
        <template v-else> None </template>
      </i>
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
