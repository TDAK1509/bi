<template>
  <div class="cost">
    <page-title>CHI PHÍ</page-title>

    <div class="cost__filter">
      <div class="cost__time">
        {{ dateRange }}
      </div>

      <div class="cost__total-amount">
        Tổng tiền:
        <span class="has-text-danger">{{ totalAmount | monetize }}</span>
      </div>
    </div>

    <cost-table class="cost__table" :costs="costs" :is-admin="isAdmin" />

    <add-button @click="isShowAddModal = true" />

    <b-modal
      :active.sync="isShowAddModal"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <cost-modal-add @add-done="onAddCostDone" />
    </b-modal>

    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import CostTable from "@/components/CostTable.vue";
import TransactionDatePicker from "@/components/TransactionDatePicker.vue";
import CostModalAdd from "@/views/CostModalAdd.vue";
import AddButton from "@/components/AddButton.vue";
import PageTitle from "@/components/PageTitle.vue";
import { CostView } from "@/models/cost";
import Filters from "@/mixins/filters";
import ErrorHandling from "@/mixins/errorHandling";
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  formatDateToString
} from "@/utils/date";

@Component({
  components: {
    CostTable,
    PageTitle,
    TransactionDatePicker,
    AddButton,
    CostModalAdd
  }
})
export default class Cost extends Mixins(Filters, ErrorHandling) {
  isShowAddModal = false;
  startDate: string = "";
  endDate: string = "";

  get dateRange(): string {
    return `Từ ${this.startDate} đến ${this.endDate}`;
  }

  get isLoading(): boolean {
    return (
      this.$store.state.cost.isFetchingCosts ||
      this.$store.state.cost.isDeletingCost
    );
  }

  get isAdmin(): boolean {
    return this.$store.state.auth.isAdmin;
  }

  get costs(): CostView[] {
    return this.$store.state.cost.costs;
  }

  get totalAmount(): number {
    let totalAmount: number = 0;
    this.costs.forEach(cost => {
      totalAmount += parseInt(cost.amount.toString());
    });
    return totalAmount;
  }

  async searchCostsByQuery() {
    const query = this.$route.query;

    if (query.start_date && query.end_date) {
      this.startDate = query.start_date as string;
      this.endDate = query.end_date as string;
      await this.$store.dispatch("cost/fetchCosts", query);
      return;
    }

    this.startDate = formatDateToString(getFirstDayOfMonth());
    this.endDate = formatDateToString(getLastDayOfMonth());
    await this.$store.dispatch("cost/fetchCosts", {
      start_date: this.startDate,
      end_date: this.endDate
    });
  }

  onAddCostDone() {
    this.isShowAddModal = false;
  }

  async init() {
    await this.searchCostsByQuery();
  }

  mounted() {
    this.init();
  }
}
</script>

<style langg="scss" scoped>
.cost__filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cost__total-amount {
  display: inline-block;
  padding: 10px 30px;
  margin-right: 0px;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
