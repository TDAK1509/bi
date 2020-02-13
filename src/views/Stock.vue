<template>
  <div class="stock">
    <page-title>QUẢN LÝ KHO</page-title>

    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import AddButton from "@/components/AddButton.vue";
import PageTitle from "@/components/PageTitle.vue";
import ErrorHandling from "@/mixins/errorHandling";

@Component({
  components: {
    PageTitle,
    AddButton
  }
})
export default class Stock extends Mixins(ErrorHandling) {
  get isLoading(): boolean {
    return this.$store.state.cost.isFetchingCosts;
  }
}
</script>

<style langg="scss" scoped></style>
