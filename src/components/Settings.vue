<template>
  <details>
    <summary>⚙️ <span class="link">Settings</span></summary>
    <fieldset>
      <legend>Backup & Restore Portfolio</legend>
      <button id="export" @click="exportData()" :disabled="assets.length === 0">
        💾 Backup
      </button>
      <button id="import" @click="$refs.uploader.click()">📄 Restore</button>
      <input
        type="file"
        @change="importData($event)"
        ref="uploader"
        style="display: none"
      />
    </fieldset>
    <fieldset>
      <legend>Customize</legend>
      <label for="currency">Display currency</label>
      <select id="currency" v-model="appCurrency" disabled>
        <option v-for="item of currencies" :key="item">
          {{ item }}
        </option>
      </select>
      <label for="benchmark">Benchmark</label>
      <select
        disabled
        id="benchmark"
        @change="settings.benchmark.ticker = $event.target.value"
      >
        <option
          v-for="item in benchmarksList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.text }}
        </option>
      </select>

      <label for="stoploss">Stop Loss warning (in %)</label>
      <input
        id="stoploss"
        type="number"
        min="0"
        max="99"
        v-model.number="stopLossPct"
        placeholder="0"
      />
    </fieldset>
  </details>
</template>

<script setup>
import { ref, onMounted, watch, toRefs, computed } from "vue";
import { Asset, assets, saveAsset } from "../modules/asset";
import { store } from "../modules/store";
import { stopLossPct } from "../modules/stopLoss";
import { currencies, appCurrency } from "../modules/currencies";
import { today } from "../modules/utils";

const benchmarksList = [
  { text: "S&P500", value: "SPY" },
  { text: "NASDAQ", value: "QQQ" },
  { text: "DOW JONES", value: "DIA" },
];

const exportData = () => {
  // remove timeseries data for better readability of the exported file
  const rows = assets.value.map((item) => {
    item.timeseries = null;
    return JSON.stringify(item);
  });
  let string = rows.join("\r\n");
  var a = document.createElement("a");
  a.href = "data:text/plain," + encodeURIComponent(string);
  a.target = "_blank";
  a.download = "Portfolio" + today + ".json";
  document.body.appendChild(a);
  a.click();
};

const importData = (e) => {
  var file = e.target.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = async (event) => {
      var fileContent = event.target.result;
      var allTextLines = fileContent.split(/\r\n|\n/);

      if (allTextLines.length >= 1) {
        store.assetList = [];
        allTextLines.forEach((line) => {
          try {
            const json = JSON.parse(line);
            const item = new Asset(json);
            saveAsset(item);
          } catch (error) {
            alert("The data is not in the correct format");
          }
        });
      } else alert("The file is empty, my friend.");
    };
    reader.readAsText(file);
  } else alert("No file found.");
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
