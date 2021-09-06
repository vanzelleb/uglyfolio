<template>
  <header :class="{ scroll: scrolled }">
    <div class="container">
      <span v-if="asset.dataload.name" class="material-icons" @click="close()"
        >arrow_back</span
      >
      <span v-else></span>
      <span v-if="asset.dataload.name" class="title">{{
        asset.dataload.name
      }}</span>
      <span v-else class="title">Uglyfolio</span>
      <span v-if="asset.dataload.name"></span>
      <span v-else></span>
    </div>
  </header>
</template>

<script>
import { onMounted, ref } from "vue";
import { Asset } from "../modules/asset";

export default {
  props: ["asset"],
  setup(props) {
    const scrolled = ref(false);

    const handleScroll = (e) => {
      scrolled.value = e.target.documentElement.scrollTop > 0;
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    const close = () => {
      // clear asset variable in order to return from detail screen
      Object.assign(props.asset, new Asset(null));
    };

    return {
      close,
      scrolled,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
header {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

span {
  min-width: 30px;
}

.material-icons {
  font-size: 20pt;
  align-self: center;
  cursor: pointer;
}

.title {
  font-size: 1.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0;
}

.container {
  padding: 18px 8px;
  justify-content: space-between;
}

.scroll {
  -webkit-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  -moz-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
}
</style>
