<template>
  <div class="home">
    <page-title>DOANH THU</page-title>

    <div class="home__transaction-filter">
      <transaction-date-picker v-model="dateRange" />

      <div class="home__transaction-filter-total-amount">
        Tổng tiền:
        <span class="has-text-danger">{{ totalAmount | monetize }}</span>
      </div>
    </div>

    <transaction-table
      class="home__transaction-table"
      :transactions="transactionsToShow"
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
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/utils/date";

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

  get isLoading(): boolean {
    return (
      this.$store.state.transaction.isFetchingTransactions ||
      this.$store.state.options.isAddingOption ||
      this.$store.state.transaction.isDeletingTransaction
    );
  }

  get transactionsToShow(): TransactionView[] {
    return this.$store.state.transaction.transactions;
  }

  get totalAmount(): number {
    let totalAmount: number = 0;
    this.transactionsToShow.forEach(transaction => {
      totalAmount += parseInt(transaction.amount.toString());
    });
    return totalAmount;
  }

  get dateRange(): Date[] {
    return [
      this.$store.state.transaction.filterDateStart,
      this.$store.state.transaction.filterDateEnd
    ];
  }

  set dateRange(dateRange: Date[]) {
    this.$store.commit("transaction/setFilterDateStart", dateRange[0]);
    this.$store.commit("transaction/setFilterDateEnd", dateRange[1]);
    this.$store.dispatch("transaction/fetchTransactions");
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

    if (
      !query.hasOwnProperty("field") ||
      !query.hasOwnProperty("value") ||
      !query.hasOwnProperty("operator") ||
      !query.hasOwnProperty("start_date") ||
      !query.hasOwnProperty("end_date")
    ) {
      return;
    }

    // do search
  }

  init() {
    if (this.$route.query.transaction_date) {
      const transactionDate = this.$route.query.transaction_date.toString();
      this.dateRange = [new Date(transactionDate), new Date(transactionDate)];
    } else {
      if (!this.$store.state.transaction.isFetchedTransactions) {
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
.home__transaction-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.home__transaction-filter-total-amount {
  display: inline-block;
  padding: 10px 30px;
  margin-right: 0px;
  font-size: 1.2rem;
  font-weight: bold;
}

.home__transaction-table {
  margin-top: 20px;
}
</style>
