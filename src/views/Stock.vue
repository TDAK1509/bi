<template>
  <div class="stock">
    <page-title>QUẢN LÝ KHO</page-title>

    <div class="stock__product-container">
      <b-field
        v-for="(product, index) in productList"
        :key="index + '-' + product.name"
      >
        <span>{{ product.name }}</span>
        <b-numberinput :value="product.stock"></b-numberinput>
      </b-field>
    </div>

    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import PageTitle from "@/components/PageTitle.vue";
import ErrorHandling from "@/mixins/errorHandling";
import Options from "@/mixins/options";

@Component({
  components: {
    PageTitle
  }
})
export default class Stock extends Mixins(ErrorHandling, Options) {
  get isLoading(): boolean {
    return this.$store.state.cost.isFetchingCosts;
  }

  mounted() {
    if (!this.$store.state.options.isFetchedOptions) {
      this.$store.dispatch("options/fetchOptions");
    }
  }
}
</script>

<style langg="scss" scoped></style>
