<template>
  <details>
    <summary>⚙️ <span class="link">Settings</span></summary>
    <div>
      <fieldset>
        <legend>Backup & Restore Portfolio</legend>
        <button
          id="export"
          @click="exportData()"
          :disabled="assets.length === 0"
        >
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
        <select id="currency" v-model="settings.currency">
          <option v-for="item of currencies" :key="item">
            {{ item }}
          </option>
        </select>
        <label for="benchmark">Benchmark</label>
        <select
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
    </div>
  </details>
</template>

<script>
import { onMounted, watch, toRefs, computed } from "vue";
import {
  store,
  saveAsset,
  persistState,
} from "../composables/use-store";
import { requestHandler } from "../composables/use-api";
import { assets } from "../composables/use-portfolio";
import Asset from "../asset-class";
import { today } from "../utils";

export default {
  setup() {
    const benchmarksList = [
      { text: "S&P500", value: "SPY" },
      { text: "NASDAQ", value: "QQQ" },
      { text: "DOW JONES", value: "DIA" },
    ];

    const getFXRate = (cur, date) => {
      requestHandler("forexByDate", {
        currency: cur,
        date: date,
      });
    };

    const updateFXRates = () => {
      const appCurrency = store.settings.currency;
      let FXBase = store.exchangeRates[appCurrency];
      if (!FXBase) FXBase = {};
      // retrieve latest exchange rates for all currency combinations
      for (const item of assets.value) {
        if (item.currency !== appCurrency) {
          const hasFXPair = !!FXBase[item.currency];
          // reset the exchange rates for the currency pair
          if (!hasFXPair) {
            FXBase[item.currency] = {};
          } else {
            let FXPair = FXBase[item.currency];
            var hasFXForBuyDate = !!FXPair[item.dateBuy];
            var hasLatestFX = !!FXPair[today];
          }

          if (!hasFXForBuyDate) getFXRate(item.currency, item.dateBuy);
          if (!hasLatestFX) getFXRate(item.currency, today);
        }
      }
    };

    onMounted(() => {
      // add more currencies to the default one
      if (store.currencies.length === 1) {
        requestHandler("currencies");
      }
      //updateFXRates();
    });

    // gets executed when currency changes
    watch(
      () => store.settings.currency,
      (currency, prevCurrency) => {
        store.exchangeRates[currency] = {};
        persistState();
        updateFXRates();
      }
    );

    // gets executed when stop loss changes
    watch(
      () => store.settings.stopLoss.pct,
      (stopLoss, prevStopLoss) => {
        persistState();
      }
    );

    // gets executed when benchmark changes
    watch(
      () => store.settings.benchmark.ticker,
      (benchmark, prevBenchmark) => {
        persistState();
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
                useAPI.requestHandler("history", { asset: item });
                if (!item.isSold()) {
                  useAPI.requestHandler("quote", { asset: item });
                  useAPI.requestHandler("signal", { asset: item });
                  useAPI.requestHandler("target", { asset: item });
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
