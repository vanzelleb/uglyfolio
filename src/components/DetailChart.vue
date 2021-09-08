<template>
  <div :id="'chart' + asset.ticker"></div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import useLineChart from "../composables/useLineChart";
import ApexCharts from "apexcharts";
import useHistoryApi from "../composables/useHistoryApi";

const props = defineProps({
  asset: Object,
});

const { renderChart, updateSeries, updateAnnotations } = useLineChart(
  props.asset
);
const { getPriceHistory } = useHistoryApi(props.asset);

const options = {
  series: [
    {
      name: "Price",
      data: props.asset.prices,
    },
  ],
  chart: {
    toolbar: {
      show: false,
    },
    type: "area",
    height: 200,
    width: "100%",
    animations: {
      enabled: false,
    },
  },
  legend: {
    show: false,
  },
  grid: {
    show: false,
    padding: {
      left: -16,
      right: 5,
      bottom: 0,
      top: 0,
    },
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    opacity: 0,
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  xaxis: {
    type: "datetime",
    labels: {
      datetimeFormatter: {
        year: "yyyy",
        month: "MMM 'yy",
        day: "dd MMM",
        hour: "HH:mm",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: true,
    },
    crosshairs: {
      show: false,
    },
    categories: props.asset.dates,
  },
  tooltip: {
    enabled: true,
    theme: "dark",
    marker: {
      show: false,
    },
    x: {
      show: false,
      format: "dd MMM yyyy",
    },
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

onMounted(() => {
  renderChart(options);
  updateAnnotations();
});

// update the price history considering the earliest transaction date
watch(props.asset.trxns, () => {
  console.log("DetailChart: Transactions changed");
  getPriceHistory();
});

watch(
  () => props.asset.prices,
  async () => {
    console.log("DetailChart: Prices changed");
    // update the chart
    updateSeries();
    // update the buy/sell annotations in the updated chart
    updateAnnotations();
  }
);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
