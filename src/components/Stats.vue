<template>
  <fieldset>
    <legend>Stats</legend>
    <table>
      <tr v-if="avgPrice">
        <td>Avg. purchase price/share:</td>
        <td class="number">
          <h5>{{ avgPrice.toFixed(2) }}</h5>
          <h6>&nbsp;{{ asset.dataload.currency }}</h6>
        </td>
      </tr>
    </table>
  </fieldset>
</template>

<script>
import { computed } from "vue";
import { avgBuyPrice } from "../composables/useAsset";

export default {
  props: ["asset"],
  setup(props) {
    const avgPrice = computed(() => avgBuyPrice(props.asset));

    return {
      avgPrice,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
h5,
h6 {
  display: inline-block;
}

number {
  text-align: right;
}
</style>
