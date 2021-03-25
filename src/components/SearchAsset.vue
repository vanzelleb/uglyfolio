<template>
  <div class="searchArea">
    <h3>Add a new asset</h3>
    <div>
      <small>
        Each stock has a unique identifier, called ticker. You can search
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
      size="15"
      maxLength="10"
      placeholder="Asset ticker/symbol"
      aria-label="Asset ticker/symbol"
    />
    <button @click="getCompanyInfo()">
      <span v-if="searching">Searching...</span>
      <span v-else>🔍 Search</span>
    </button>
    <small>
      <p v-if="ticker && error" style="color: red">
        {{ error }}
      </p>
    </small>
  </div>

  <dialog id="dialog">
    <form method="dialog">
      <h3>Found {{ asset.name }}</h3>
      <h5>
        {{ asset.industry }}
      </h5>
      <br />
      <p>Do you want to add this asset to your portfolio?</p>
      <button type="button" value="cancel" @click="cancel()">Nope</button>
      <button type="button" value="yes" @click="confirm()">Ok, Add it.</button>
    </form>
  </dialog>
</template>

<script>
import { watch, ref, reactive, onMounted } from "vue";
import { useAPI } from "../composables/use-api";
import { setAsset } from "../composables/use-store";
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
        if (!ticker.value) useAPI.error.value = "";
      }
    );

    const getCompanyInfo = async () => {
      if (ticker.value) {
        searching.value = true;
        asset.ticker = ticker.value;
        await useAPI.requestHandler("company", { asset: asset });
        searching.value = false;
        if (asset.name) modal.showModal();
      }
    };

    const cancel = () => {
      // reset the ticker field
      ticker.value = "";
      modal.close();
    };

    const confirm = () => {
      // reset the variables
      setAsset(asset);
      modal.close();
    };

    return {
      searching,
      modal,
      asset,
      ticker,
      confirm,
      cancel,
      getCompanyInfo,
      error: useAPI.error,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.searchArea {
  margin: 25px 0;
}

p {
  margin: 0 0 10px 0;
}
</style>
