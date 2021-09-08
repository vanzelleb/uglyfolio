<template>
  <details :open="assets.length === 0">
    <summary role="button">🔍 <span class="link">Add an asset</span></summary>
    <fieldset>
      <template v-if="asset.dataload.name">
        <h3>{{ asset.dataload.name }}</h3>
        <h5>
          {{ asset.dataload.industry }}
        </h5>
        <p>Do you want to add this asset to your portfolio?</p>
        <button type="button" value="yes" @click="confirm()" autofocus>
          Ok, add it.
        </button>
        <button type="button" value="cancel" @click="close()">Nope</button>
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
          <span v-else>Search</span>
        </button>
        <small>
          <p class="errors" v-if="ticker && warning">
            {{ warning }}
          </p>
        </small>
      </template>
    </fieldset>
  </details>
</template>

<script setup>
import { watch, ref, reactive, onMounted, computed } from "vue";
import { Asset, saveAsset, assets } from "../modules/asset";
import { today } from "../modules/utils";
import useCompanyApi from "../composables/useCompanyApi";

const ticker = ref("");
const asset = reactive(new Asset());
const searching = ref(false);
const warning = ref("");
const { getCompany } = useCompanyApi(asset);

// reset errors when the ticker changes
watch(ticker, () => {
  warning.value = "";
});

const getCompanyInfo = async () => {
  if (ticker.value) {
    // check is the asset is already part of the portfolio
    if (
      assets.value.find(
        (item) => item.ticker === ticker.value.toUpperCase()
      ) === undefined
    ) {
      searching.value = true;
      asset.ticker = ticker.value;
      await getCompany();
      searching.value = false;
      if (!asset.dataload.name) warning.value = "Not found";
    } else warning.value = "Already added";
  }
};

// reset the form and asset object
const close = () => {
  ticker.value = "";
  Object.assign(asset, new Asset());
};

// save a copy of the local asset object to avoid side effects
const confirm = () => {
  asset.id = asset.ticker;
  saveAsset(new Asset(asset));
  close();
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.errors {
  color: red;
}

h3,
h5 {
  margin: 6px 0 0 0px;
  color: #7d13a9;
}
</style>
