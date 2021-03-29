<template>
  <details :open="assets.length === 0">
    <summary>🔍 <span class="link">Search</span></summary>
    <fieldset>
      <legend>Add a new asset</legend>
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
    </fieldset>
  </details>

  <dialog id="dialog">
    <form method="dialog">
      <h3>Found {{ asset.name }}</h3>
      <h5>
        {{ asset.industry }}
      </h5>
      <br />
      <p>Do you want to add this asset to your portfolio?</p>
      <button type="button" value="cancel" @click="close()">Nope</button>
      <button type="button" value="yes" @click="confirm()" autofocus>
        Ok, Add it.
      </button>
    </form>
  </dialog>
</template>

<script>
import { watch, ref, reactive, onMounted, computed } from "vue";
import { requestHandler, error } from "../composables/use-api";
import { assets } from "../composables/use-portfolio";
import { saveAsset } from "../composables/use-store";
import Asset from "../asset-class";

export default {
  setup() {
    const ticker = ref("");
    const asset = reactive(new Asset());
    const searching = ref(false);
    let modal = null;

    onMounted(() => {
      modal = document.getElementById("dialog");
    });

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
          if (asset.name) modal.showModal();
        } else alert("Asset already added.");
      }
    };

    const close = () => {
      // reset the ticker field
      ticker.value = "";
      modal.close();
    };

    const confirm = () => {
      asset.id = asset.ticker;
      saveAsset(asset);
      close();
    };

    return {
      assets,
      searching,
      modal,
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
  margin: 0 0 10px 0;
  color: red;
}
</style>
