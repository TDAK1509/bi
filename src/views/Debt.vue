<template>
  <div class="debt">
    <page-title>QUẢN LÝ NỢ</page-title>

    <div class="debt__transaction-filter">
      <transaction-date-picker v-model="dateRange" />

      <div class="debt__transaction-filter-total-amount">
        Tổng nợ:
        <span class="has-text-danger">{{ totalAmount | monetize }}</span>
      </div>
    </div>

    <debt-table class="debt__transaction-table" :debts="debts" />

    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script lang="ts">
import TransactionDatePicker from "@/components/TransactionDatePicker.vue";
import DebtTable from "@/components/DebtTable.vue";
import PageTitle from "@/components/PageTitle.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import filtersMixin from "@/mixins/filters";
import { TransactionView, Transaction } from "@/models/transaction";
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/utils/date";

@Component({
  components: {
    PageTitle,
    TransactionDatePicker,
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

  get dateRange(): Date[] {
    return [
      this.$store.state.debt.filterDateStart,
      this.$store.state.debt.filterDateEnd
    ];
  }

  set dateRange(dateRange: Date[]) {
    this.$store.commit("debt/setFilterDateStart", dateRange[0]);
    this.$store.commit("debt/setFilterDateEnd", dateRange[1]);
    this.$store.dispatch("debt/fetchDebts");
  }

  init() {
    if (this.$route.query.transaction_date) {
      const transactionDate = this.$route.query.transaction_date.toString();
      this.dateRange = [new Date(transactionDate), new Date(transactionDate)];
    } else {
      if (!this.$store.state.debt.isFetchedDebts) {
        this.dateRange = [getFirstDayOfMonth(), getLastDayOfMonth()];
      }
    }
  }

  mounted() {
    this.init();
  }
}
</script>

<style lang="scss" scoped>
.home {
  padding: 0 20px;
  margin-top: 30px;
}

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
