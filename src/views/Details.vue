<template>
  <main>
    <h2>{{ asset.name }}</h2>
    <button @click="goHome()">Back</button>
    <button v-if="asset.id" @click="remove(asset)">Delete</button>
    <br />
    <Info />
    <Form />
  </main>
  <!--
      <v-alert
        v-if="asset.error"
        icon="mdi-information-outline"
        prominent
        text
        type="error"
        >{{ asset.error }}</v-alert
      >
      <v-card
        flat
        v-if="asset.id && asset.prices.length > 0"
        class="mx-2 mt-2"
        style="height: 105px"
      >
        <Sparkline
          :values="asset.prices"
          height="95"
          :kpi="asset.totalChange"
        />
      </v-card>
      <v-expansion-panels
        flat
        hover
        v-model="openPanel"
        tile
        accordion
        class="my-3"
      >
        <router-view name="info" :data="asset"></router-view>
        <router-view
          v-if="asset.prices.length > 1"
          name="news"
          :data="asset"
        ></router-view>
        <router-view name="performance" :data="asset"></router-view>
        <router-view name="payouts" :data="asset"></router-view>-->

  <!-- </v-expansion-panels>
      <v-btn
        block
        light
        text
        color="red"
        class="my-5"
        v-if="asset.id"
        @click="removeAsset(asset.id)"
        >Delete</v-btn
      >
    </div>-->
</template>

<script>
import { asset, removeAsset } from "../composables/use-store";
import Form from "../components/Form.vue";
import Info from "../components/Info.vue";
import Portfolio from "../components/Portfolio.vue";
import { useRouter } from "vue-router";

export default {
  components: {
    Info,
    Form,
    Portfolio,
  },
  setup() {
    const router = useRouter();

    const goHome = () => {
      router.push("/");
    };

    const remove = (asset) => {
      if (confirm("Are you sure you want delete it?")) {
        removeAsset(asset);
        goHome();
      }
    };

    return { asset, goHome, remove };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
