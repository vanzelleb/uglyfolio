<template>
  <div>
    <div :id="'sparkline' + asset.ticker"></div>
  </div>
</template>

<script>
import { posColor, negColor } from "../utils";
import { computed, onMounted } from "vue";
import ApexCharts from "apexcharts";
import { requestHandler } from "../composables/use-api";
import useChart from "../composables/use-chart";

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
        //colors: [getColor()],
        width: 2,
      },
      tooltip: {
        enabled: false,
      },
      //colors: [getColor()],
      theme: {
        mode: "light",
        palette: "palette4",
      },
      noData: {
        text: "Getting your data...",
      },
    };

    onMounted(() => {
      const element = document.querySelector("#sparkline" + props.asset.ticker);

      if (element) {
        var chart = new ApexCharts(element, options);
        // initial render of the chart
        chart.render();
        // refresh chart data if necessary

        if (!props.asset.isUpdated()) {
          const { updateSeries } = useChart(chart, props.asset);
          requestHandler("quote", { asset: props.asset });
          requestHandler("signal", { asset: props.asset });
          updateSeries();
        }
      }
    });

    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
