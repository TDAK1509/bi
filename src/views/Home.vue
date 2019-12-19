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
  </div>
</template>

<script lang="ts">
import TransactionFilter from "@/components/TransactionFilter.vue";
import TransactionTable from "@/components/TransactionTable.vue";
import TransactionFilterContent from "@/components/TransactionFilterContent.vue";
import PageTitle from "@/components/PageTitle.vue";
import { Component, Vue } from "vue-property-decorator";
import { FilterType, TransactionView } from "@/models/transaction";
import filtersMixin from "@/mixins/filters";

@Component({
  components: {
    PageTitle,
    TransactionFilter,
    TransactionTable,
    TransactionFilterContent
  },
  mixins: [filtersMixin]
})
export default class Home extends Vue {
  filterType: FilterType = "month";

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
