<template>
  <div :id="'chart' + asset.ticker"></div>
</template>

<script>
import { computed, onMounted, watch } from "vue";
import useLineChart from "../composables/useLineChart";
import useDataUpdater from "../composables/useDataUpdater";

export default {
  props: ["asset"],
  setup(props) {
    const { getAssetAll } = useDataUpdater();
    const { renderChart, updateSeries } = useLineChart(props.asset);

    onMounted(async () => {
      const innerWidth = document.getElementById("flexbox").clientWidth;

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
          width: innerWidth < 400 ? innerWidth - 13 : 400 - 13,
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

      renderChart(options);

      // download the prices if the asset was just added
      if (props.asset.prices.length === 0) {
        await getAssetAll(props.asset);
        updateSeries();
      }
    });

    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
