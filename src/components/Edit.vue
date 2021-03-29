<template>
  <fieldset>
    <legend>Buy transactions</legend>
    You own {{ asset.totalSharesBought() }} shares.
    <br />
    <details v-for="(trx, id) of asset.buys()" :key="`buy-${id}`">
      <summary class="link">
        {{ trx.date }}: {{ toLocaleNumber(trx.value, 2) }} {{ appCurrency }}
      </summary>
      <Buy :trx="trx" :id="id" />
    </details>
    <details>
      <summary class="link">Add new buy transactions</summary>
      <Buy :trx="newTrx()" />
    </details>
  </fieldset>
  <fieldset>
    <legend>Sell transactions</legend>
    You sold {{ asset.totalSharesBought() }} shares.
    <br />
    <details v-for="(trx, id) of asset.sells()" :key="`sell-${id}`">
      <summary class="link">
        {{ trx.date }}: {{ toLocaleNumber(trx.value, 2) }} {{ appCurrency }}
      </summary>
      <Sell :trx="trx" :id="id" />
    </details>
    <details>
      <summary class="link">Add new sell transactions</summary>
      <Sell :trx="newTrx()" />
    </details>
  </fieldset>

  <div style="display: flex; justify-content: space-between">
    <button v-if="asset.id" @click="remove(asset)">❌ Delete</button>
    <button @click="close()">🏠 Home</button>
  </div>
</template>

<script>
import { computed, reactive, ref, watch } from "vue";
import Buy from "./Buy.vue";
import Sell from "./Sell.vue";
import { toLocaleNumber } from "../utils";
import {
  store,
  asset,
  selectAsset,
  removeAsset,
} from "../composables/use-store";

export default {
  components: {
    Buy,
    Sell,
  },
  setup() {
    const errors = ref([]);

    function Trx() {
      this.type = null;
      this.value = null;
      this.amount = null;
      this.price = null;
    }

    const newTrx = () => {
      let trx = new Trx();
      trx = {
        ...trx,
        // add getter and setter for date to offset timezone differences
        get date() {
          if (this._date) return this._date.toISOString().substring(0, 10);
          else return null;
        },

        set date(date) {
          if (date) {
            let dt = new Date(date);
            this._date = new Date(
              dt.getTime() - dt.getTimezoneOffset() * 60000
            );
          } else this._date = null;
        },
      };
      return trx;
    };

    const remove = (asset) => {
      if (confirm("Are you sure you want delete this asset?")) {
        removeAsset(asset);
        close();
      }
    };

    const close = () => {
      // clear global asset variable in order to return to home screen
      selectAsset();
    };

    return {
      newTrx,
      remove,
      close,
      asset,
      toLocaleNumber,
      appCurrency: store.settings.currency,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
</style>
