import ApexCharts from "apexcharts";
import { ref, onMounted } from "vue";
import { requestHandler } from "../composables/use-api";

function BuyAnnotation(date) {
  this.x = new Date(date).getTime();
  this.borderColor = "#999";
  this.yAxisIndex = 0;
  this.label = {
    show: true,
    text: "Buy",
    style: {
      color: "#fff",
      background: "#775DD0"
    }
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
      background: "#DD5770"
    }
  };
}

export default function useChart(asset, options) {
  const chart = ref(null);
  const renderChart = () => {
    let element = document.querySelector("#chart" + asset.ticker);
    if (element) {
      chart.value = new ApexCharts(element, options);
      chart.value.render();
    }
  };

  const updateAnnotations = () => {
    const annotationList = [];

    for (const date of asset.buyDates())
      annotationList.push(new BuyAnnotation(date));

    for (const date of asset.sellDates())
      annotationList.push(new SellAnnotation(date));

    chart.value.updateOptions({
      annotations: {
        xaxis: annotationList
      }
    });
  };

  const updateSeries = () => {
    console.log("Updating chart series...");
    const startDate =
      asset.trxns.length > 0 ? asset.firstTrxDate() : new Date();
    // get 3 years of data before the transaction date for context
    startDate.setFullYear(startDate.getFullYear() - 3);
    const endDate = new Date();
    // refresh chart data if necessary
    requestHandler("history", {
      asset: asset,
      start: startDate,
      end: endDate
    }).then(function () {
      chart.value.updateSeries([
        {
          name: "Price",
          data: asset.prices()
        }
      ]);
      chart.value.updateOptions({
        xaxis: {
          categories: asset.dates()
        }
      });
    });
  };

  onMounted(renderChart);

  return {
    chart,
    updateSeries,
    updateAnnotations
  };
}
