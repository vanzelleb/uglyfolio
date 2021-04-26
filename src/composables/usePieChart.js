import { ref, onMounted, watch, computed } from "vue";
import ApexCharts from "apexcharts";

export default function usePieChart(assets) {
  const chart = ref(null);
  const assetWeights = computed(() =>
    assets.value.map(() => 1 / assets.value.length)
  );
  const assetNames = computed(() =>
    assets.value.map((asset) => asset.dataload.name)
  );
  const renderChart = () => {
    const element = document.querySelector("#piechart");
    const options = {
      series: assetWeights.value,
      chart: {
        width: 300,
        type: "pie"
      },
      labels: assetNames.value,
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
  watch(assetWeights, renderChart);

  return {
    chart
  };
}
