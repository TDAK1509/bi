<template>
  <div class="home">
    <page-title>BÁO CÁO TÀI CHÍNH</page-title>

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
    />

    <add-button @click="isShowAddModal = true" />

    <b-modal
      :active.sync="isShowAddModal"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <transaction-modal-add
        :is-adding-client="isAddingClient"
        :is-adding-transaction="isAddingTransaction"
        @add-transaction="addTransaction"
        @add-client="addClient"
        @add-seller="addSeller"
        @add-transaction-type="addTransactionType"
        @add-product-name="addProductName"
        @add-payment-type="addPaymentType"
      />
    </b-modal>

    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script lang="ts">
import TransactionDatePicker from "@/components/TransactionDatePicker.vue";
import TransactionTable from "@/components/TransactionTable.vue";
import AddButton from "@/components/AddButton.vue";
import TransactionModalAdd from "@/components/TransactionModalAdd.vue";
import PageTitle from "@/components/PageTitle.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import filtersMixin from "@/mixins/filters";
import { FilterType } from "@/models/helpers";
import {
  TransactionView,
  Transaction,
  TransactionForDebt
} from "@/models/transaction";
import { ClientView } from "@/models/client";
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/utils/date";

@Component({
  components: {
    PageTitle,
    TransactionDatePicker,
    TransactionTable,
    AddButton,
    TransactionModalAdd
  },
  mixins: [filtersMixin]
})
export default class Home extends Vue {
  isShowAddModal: boolean = false;
  isAddingClient: boolean = false;
  isAddingTransaction: boolean = false;
  isAddingSelectOption: boolean = false;

  get isLoading(): boolean {
    return (
      this.$store.state.isFetchingClients ||
      this.$store.state.isFetchingTransactions ||
      this.isAddingSelectOption
    );
  }

  get transactionsToShow(): TransactionView[] {
    return this.$store.state.transactions;
  }

  get totalAmount(): number {
    let totalAmount: number = 0;
    this.transactionsToShow.forEach(transaction => {
      totalAmount += parseInt(transaction.amount.toString());
    });
    return totalAmount;
  }

  get dateRange(): Date[] {
    return [this.$store.state.filterDateStart, this.$store.state.filterDateEnd];
  }

  set dateRange(dateRange: Date[]) {
    this.$store.commit("setFilterDateStart", dateRange[0]);
    this.$store.commit("setFilterDateEnd", dateRange[1]);
    this.$store.dispatch("fetchTransactions");
  }

  async addTransaction(transaction: Transaction | TransactionForDebt) {
    this.isAddingTransaction = true;

    if (transaction instanceof TransactionForDebt) {
      const transactionId = await this.$store.dispatch(
        "addTransaction",
        transaction.transaction
      );

      await this.$store.dispatch("updateDebt", {
        clientId: transaction.transaction.client_id,
        debtId: transaction.debtId,
        transactionId,
        amount: transaction.transaction.amount,
        transactionDate: transaction.transaction.date
      });
    } else {
      await this.$store.dispatch("addTransaction", transaction);
    }

    this.isAddingTransaction = false;

    this.$buefy.toast.open({
      message: `Thêm giao dịch thành công!`,
      type: "is-success"
    });

    this.isShowAddModal = false;
  }

  async addClient(clientName: string) {
    this.isAddingClient = true;
    await this.$store.dispatch("addClient", clientName);

    this.$buefy.toast.open({
      message: `Khách hàng ${clientName} đã được tạo!`,
      type: "is-success"
    });

    this.isAddingClient = false;
  }

  async addSeller(sellerName: string) {
    this.isAddingSelectOption = true;
    await this.$store.dispatch("addSeller", sellerName);

    this.$buefy.toast.open({
      message: `Thêm người bán thành công!`,
      type: "is-success"
    });

    this.isAddingSelectOption = false;
  }

  async addTransactionType(transactionType: string) {
    this.isAddingSelectOption = true;
    await this.$store.dispatch("addTransactionType", transactionType);

    this.$buefy.toast.open({
      message: `Thêm người bán thành công!`,
      type: "is-success"
    });

    this.isAddingSelectOption = false;
  }

  async addProductName(productName: string) {
    this.isAddingSelectOption = true;
    await this.$store.dispatch("addProductName", productName);

    this.$buefy.toast.open({
      message: `Thêm người bán thành công!`,
      type: "is-success"
    });

    this.isAddingSelectOption = false;
  }

  async addPaymentType(paymentType: string) {
    this.isAddingSelectOption = true;
    await this.$store.dispatch("addPaymentType", paymentType);

    this.$buefy.toast.open({
      message: `Thêm người bán thành công!`,
      type: "is-success"
    });

    this.isAddingSelectOption = false;
  }

  init() {
    if (this.$route.query.transaction_date) {
      const transactionDate = this.$route.query.transaction_date.toString();
      this.dateRange = [new Date(transactionDate), new Date(transactionDate)];
    } else {
      if (!this.$store.state.isFetchedTransactions) {
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
