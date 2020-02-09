<template>
  <div class="search">
    <page-title>
      <b-icon icon="search" />
      TÌM KIẾM GIAO DỊCH
    </page-title>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import PageTitle from "@/components/PageTitle.vue";

@Component({
  components: {
    PageTitle
  }
})
export default class Search extends Vue {}
</script>

<style lang="scss" scoped></style>
