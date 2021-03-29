<template>
  <div :id="'chart' + asset.ticker"></div>
</template>

<script>
import { computed, onMounted, watch } from "vue";
import ApexCharts from "apexcharts";
import { asset } from "../composables/use-store";

export default {
  setup() {
    const getColor = () => {
      if (asset.prices[0] <= asset.prices[asset.prices.length - 1])
        // green gradient
        return posColor;
      // red gradient
      else return negColor;
    };

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
          left: 0,
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
        mode: "light",
        palette: "palette4",
      },
      noData: {
        text: "Getting your data...",
      },
    };

    let annotationList = [];
    let chart = null;

    function BuyAnnotation(date) {
      this.x = new Date(date).getTime();
      this.borderColor = "#999";
      this.yAxisIndex = 0;
      this.label = {
        show: true,
        text: "Buy",
        style: {
          color: "#fff",
          background: "#775DD0",
        },
      };
    }

    function SellAnnotation(date) {
      this.x = new Date(date).getTime();
      this.borderColor = "#999";
      this.yAxisIndex = 0;
      this.label = {
        show: true,
        text: "Sell",
        style: {
          color: "#fff",
          background: "#DD5770",
        },
      };
    }

    const updateAnnotations = () => {
      annotationList = [];

      for (const date of asset.buyDates()) {
        annotationList.push(new BuyAnnotation(date));
      }
      for (const date of asset.sellDates()) {
        annotationList.push(new SellAnnotation(date));
      }
      chart.updateOptions({
        annotations: {
          xaxis: annotationList,
        },
      });
    };

    onMounted(() => {
      const element = document.querySelector("#chart" + asset.ticker);
      if (element) {
        chart = new ApexCharts(element, options);
        // initial render of the chart
        chart.render();
        updateAnnotations();
      }
    });

    const trxCount = computed(() => asset.trxns.length);

    watch(
      () => trxCount.value,
      (count, prevCount) => {
        updateAnnotations();
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
