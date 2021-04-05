import { requestHandler } from "./use-api";

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

export default function useChart(chart, asset) {
  const updateAnnotations = () => {
    const annotationList = [];

    for (const date of asset.buyDates()) {
      annotationList.push(new BuyAnnotation(date));
    }
    for (const date of asset.sellDates()) {
      annotationList.push(new SellAnnotation(date));
    }
    chart.updateOptions({
      annotations: {
        xaxis: annotationList
      }
    });
  };

  const updateSeries = () => {
    const startDate =
      asset.trxns.length > 0 ? asset.firstTrxDate() : new Date();
    // get 3 months of data before the transaction date for context
    startDate.setMonth(startDate.getMonth() - 3);
    const endDate = new Date();
    // refresh chart data if necessary
    requestHandler("history", {
      asset: asset,
      start: startDate,
      end: endDate
    }).then(function () {
      chart.updateSeries([
        {
          name: "Price",
          data: asset.prices()
        }
      ]);
      chart.updateOptions({
        xaxis: {
          categories: asset.dates()
        }
      });
    });
  };

  return { updateAnnotations, updateSeries };
}
