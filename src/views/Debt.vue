<template>
  <div class="debt">
    <page-title>QUẢN LÝ NỢ</page-title>

    <div class="debt__transaction-filter">
      <date-picker v-model="dateRange" />

      <div class="debt__transaction-filter-total-amount">
        Tổng nợ:
        <span class="has-text-danger">{{ totalAmount | monetize }}</span>
      </div>
    </div>

    <debt-table
      class="debt__transaction-table"
      :debts="debts"
      :is-admin="isAdmin"
    />

    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script lang="ts">
import DatePicker from "@/components/DatePicker.vue";
import DebtTable from "@/components/DebtTable.vue";
import PageTitle from "@/components/PageTitle.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import filtersMixin from "@/mixins/filters";
import { TransactionView, Transaction } from "@/models/transaction";
import {
  formatDateToString,
  getFirstDayOfMonth,
  getLastDayOfMonth
} from "@/utils/date";

@Component({
  components: {
    PageTitle,
    DatePicker,
    DebtTable
  },
  mixins: [filtersMixin]
})
export default class Debt extends Vue {
  get isLoading(): boolean {
    return (
      this.$store.state.debt.isFetchingDebts ||
      this.$store.state.debt.isUpdatingDebt
    );
  }

  get isAdmin(): boolean {
    return this.$store.state.auth.isAdmin;
  }

  get debts(): TransactionView[] {
    return this.$store.state.debt.debts;
  }

  get totalAmount(): number {
    let totalAmount: number = 0;
    this.debts.forEach(transaction => {
      totalAmount += parseInt(transaction.amount.toString());
    });
    return totalAmount;
  }

  get startDate(): string {
    return this.$store.state.debt.startDate;
  }

  get endDate(): string {
    return this.$store.state.debt.endDate;
  }

  get dateRange(): Date[] {
    return [new Date(this.startDate), new Date(this.endDate)];
  }

  set dateRange(dateRange: Date[]) {
    this.$store.commit("debt/setStartDate", formatDateToString(dateRange[0]));
    this.$store.commit("debt/setEndDate", formatDateToString(dateRange[1]));
    this.$store.dispatch("debt/fetchDebts");
  }

  searchDebt() {
    let startDate: string;
    let endDate: string;
    if (this.$route.query.start_date && this.$route.query.end_date) {
      startDate = this.$route.query.start_date as string;
      endDate = this.$route.query.end_date as string;
    } else {
      startDate = formatDateToString(getFirstDayOfMonth());
      endDate = formatDateToString(getLastDayOfMonth());
    }

    this.dateRange = [new Date(startDate), new Date(endDate)];
  }

  mounted() {
    this.searchDebt();
  }
}
</script>

<style lang="scss" scoped>
.debt__transaction-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.debt__transaction-filter-total-amount {
  display: inline-block;
  padding: 10px 30px;
  margin-right: 0px;
  font-size: 1.2rem;
  font-weight: bold;
}

.debt__transaction-table {
  margin-top: 20px;
}
</style>
