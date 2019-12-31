<template>
  <b-field class="transaction-date-picker" label="Thời gian giao dịch">
    <b-datepicker
      class="transaction-date-picker__date-picker"
      :value="dateRange"
      @input="onSelectDate"
      range
      nearby-selectable-month-days
      :date-formatter="formatDateToString"
    />
  </b-field>
</template>

<script lang="ts">
import { Component, Vue, Emit, Model } from "vue-property-decorator";
import { formatDateToString } from "@/utils/date";

@Component
export default class TransactionDatePicker extends Vue {
  @Model("input", { type: Array, required: true })
  dateRange!: Date[];

  @Emit("input")
  onSelectDate(dateRange: Date[]) {}

  formatDateToString(dateRange: Date[]): string {
    if (dateRange.length !== 2) {
      return "";
    }
    const startDate = formatDateToString(dateRange[0]);
    const endDate = formatDateToString(dateRange[1]);
    return `${startDate} -- ${endDate}`;
  }
}
</script>

<style lang="scss" scoped>
.transaction-date-picker__date-picker {
  width: 210px;
}
</style>
