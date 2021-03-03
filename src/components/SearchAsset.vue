<template>
  <fieldset>
    <legend>Add new asset</legend>
    <input
      id="ticker"
      checked
      v-model="ticker"
      type="text"
      maxLength="10"
      placeholder="Asset ticker/symbol"
    />
    <button @click="getCompanyInfo()">🔍 Search</button>
    <small>
      <p v-if="ticker && error" style="color: red">
        {{ error }}
      </p>
    </small>
    <div>
      <small>
        Each stock has a unique identifier, called ticker. You can search
        tickers, e.g. on
        <a target="_blank" href="https://finance.yahoo.com" rel="noreferrer"
          >Yahoo Finance</a
        >.
      </small>
    </div>
  </fieldset>

  <dialog id="dialog">
    <form method="dialog">
      <h3>Found {{ asset.name }}</h3>
      <h5>
        {{ asset.industry }}
      </h5>
      <p>Do you want to add this asset to your portfolio?</p>
      <button type="button" value="cancel" @click="cancel()">Cancel</button>
      <button type="button" value="yes" @click="confirm()">Yes</button>
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
      useAPI.error.value = "";
      if (ticker.value) {
        asset.ticker = ticker.value;
        await useAPI.requestHandler("company", { asset: asset });
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
</style>
