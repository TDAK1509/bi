<template>
  <div class="home">
    <page-title>DOANH THU</page-title>

    <div class="home__transaction-filter">
      <div class="home__transaction-time">
        {{ dateRange }}
      </div>

      <div class="home__transaction-total">
        <p class="home__transaction-total-item home__transaction-income">
          <span class="home__transaction-total-text">Doanh thu</span>
          <span>{{ totalIncome | monetize }}</span>
        </p>

        <p class="home__transaction-total-item home__transaction-cost">
          <span class="home__transaction-total-text">Chi phí</span>
          <span>{{ totalCost | monetize }}</span>
        </p>

        <p
          class="home__transaction-total-item home__transaction-net-income has-text-danger"
        >
          <span class="home__transaction-total-text">Lợi nhuận</span>
          <span>{{ (totalIncome - totalCost) | monetize }}</span>
        </p>
      </div>
    </div>

    <transaction-table
      class="home__transaction-table"
      :transactions="transactionsToShow"
      :is-admin="isAdmin"
      @delete="openDeleteConfirm"
    />

    <add-button @click="isShowAddModal = true" />

    <b-modal
      :active.sync="isShowAddModal"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <transaction-modal-add @add-transaction-done="onAddTransactionDone" />
    </b-modal>

    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script lang="ts">
import TransactionDatePicker from "@/components/TransactionDatePicker.vue";
import TransactionTable from "@/components/TransactionTable.vue";
import AddButton from "@/components/AddButton.vue";
import TransactionModalAdd from "@/views/TransactionModalAdd.vue";
import PageTitle from "@/components/PageTitle.vue";
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";
import Filters from "@/mixins/filters";
import ErrorHandling from "@/mixins/errorHandling";
import { FilterType } from "@/models/helpers";
import { TransactionView, Transaction } from "@/models/transaction";
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  formatDateToString
} from "@/utils/date";
import { CostView } from "@/models/cost";

@Component({
  components: {
    PageTitle,
    TransactionDatePicker,
    TransactionTable,
    AddButton,
    TransactionModalAdd
  }
})
export default class Home extends Mixins(ErrorHandling, Filters) {
  isShowAddModal: boolean = false;

  get startDate(): string {
    return this.$store.state.transaction.startDate;
  }

  get endDate(): string {
    return this.$store.state.transaction.endDate;
  }

  get dateRange(): string {
    return `Từ ${this.startDate} đến ${this.endDate}`;
  }

  get isLoading(): boolean {
    return (
      this.$store.state.transaction.isFetchingTransactions ||
      this.$store.state.cost.isFetchingCosts ||
      this.$store.state.options.isAddingOption ||
      this.$store.state.transaction.isDeletingTransaction
    );
  }

  get isAdmin(): boolean {
    return this.$store.state.auth.isAdmin;
  }

  get transactionsToShow(): TransactionView[] {
    return this.$store.state.transaction.transactions;
  }

  get costs(): CostView[] {
    return this.$store.state.cost.costs;
  }

  get totalIncome(): number {
    let totalIncome: number = 0;
    this.transactionsToShow.forEach(transaction => {
      totalIncome += parseInt(transaction.amount.toString());
    });
    return totalIncome;
  }

  get totalCost(): number {
    if (this.costs.length <= 0) return 0;

    const costAmounts: number[] = this.costs.map(
      (cost: CostView) => cost.amount
    );
    let totalCost = 0;

    return costAmounts.reduce(
      (totalCost, costAmount: number) => totalCost + costAmount
    );
  }

  openDeleteConfirm(transactionId: string) {
    this.$buefy.dialog.confirm({
      title: "Xóa Giao Dịch",
      message:
        "Bạn có chắc là muốn <strong>xóa giao dịch</strong> này?<br />Hạ thủ bất hoàn!",
      cancelText: "Em nhầm",
      confirmText: "Chắc chắn",
      type: "is-danger",
      hasIcon: true,
      onConfirm: () => this.onDelete(transactionId)
    });
  }

  async onDelete(transactionId: string) {
    const response = await this.$store.dispatch(
      "transaction/deleteTransaction",
      transactionId
    );
    if (response) {
      this.toastSuccess(`Xóa giao dịch thành công!`);
    } else {
      this.toastError(`Đã có lỗi xảy ra! Vui lòng thử lại sau`);
    }
  }

  onAddTransactionDone() {
    this.isShowAddModal = false;
  }

  searchTransactionsByQuery() {
    const query = this.$route.query;
    let startDate: string;
    let endDate: string;

    if (query.start_date && query.end_date) {
      startDate = query.start_date as string;
      endDate = query.end_date as string;
    } else if (
      this.$store.state.transaction.startDate &&
      this.$store.state.transaction.endDate
    ) {
      startDate = this.$store.state.transaction.startDate;
      endDate = this.$store.state.transaction.endDate;
    } else {
      startDate = formatDateToString(getFirstDayOfMonth());
      endDate = formatDateToString(getLastDayOfMonth());
    }

    this.$store.dispatch("transaction/fetchTransactions", {
      start_date: startDate,
      end_date: endDate
    });
  }

  async searchCostsByQuery() {
    await this.$store.dispatch("cost/fetchCosts", {
      start_date: this.startDate,
      end_date: this.endDate
    });
  }

  async init() {
    this.searchTransactionsByQuery();
    await this.searchCostsByQuery();
  }

  mounted() {
    this.init();
  }
}
</script>

<style lang="scss" scoped>
.home__transaction-filter {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.home__transaction-total {
  margin-right: 0px;
  font-size: 1rem;
  font-weight: 700;
}

.home__transaction-total-item {
  display: flex;
  justify-content: space-between;

  &:not(:last-child) {
    margin-bottom: 5px;
  }
}

.home__transaction-total-text {
  margin-right: 15px;
}

.home__transaction-net-income {
  border-top: 1px solid #8d8d8d;
  margin-top: 5px;
  padding-top: 5px;
}

.home__transaction-table {
  margin-top: 20px;
}
</style>
