<template>
  <div class="transition-filter-content">
    <template v-if="!isFilterAll">
      <b-button type="is-white" icon-right="chevron-left" @click="previous" />
      <span class="transition-filter-content__text">{{ filterText }}</span>
      <b-button type="is-white" icon-right="chevron-right" @click="next" />
    </template>

    <div v-else>Tất cả</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model, Emit } from "vue-property-decorator";
import { FilterType } from "@/models/transaction";

@Component
export default class TransactionFilterContent extends Vue {
  @Model("input", { type: Number, required: true })
  filterValue!: number;

  @Prop({ type: String, default: "month" })
  filterType!: FilterType;

  get isFilterAll(): boolean {
    return this.filterType === "all";
  }

  get filterText(): string {
    return this.convertValueToText(this.filterValue);
  }

  convertValueToText(filterValue: number): string {
    if (this.filterType === "month") {
      return "Tháng " + (filterValue + 1);
    } else {
      return "Năm " + filterValue;
    }
  }

  @Emit("input")
  previous() {
    return this.filterValue === 0 ? 11 : this.filterValue - 1;
  }

  @Emit("input")
  next() {
    return this.filterValue === 11 ? 0 : this.filterValue + 1;
  }
}
</script>

<style lang="scss" scoped>
.transition-filter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transition-filter-content__text {
  margin: 0 30px;
}
</style>
