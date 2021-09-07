<template>
  <header>
    <span v-if="asset.dataload.name" class="material-icons" @click="back()"
      >arrow_back</span
    >
    <span v-else></span>
    <span class="title">
      <template v-if="asset.dataload.name"> {{ asset.dataload.name }}</template>
      <template v-else><b>Uglyfolio</b></template>
    </span>
    <span></span>
  </header>
</template>


<script>
import { onMounted, ref } from "vue";
import { Asset } from "../modules/asset";

export default {
  props: ["asset"],
  setup(props) {
    const back = () => {
      // clear asset variable in order to return from detail screen
      Object.assign(props.asset, new Asset(null));
    };

    return {
      back,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
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
