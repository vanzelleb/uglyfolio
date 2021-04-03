<template>
  <header class="handFont" :class="{ scroll: scrolled }">
    <div v-if="asset.dataload.name">{{ asset.dataload.name }}</div>
    <div v-else>Uglyfolio</div>
  </header>
</template>

<script>
import { asset } from "../composables/use-asset";
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
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
.handFont {
  font-size: 1.6rem;
  font-weight: bold;
}

header {
  padding: 12px 8px;
  display: flex;
  justify-content: center;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.scroll {
  -webkit-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  -moz-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
}
</style>
