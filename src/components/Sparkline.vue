<template>
  <div :id="'chart' + asset.ticker"></div>
</template>

<script>
import { computed, onMounted } from "vue";
import { requestHandler } from "../composables/use-api";
import useChart from "../composables/useChart";
import useDataUpdater from "../composables/useDataUpdater";

export default {
  props: ["asset"],
  setup(props) {
    const options = {
      series: [
        {
          name: "Price",
          data: props.asset.prices(),
        },
      ],
      chart: {
        type: "area",
        height: 70,
        width: 300,
        sparkline: {
          enabled: true,
        },
        animations: {
          enabled: false,
        },
      },
      xaxis: {
        categories: props.asset.dates(),
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

    const { updateSeries } = useChart(props.asset, options);
    const { refreshData } = useDataUpdater(props.asset);

    onMounted(async () => {
      await refreshData();
      updateSeries();
    });

    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
