<template>
  <div :id="'chart' + asset.ticker"></div>
</template>

<script setup>
import { defineProps, computed, onMounted, watch } from "vue";
import useLineChart from "../composables/useLineChart";
import useHistoryApi from "../composables/useHistoryApi";
import useQuoteApi from "../composables/useQuoteApi";
import useSignalApi from "../composables/useSignalApi";
import { today } from "../modules/utils";

const props = defineProps({
  asset: Object,
});

const { renderChart, updateSeries } = useLineChart(props.asset);
const { getPriceHistory } = useHistoryApi(props.asset);
const { getQuote } = useQuoteApi(props.asset);
const { getSignal } = useSignalApi(props.asset);

const isUpdated = () => {
  const hasNoPrice = !props.asset.dataload.lastPrice;
  const hasNoChart = props.asset.prices.length === 0;
  const checkedToday = props.asset.dataload.lastChecked === today;
  if (hasNoPrice || hasNoChart || !checkedToday) return false;
  return true;
};

const options = {
  series: [
    {
      name: "Price",
      data: props.asset.prices,
    },
  ],
  chart: {
    type: "area",
    height: 70,
    //width: innerWidth < 400 ? innerWidth - 13 : 400 - 13,
    sparkline: {
      enabled: true,
    },
    animations: {
      enabled: false,
    },
  },
  xaxis: {
    categories: props.asset.dates,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  tooltip: {
    enabled: false,
  },
  theme: {
    monochrome: {
      enabled: true,
      color: "#FEB019",
      shadeTo: "light",
      shadeIntensity: 0.65,
    },
  },
  noData: {
    text: "Getting your data...",
  },
};

onMounted(async () => {
  //const innerWidth = document.getElementById("content").clientWidth;
  renderChart(options);

  // update the asset if the it has no data yet
  if (props.asset.prices.length === 0) {
    if (!isUpdated()) {
      getQuote();
      getSignal();
      getPriceHistory();
    }
    // set a flag to prevent repeated API calls per day
    props.asset.dataload.lastChecked = today;
  }
});

watch(
  () => props.asset.prices,
  () => updateSeries()
);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
