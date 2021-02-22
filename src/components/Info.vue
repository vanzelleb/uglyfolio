<template>
  <fieldset v-if="asset.id">
    <legend>Asset information</legend>
    <label>Industry:</label>
    <small
      ><i v-if="asset.industry">{{ asset.industry }}</i></small
    >
    <label>Description:</label>
    <small
      ><i>
        <template v-if="asset.description">
          {{ asset.description }}
        </template>
        <template v-else> None </template>
      </i>
    </small>
    <label>Address:</label>
    <small
      ><address v-if="asset.address">{{ asset.address }}</address></small
    >
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
