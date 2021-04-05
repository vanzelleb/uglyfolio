<template>
  <header :class="{ scroll: scrolled }">
    <div class="container">
      <details v-if="asset.dataload.name">
        <summary class="handFont">{{ asset.dataload.name }}</summary>
        <Info />
      </details>
      <details v-else>
        <summary class="handFont">Uglyfolio</summary>
        <Settings />
      </details>
    </div>
  </header>
</template>

<script>
import { asset } from "../composables/use-asset";
import { onMounted, ref } from "vue";
import Info from "./Info.vue";
import Settings from "./Settings.vue";

export default {
  components: {
    Info,
    Settings,
  },
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
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

summary {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0;
}

details {
  margin: 0 0;
}

.container {
  display: flex;
  justify-content: start;
  max-width: 80ch;
  margin: 0 auto;
}

.scroll {
  -webkit-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  -moz-box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
  box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
}
</style>
