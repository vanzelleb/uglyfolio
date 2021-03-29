<template>
  <div :id="'sparkline' + asset.ticker"></div>
</template>

<script>
import { posColor, negColor } from "../utils";
import { computed, onMounted } from "vue";
import ApexCharts from "apexcharts";
import { requestHandler } from "../composables/use-api";

export default {
  props: ["asset"],
  setup(props) {
    const getColor = () => {
      if (
        props.asset.prices[0] <=
        props.asset.prices[props.asset.prices.length - 1]
      )
        // green gradient
        return posColor;
      // red gradient
      else return negColor;
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
        height: 60,
        width: "100%",
        sparkline: {
          enabled: true,
        },
        animations: {
          enabled: false,
        },
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
      const startDate =
        props.asset.trxns.length > 0 ? props.asset.firstTrxDate() : new Date();
      // get 3 months of data before the transaction date for context
      startDate.setMonth(startDate.getMonth() - 3);
      const endDate = new Date();

      if (element) {
        var chart = new ApexCharts(element, options);
        // initial render of the chart
        chart.render();
        // refresh chart data if necessary
        if (!props.asset.isUpdated()) {
          requestHandler("quote", { asset: props.asset });
          requestHandler("signal", { asset: props.asset });
          requestHandler("history", {
            asset: props.asset,
            start: startDate,
            end: endDate,
          }).then(function () {
            chart.updateSeries([
              {
                name: "Price",
                data: props.asset.prices,
              },
            ]);
            chart.updateOptions({
              xaxis: {
                categories: props.asset.dates,
              },
            });
          });
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
