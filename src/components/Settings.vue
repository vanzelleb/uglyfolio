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
      <br />
      <fieldset>
        <legend>Customize</legend>
        <label for="currency">Display currency</label>
        <select
          id="currency"
          :value="settings.currency"
          interface="popover"
          @change="settings.currency = $event.target.value"
        >
          <option v-for="item of currencies" :value="item" :key="item">
            {{ item }}
          </option>
        </select>
        <label for="benchmark">Benchmark</label>
        <select
          id="benchmark"
          interface="popover"
          v-model="settings.benchmark._ticker"
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
    <!--

      <v-subheader>About</v-subheader>
      <div class="caption mb-5 px-2">
        A not-so-serious prototype for tracking the performance of your stock
        portfolio.
        <a
          href="https://iexcloud.io"
        >Data provided by IEX Cloud</a>
        and
        <a href="https://finnhub.io/">Finnhub.io</a>
        <P/>
        <div class="font-weight-medium">
          Made by
          <a href="https://twitter.com/VanZelleb" target="_blank">VanZelleb</a>
          &nbsp;
          <v-icon>mdi-twitter</v-icon>
        </div>
        <div>Follow design evolution
          <v-btn icon href="https://www.instagram.com/pollofolio" target="_blank">
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
        </div>
      </div>
    </v-list>
  </v-navigation-drawer>-->
  </details>
</template>

<script>
import { onMounted, watch, toRefs, computed } from "vue";
import {
  store,
  assets,
  saveAsset,
  persistState,
} from "../composables/use-store";
import { useAPI } from "../composables/use-api";
import Asset from "../asset-class";
import { today } from "../utils";

export default {
  setup() {
    const benchmarksList = [
      { text: "S&P500", value: "SPY" },
      { text: "NASDAQ", value: "QQQ" },
      { text: "DOW JONES", value: "DIA" },
    ];

    const updateFXRates = () => {
      const FXbase = store.settings.currency;
      // retrieve latest exchange rates for all currency combinations
      for (const item of assets.value) {
        if (item.currency && item.currency !== FXbase) {
          let hasFXForBuyDate = false;
          let hasLatestFX = false;
          const hasCurrencyPair = store.exchangeRates[FXbase].hasOwnProperty(
            item.currency
          );

          if (!hasCurrencyPair) store.exchangeRates[FXbase][item.currency] = {};
          let currencyPair = store.exchangeRates[FXbase][item.currency];

          hasFXForBuyDate = currencyPair.hasOwnProperty(item.dateBuy);
          hasLatestFX = currencyPair.hasOwnProperty(today);

          if (!hasFXForBuyDate)
            useAPI.requestHandler("forexByDate", {
              currency: item.currency,
              date: item.dateBuy,
            });

          if (!hasLatestFX)
            useAPI.requestHandler("forexByDate", {
              currency: item.currency,
              date: today,
            });
        }
      }
    };

    onMounted(() => {
      // add more currencies to the default one
      if (store.currencies.length === 1) {
        useAPI.requestHandler("currencies");
      }
      updateFXRates();
    });

    watch(
      () => store.settings.currency,
      (currency, prevCurrency) => {
        // gets executed when store.settings.currency changes
        console.log("change in currency detected");
        const base = currency;
        // check if exchange rates have been initialized for this base
        //if (!store.exchangeRates.hasOwnProperty(base)) {
        //console.log("Set up new currency base");
        // reset to current base currency
        //store.exchangeRates = {};
        store.exchangeRates[base] = {};
        //}
        persistState();
        updateFXRates();
      }
    );

    return {
      benchmarksList,
      ...toRefs(store),
      assets,
    };
  },
  watch: {
    "store.settings.stopLoss.pct": function () {
      // commit required in order to save the new stop loss limit to the browser storage
      persistState();
    },
    "store.settings.currency": function () {
      persistState();
    },
    "store.settings.taxes": function () {},
    "store.settings.benchmark._ticker": function () {
      persistState();
    },
  },
  methods: {
    exportData: function () {
      const rows = assets.map(function (item) {
        item._timeseries = {};
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
                const asset = new Asset(json);
                if (asset.name) saveAsset(asset);
              } catch (error) {
                alert("The data is not in the correct format");
              }
            });

            useAPI.updateAssets();
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
