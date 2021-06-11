<template>
  <details>
    <summary><span class="link">Asset Information</span></summary>
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
  </details>
</template>

<script>
export default {
  props: ["asset"],
  setup(props) {
    return {};
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
