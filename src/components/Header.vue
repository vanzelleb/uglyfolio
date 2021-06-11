<template>
  <header :class="{ scroll: scrolled }">
    <div class="container">
      <div v-if="Object.keys(asset).length !== 0">
        <span class="handFont">{{ asset.dataload.name }}</span>
      </div>
      <div v-else>
        <span class="handFont brand">Uglyfolio</span>
      </div>
    </div>
  </header>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  props: ["asset"],
  setup(props) {
    let scrolled = ref(false);

    const handleScroll = (e) => {
      scrolled.value = e.target.documentElement.scrollTop > 0;
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    return {
      scrolled,
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

.brand {
  font-size: 2rem;
}

header {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0;
}

.container {
  justify-content: center;
}

.scroll {
  -webkit-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  -moz-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
}
</style>
