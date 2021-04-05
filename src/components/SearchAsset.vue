<template>
  <details :open="assets.length === 0">
    <summary>🔍 <span class="link">Search</span></summary>
    <fieldset>
      <legend>Add a new asset</legend>
      <template v-if="asset.dataload.name">
        Found:
        <h3>{{ asset.dataload.name }}</h3>
        <h5>
          {{ asset.dataload.industry }}
        </h5>
        <p>Do you want to add this asset to your portfolio?</p>
        <button type="button" value="cancel" @click="close()">Nope</button>
        <button type="button" value="yes" @click="confirm()" autofocus>
          Ok, Add it.
        </button>
      </template>
      <template v-else>
        <div>
          <small>
            Each stock has a unique identifier, called ticker. You can find
            tickers, e.g. on
            <a target="_blank" href="https://finance.yahoo.com" rel="noreferrer"
              >Yahoo Finance</a
            >.
          </small>
        </div>
        <input
          autofocus
          id="ticker"
          v-model="ticker"
          type="text"
          size="10"
          maxLength="10"
          placeholder="Asset ticker"
          aria-label="Asset ticker"
          @keyup.enter="getCompanyInfo()"
        />
        <button @click="getCompanyInfo()">
          <span v-if="searching">Searching...</span>
          <span v-else>Add</span>
        </button>
        <small>
          <p class="errors" v-if="ticker && error">
            {{ error }}
          </p>
        </small>
      </template>
    </fieldset>
  </details>
</template>

<script>
import { watch, ref, reactive, onMounted, computed } from "vue";
import { requestHandler } from "../composables/use-api";
import { assets } from "../composables/use-portfolio";
import { Asset, saveAsset, selectAsset } from "../composables/use-asset";

export default {
  setup() {
    const ticker = ref("");
    const asset = reactive(new Asset());
    const searching = ref(false);
    const error = ref("");

    watch(
      () => ticker.value,
      (ticker, prevTicker) => {
        // reset errors when the ticker is reset
        if (!ticker.value) error.value = "";
      }
    );

    const getCompanyInfo = async () => {
      if (ticker.value) {
        // check is the asset is already part of the portfolio
        if (
          assets.value.find((item) => item.ticker === ticker.value) ===
          undefined
        ) {
          searching.value = true;
          asset.ticker = ticker.value;
          await requestHandler("company", { asset: asset });
          searching.value = false;
          if (!asset.dataload.name) error.value = "Not found";
        } else error.value = "Already added";
      }
    };

    const close = () => {
      // reset the asset object
      ticker.value = "";
      Object.assign(asset, new Asset());
    };

    const confirm = () => {
      asset.id = asset.ticker;
      saveAsset(asset);
      close();
    };

    return {
      assets,
      searching,
      asset,
      ticker,
      confirm,
      close,
      getCompanyInfo,
      error,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.errors {
  color: red;
}

h3,
h5 {
  margin: 10px 0 0 10px;
}
</style>
