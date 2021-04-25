<template>
  <div :id="'chart' + asset.ticker"></div>
</template>

<script>
import { posColor, negColor } from "../utils";
import { computed, onMounted } from "vue";
import { requestHandler } from "../composables/use-api";
import useChart from "../composables/useChart";

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
        mode: "light",
        palette: "palette4",
      },
      noData: {
        text: "Getting your data...",
      },
    };

    const { updateSeries } = useChart(props.asset, options);

    onMounted(() => {
      if (!props.asset.isUpdated()) {
        requestHandler("quote", { asset: props.asset });
        requestHandler("signal", { asset: props.asset });
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
