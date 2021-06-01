import ApexCharts from "apexcharts";
import { ref, watch, onMounted } from "vue";

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

export default function useChart(asset) {
  const chart = ref(null);

  const renderChart = (options) => {
    let element = document.querySelector("#chart" + asset.ticker);
    if (element) {
      chart.value = new ApexCharts(element, options);
      chart.value.render();
    } else throw Error("No chart element with specified id found.");
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
    chart.value.updateSeries([
      {
        name: "Price",
        data: asset.prices
      }
    ]);
    chart.value.updateOptions({
      xaxis: {
        categories: asset.dates
      }
    });
  };

  return {
    renderChart,
    updateSeries,
    updateAnnotations
  };
}
