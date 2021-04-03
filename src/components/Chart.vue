<template>
  <div :id="'chart' + asset.ticker"></div>
</template>

<script>
import { computed, onMounted, watch } from "vue";
import ApexCharts from "apexcharts";
import { asset } from "../composables/use-asset";
import { requestHandler } from "../composables/use-api";

export default {
  setup() {
    let element = null;
    let annotationList = [];
    let chart = null;
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
      element = document.querySelector("#chart" + asset.ticker);
      if (element) {
        chart = new ApexCharts(element, options);
        // initial render of the chart
        chart.render();
        updateAnnotations();
      }
    });

    watch(
      () => trxCount.value,
      (count, prevCount) => {
        updateAnnotations();
        element = document.querySelector("#chart" + asset.ticker);
        const startDate =
          asset.trxns.length > 0 ? asset.firstTrxDate() : new Date();
        // get 3 months of data before the transaction date for context
        startDate.setMonth(startDate.getMonth() - 3);
        const endDate = new Date();
        // refresh chart data if necessary
        requestHandler("history", {
          asset: asset,
          start: startDate,
          end: endDate,
        }).then(function () {
          chart.updateSeries([
            {
              name: "Price",
              data: asset.prices(),
            },
          ]);
          chart.updateOptions({
            xaxis: {
              categories: asset.dates(),
            },
          });
        });
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
