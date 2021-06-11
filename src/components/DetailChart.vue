<template>
  <div :id="'chart' + asset.ticker"></div>
</template>

<script>
import { computed, onMounted, watch } from "vue";
import useLineChart from "../composables/useLineChart";
import useDataUpdater from "../composables/useDataUpdater";
import ApexCharts from "apexcharts";

export default {
  props: ["asset"],
  setup(props) {
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
    const { renderChart, updateSeries, updateAnnotations } = useLineChart(
      props.asset
    );
    const { getAssetPrices } = useDataUpdater();

    onMounted(() => {
      renderChart(options);
      updateAnnotations();
    });

    watch(props.asset.trxns, async () => {
      await getAssetPrices(props.asset);
      updateSeries();
      updateAnnotations();
    });

    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
