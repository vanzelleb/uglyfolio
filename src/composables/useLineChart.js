import ApexCharts from "apexcharts";
import { ref, watch } from "vue";
import { stopLossLimit } from "../modules/stopLoss";

function xAxisAnnotation(text, date) {
  return {
    x: new Date(date).getTime(),
    borderColor: "#999",
    yAxisIndex: 0,
    label: {
      show: true,
      text: text,
      style: {
        color: "#fff",
        background: text === "Buy" ? "#775DD0" : "#DD5770"
      }
    }
  };
}

function yAxisAnnotation(text, price) {
  return {
    y: price,
    borderColor: "#FF0000",
    label: {
      borderColor: "#FFFFFF",
      style: {
        color: "#fff",
        background: "#FF0000"
      },
      text: text
    }
  };
}

export default function (asset) {
  const chart = ref(null);

  const renderChart = (options) => {
    let element = document.querySelector("#chart" + asset.ticker);
    if (element) {
      chart.value = new ApexCharts(element, options);
      chart.value.render();
    } else throw Error("No chart element with specified id found.");
  };

  const updateAnnotations = () => {
    const xAnnotationList = [];
    const yAnnotationList = [];

    asset.trxns.forEach((trx) =>
      xAnnotationList.push(new xAxisAnnotation(trx.type, trx.date))
    );

    if (stopLossLimit(asset))
      yAnnotationList.push(yAxisAnnotation("StopLoss", stopLossLimit(asset)));

    chart.value.updateOptions({
      annotations: {
        xaxis: xAnnotationList,
        yaxis: yAnnotationList
      }
    });
  };

  const updateSeries = () => {
    console.log("useLineChart: updating chart series with new price info.");
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
