import { ref, onMounted, watch } from "vue";
import ApexCharts from "apexcharts";

export default function usePieChart(assets) {
  const chart = ref(null);
  const renderChart = () => {
    let element = document.querySelector("#piechart");
    let options = {
      series: assets.value.map(() => 1 / assets.value.length),
      chart: {
        width: 300,
        type: "pie"
      },
      labels: assets.value.map((asset) => asset.dataload.name),
      legend: {
        position: "bottom"
      }
    };
    if (element) {
      chart.value = new ApexCharts(element, options);
      chart.value.render();
    }
  };

  onMounted(renderChart);
  watch(assets, renderChart);

  return {
    chart
  };
}
