<template>
  <div class="card number">
    <figcaption>
      <h4>
        {{ asset.dataload.name }} <small>({{ asset.ticker }})</small>
      </h4>
      <h5 v-if="asset.dataload.technicalAnalysis?.signal">
        Analyst Rating:
        <span v-if="asset.dataload.technicalAnalysis?.signal === 'buy'"
          >👍</span
        >
        <span v-if="asset.dataload.technicalAnalysis?.signal === 'neutral'">
          😐
        </span>
        <span v-if="asset.dataload.technicalAnalysis?.signal === 'sell'"
          >👎</span
        >
      </h5>
      <div v-if="buys(asset).length > 0">
        <h3 v-if="!isSold(asset)">
          You are {{ change(asset) >= 0 ? "up " : "down " }}
          {{ toLocaleNumber(change(asset), 0) }}
        </h3>
        <h3 v-else :class="{ posColor: nominalReturn(asset) >= 0 }">
          You
          {{ nominalReturn(asset) >= 0 ? "sold & gained " : "sold & lost " }}
          {{ toLocaleNumber(nominalReturn(asset), 0) }}
        </h3>
        <h6>&nbsp;{{ appCurrency }}</h6>
      </div>
    </figcaption>
    <Sparkline :asset="asset" class="sparkline" />
  </div>
</template>

<script>
import Sparkline from "../components/Sparkline.vue";
import { toLocaleNumber } from "../modules/utils";
import { isSold, change, nominalReturn, buys } from "../modules/stats";
import { appCurrency } from "../modules/currencies";

export default {
  components: {
    Sparkline,
  },
  props: ["asset"],
  setup() {
    return {
      toLocaleNumber,
      appCurrency,
      isSold,
      change,
      nominalReturn,
      buys,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  display: grid;
  border: 2px solid;
  border-radius: 5px;
  box-shadow: 6px 6px #bd93f9;
  cursor: pointer;
}

figcaption {
  margin: 0.5rem 0.8rem;
}

h3,
h5,
h6 {
  display: inline-block;
  color: rgb(59, 59, 59);
}

h3,
h5 {
  margin: 5px 0 0 0;
}
</style>
