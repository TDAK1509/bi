<template>
  <div class="home">
    <page-title>BÁO CÁO TÀI CHÍNH</page-title>

    <div class="home__transaction-filter">
      <transaction-filter @filter="onFilter" />

      <div class="home__transaction-filter-total-amount">
        Tổng tiền:
        <span class="has-text-danger">{{ totalAmount | monetize }}</span>
      </div>

      <transaction-filter-content
        v-model="filterValue"
        :filter-type="filterType"
      />
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
      />
    </b-modal>
  </div>
</template>

<script lang="ts">
import TransactionFilter from "@/components/TransactionFilter.vue";
import TransactionTable from "@/components/TransactionTable.vue";
import TransactionFilterContent from "@/components/TransactionFilterContent.vue";
import AddButton from "@/components/AddButton.vue";
import TransactionModalAdd from "@/components/TransactionModalAdd.vue";
import PageTitle from "@/components/PageTitle.vue";
import { Component, Vue } from "vue-property-decorator";
import {
  FilterType,
  TransactionView,
  Transaction,
  Client
} from "@/models/transaction";
import filtersMixin from "@/mixins/filters";

@Component({
  components: {
    PageTitle,
    TransactionFilter,
    TransactionTable,
    TransactionFilterContent,
    AddButton,
    TransactionModalAdd
  },
  mixins: [filtersMixin]
})
export default class Home extends Vue {
  filterType: FilterType = "month";
  isShowAddModal: boolean = false;
  isAddingClient: boolean = false;
  isAddingTransaction: boolean = false;

  get transactionsToShow(): TransactionView[] {
    if (this.filterType === "month") {
      return this.$store.getters.transactionViewsThisMonth;
    } else if (this.filterType === "year") {
      return this.$store.getters.transactionViewsThisYear;
    } else {
      return this.$store.getters.transactionViews;
    }
  }

  get filterValue(): number {
    return this.$store.state.filterValue;
  }

  set filterValue(newValue) {
    this.$store.commit("setFilterValue", newValue);
  }

  get totalAmount(): number {
    let totalAmount = 0;
    this.transactionsToShow.forEach(transaction => {
      totalAmount += transaction.amount;
    });
    return totalAmount;
  }

  onFilter(filterType: FilterType) {
    this.filterType = filterType;

    if (filterType === "month") {
      const filterValue = new Date().getMonth();
      this.$store.commit("setFilterValue", filterValue);
    } else if (filterType === "year") {
      const filterValue = new Date().getFullYear();
      this.$store.commit("setFilterValue", filterValue);
    }
  }

  async addTransaction(transactionView: TransactionView) {
    this.isAddingTransaction = true;

    const transaction: Transaction = {
      date: transactionView.date,
      name: transactionView.name,
      type: transactionView.type,
      amount: transactionView.amount
    };

    await this.$store.dispatch("addTransaction", {
      clientId: transactionView.client_id,
      transaction
    });

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
    this.isAddingClient = false;

    this.$buefy.toast.open({
      message: `Khách hàng ${clientName} đã được tạo!`,
      type: "is-success"
    });
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
