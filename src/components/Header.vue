<template>
  <header :class="{ scroll: scrolled }">
    <span class="handFont">Uglyfolio</span>
    <button v-if="asset.name" @click="setAsset()">❌ CLOSE</button>
  </header>
</template>

<script>
import { asset, setAsset } from "../composables/use-store";
import { onMounted, ref } from "vue";

export default {
  setup() {
    let scrolled = ref(false);

    const handleScroll = (e) => {
      scrolled.value = e.target.documentElement.scrollTop > 0;
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    return {
      scrolled,
      asset,
      setAsset,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
.handFont {
  font-size: 2rem;
  font-weight: bold;
}

header {
  padding: 12px 8px;
  display: flex;
  justify-content: space-between;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

.scroll {
  -webkit-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  -moz-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
}
</style>
