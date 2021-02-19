<template>
  <div id="chart">
    <apexchart
      type="area"
      :height="height"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue";
import { posColor, negColor } from "../utils";

export default {
  props: ["prices", "dates", "height"],
  components: {
    apexchart: VueApexCharts,
  },
  data: function () {
    return {
      series: [
        {
          name: "Price",
          data: this.prices,
        },
      ],
      chartOptions: {
        chart: {
          offsetX: 0,
          toolbar: {
            show: false,
          },
          type: "area",
          height: this.height,
          width: "100%",
          sparkline: {
            enabled: true,
          },
        },
        legend: {
          show: false,
        },
        grid: {
          show: false,
          padding: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          },
        },
        stroke: {
          curve: "smooth",
          colors: [this.getColor()],
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
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            show: false,
          },
          categories: this.dates,
        },
        tooltip: {
          enabled: true,
          theme: "dark",
          marker: {
            show: false,
          },
        },
        colors: [this.getColor()],
      },
    };
  },
  methods: {
    getColor() {
      if (this.prices[0] <= this.prices[this.prices.length - 1])
        // green gradient
        return posColor;
      // red gradient
      else return negColor;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
