<template>
  <details>
    <summary>⚙️ <span class="link">Settings</span></summary>
    <fieldset>
      <legend>Backup & Restore Portfolio</legend>
      <button id="export" @click="exportData()" :disabled="assets.length === 0">
        💾 Backup
      </button>
      <button id="import" @click="uploader()">📄 Restore</button>
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
      <select id="currency" v-model="settings.currency" disabled>
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
        v-model="settings.stopLoss.pct"
        placeholder="e.g. warn when 20% down"
      />
    </fieldset>
  </details>
</template>

<script>
import { onMounted, watch, toRefs, computed } from "vue";
import { store, persistState, assets } from "../composables/useStore";
import { Asset } from "../composables/useAsset";
import { today } from "../utils";
import useDataUpdater from "../composables/useDataUpdater";

export default {
  setup() {
    const { getFXRate, getCurrencies } = useDataUpdater();

    const benchmarksList = [
      { text: "S&P500", value: "SPY" },
      { text: "NASDAQ", value: "QQQ" },
      { text: "DOW JONES", value: "DIA" },
    ];

    onMounted(() => {
      // add more currencies to the default one
      if (store.currencies.length === 1) {
        assets.value.forEach((asset) => {
          asset.trxns.forEach((trx) => {
            getFXRate(asset.dataload.currency, today);
          });
        });
      }
    });

    // gets executed when currency changes
    watch(
      () => store.settings.currency,
      (currency, prevCurrency) => {
        // reset the exchange rates object when default currency changes
        //store.exchangeRates[currency] = {};
        //persistState();
        assets.value.forEach((asset) => {
          asset.trxns.forEach((trx) => {
            getFXRate(asset.dataload.currency, today);
            getFXRate(asset.dataload.currency, trx.date);
          });
        });
      }
    );

    return {
      benchmarksList,
      ...toRefs(store),
      assets,
    };
  },
  methods: {
    exportData: function () {
      const rows = assets.value.map((item) => {
        // remove timeseries data for better readability
        item.timeseries = null;
        return JSON.stringify(item);
      });
      let string = rows.join("\r\n");
      var a = document.createElement("a");
      a.href = "data:text/plain," + encodeURIComponent(string);
      a.target = "_blank";
      a.download = "Portfolio" + today + ".txt";
      document.body.appendChild(a);
      a.click();
    },
    uploader: function () {
      this.$refs.uploader.click();
    },
    importData: function (ev) {
      var file = ev.target.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = async function (event) {
          var fileContent = event.target.result;
          var allTextLines = fileContent.split(/\r\n|\n/);

          if (allTextLines.length >= 1) {
            store.assetList = [];
            allTextLines.forEach(function (line) {
              try {
                const json = JSON.parse(line);
                const item = new Asset(json);
                requestHandler("history", { asset: item });
                if (!item.isSold()) {
                  requestHandler("quote", { asset: item });
                  requestHandler("signal", { asset: item });
                  requestHandler("target", { asset: item });
                }
              } catch (error) {
                alert("The data is not in the correct format");
              }
            });
          } else alert("The file is empty, my friend.");
        };
        reader.readAsText(file);
      } else alert("No file found.");

      this.close();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
