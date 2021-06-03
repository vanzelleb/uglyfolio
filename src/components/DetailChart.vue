<template>
  <div :id="'chart' + asset.ticker"></div>
</template>

<script>
import { computed, onMounted, watch } from "vue";
import { asset } from "../composables/use-asset";
import useLineChart from "../composables/useLineChart";
import useDataUpdater from "../composables/useDataUpdater";

export default {
  setup() {
    const options = {
      series: [
        {
          name: "Price",
          data: asset.prices,
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
        categories: asset.dates,
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
      asset
    );
    const { refreshAssetPrices } = useDataUpdater(asset);

    onMounted(() => {
      renderChart(options);
      updateAnnotations();
    });

    watch(asset.trxns, async () => {
      await refreshAssetPrices(asset);
      //updateSeries();
      updateAnnotations();
    });

    return {
      asset,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
