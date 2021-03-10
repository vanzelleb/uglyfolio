<template>
  <fieldset>
    <legend>
      <h2>{{ asset.name }}</h2>
    </legend>
    <h4>Industry:</h4>
    <small
      ><i v-if="asset.industry">{{ asset.industry }}</i></small
    >
    <h4>Description:</h4>
    <small
      ><i>
        <template v-if="asset.description">
          {{ asset.description }}
        </template>
        <template v-else> None </template>
      </i>
    </small>
    <h4>Address:</h4>
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
h2,
h4 {
  margin: 0.8rem 0 0.3rem 0;
}
</style>
