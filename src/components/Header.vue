<template>
  <header>
    <span v-if="asset.dataload.name" class="material-icons" @click="back()"
      >arrow_back</span
    >
    <span v-else></span>
    <span class="title">
      <template v-if="asset.dataload.name"> {{ asset.dataload.name }}</template>
      <template v-else><b>Uglifolio</b></template>
    </span>
    <span></span>
  </header>
</template>


<script setup>
import { defineProps, onMounted, ref } from "vue";
import { Asset } from "../modules/asset";

const props = defineProps({
  asset: Object,
});
const back = () => {
  // clear asset variable in order to return from detail screen
  Object.assign(props.asset, new Asset(null));
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
span {
  min-width: 30px;
}

span:first-child {
  margin-right: auto;
}

span:last-child {
  margin-left: auto;
}

.title {
  font-size: 1.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0;
}
</style>
