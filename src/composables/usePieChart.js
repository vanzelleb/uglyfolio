import { ref, onMounted, watch, computed } from "vue";
import ApexCharts from "apexcharts";

export default function (id, assets) {
  const chart = ref(null);
  const assetWeights = computed(() =>
    assets.value.map(() => 1 / assets.value.length)
  );
  const assetNames = computed(() =>
    assets.value.map((asset) => asset.dataload.name)
  );
  const renderChart = () => {
    const element = document.getElementById(id);
    const options = {
      series: assetWeights.value,
      labels: assetNames.value,
      chart: {
        width: "100%",
        type: "pie"
      },
      legend: {
        position: "top"
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
