<template>
  <div :id="'chart' + asset.ticker"></div>
</template>

<script>
import { computed, onMounted, watch } from "vue";
import ApexCharts from "apexcharts";
import { asset } from "../composables/use-asset";
import { requestHandler } from "../composables/use-api";
import useChart from "../composables/use-chart";

export default {
  setup() {
    let element, chart = null;
    const trxCount = computed(() => asset.trxns.length);

    const options = {
      series: [
        {
          name: "Price",
          data: asset.prices(),
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
          right: 0,
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
        categories: asset.dates(),
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
        mode: "light",
        palette: "palette4",
      },
      noData: {
        text: "Getting your data...",
      },
    };

    onMounted(() => {
      element = document.querySelector("#chart" + asset.ticker);
      if (element) {
        chart = new ApexCharts(element, options);
        // initial render of the chart
        chart.render();
        const { updateAnnotations } = useChart(chart, asset);
        updateAnnotations();
      }
    });

    watch(
      () => trxCount.value,
      (count, prevCount) => {
        console.log("Updating chart series...");
        const { updateAnnotations, updateSeries } = useChart(chart, asset);
        updateAnnotations();
        updateSeries();
      }
    );

    return {
      asset,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
