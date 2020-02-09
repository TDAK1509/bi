<template>
  <div class="search">
    <page-title>TÌM GIAO DỊCH</page-title>

    <div class="search__date-container">
      <b-field label="Ngày Giao Dịch" :message="selectDateMessage">
        <b-datepicker
          v-model="date"
          :date-formatter="formatDateToString"
          range
          nearby-selectable-month-days
        />
      </b-field>
    </div>

    <div v-show="date.length === 2" class="search__select-container">
      <div class="search__select-item">
        <b-radio
          v-model="searchCriteria"
          type="is-dark"
          native-value="id"
          @change.native="onSelectSearchCriteria"
        >
          Mã giao dịch
        </b-radio>

        <b-input
          v-if="searchCriteria === 'id'"
          class="search__select-item-input"
          v-model.trim="searchValue"
          placeholder="Điền mã giao dịch"
        />
      </div>

      <div class="search__select-item">
        <b-radio
          v-model="searchCriteria"
          type="is-dark"
          native-value="client_name"
          @change.native="onSelectSearchCriteria"
        >
          Tên khách hàng
        </b-radio>

        <v-select
          v-if="searchCriteria === 'client_name'"
          class="search__select-item-input"
          v-model.trim="searchValue"
          :options="clientList"
          :clearable="false"
        />
      </div>

      <div class="search__select-item">
        <b-radio
          v-model="searchCriteria"
          type="is-dark"
          native-value="seller_name"
          @change.native="onSelectSearchCriteria"
        >
          Tên người bán
        </b-radio>

        <v-select
          v-if="searchCriteria === 'seller_name'"
          class="search__select-item-input"
          v-model.trim="searchValue"
          :options="sellerNameList"
          :clearable="false"
        />
      </div>

      <div class="search__select-item">
        <b-radio
          v-model="searchCriteria"
          type="is-dark"
          native-value="product_name"
          @change.native="onSelectSearchCriteria"
        >
          Tên hàng hóa
        </b-radio>

        <v-select
          v-if="searchCriteria === 'product_name'"
          class="search__select-item-input"
          v-model.trim="searchValue"
          :options="productNameList"
          :clearable="false"
        />
      </div>

      <div class="search__select-item">
        <b-radio
          v-model="searchCriteria"
          type="is-dark"
          native-value="payment_type"
          @change.native="onSelectSearchCriteria"
        >
          Hình thức thanh toán
        </b-radio>

        <v-select
          v-if="searchCriteria === 'payment_type'"
          class="search__select-item-input"
          v-model.trim="searchValue"
          :options="paymentTypeList"
          :clearable="false"
        />
      </div>

      <div class="search__select-item">
        <b-radio v-model="searchCriteria" type="is-dark" native-value="amount">
          Thành tiền
        </b-radio>

        <div
          v-if="searchCriteria === 'amount'"
          class="search__select-item-input search__select-item-input-amount"
        >
          <b-field>
            <b-radio-button v-model="amountOperator" native-value=">=">
              <strong>&gt;=</strong>
            </b-radio-button>

            <b-radio-button v-model="amountOperator" native-value="==">
              <strong>=</strong>
            </b-radio-button>

            <b-radio-button v-model="amountOperator" native-value="<=">
              <strong>&lt;=</strong>
            </b-radio-button>
          </b-field>

          <b-numberinput
            class="search__select-item-input-amount--input"
            v-model.trim="searchValue"
            controls-position="compact"
            expanded
            type="is-dark"
            step="5000"
            @focus="$event.target.select()"
          />
        </div>
      </div>
    </div>

    <div class="search__button-container">
      <b-button
        type="is-dark"
        icon-right="search"
        :disabled="!searchValue || date.length != 2"
        @click="search"
      >
        Tìm
      </b-button>
    </div>

    <b-loading :is-full-page="true" :active="!isOptionsFetched"></b-loading>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import PageTitle from "@/components/PageTitle.vue";
import { formatDateToString } from "@/utils/date";

@Component({
  components: {
    PageTitle
  }
})
export default class Search extends Vue {
  searchCriteria: string = "";
  searchValue: string | number = "";
  amountOperator = "==";
  date: Date[] = [];

  @Watch("searchCriteria")
  onSearchCriteriaChange(value: string) {
    this.searchValue = value === "amount" ? 0 : "";
    this.amountOperator = value === "amount" ? "<=" : "==";
  }

  get selectDateMessage(): string {
    return this.date.length === 2 ? "" : "Vui lòng chọn ngày";
  }

  get isOptionsFetched(): boolean {
    return this.$store.state.options.isFetchedOptions;
  }

  get clientList(): string[] {
    if (!this.isOptionsFetched) {
      return [];
    }
    return this.$store.state.options.options.clients;
  }

  get sellerNameList(): string[] {
    if (!this.isOptionsFetched) {
      return [];
    }
    return this.$store.state.options.options.sellers;
  }

  get transactionTypeList(): string[] {
    if (!this.isOptionsFetched) {
      return [];
    }
    return this.$store.state.options.options.transaction_types;
  }

  get productNameList(): string[] {
    if (!this.isOptionsFetched) {
      return [];
    }
    return this.$store.state.options.options.product_names;
  }

  get paymentTypeList(): string[] {
    if (!this.isOptionsFetched) {
      return [];
    }
    return this.$store.state.options.options.payment_types;
  }

  formatDateToString(dateRange: Date[]): string {
    if (dateRange.length !== 2) {
      return "";
    }
    const startDate = formatDateToString(dateRange[0]);
    const endDate = formatDateToString(dateRange[1]);
    return `${startDate} đến ${endDate}`;
  }

  onSelectSearchCriteria(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const container = target.closest(".search__select-item") as HTMLElement;
    const input = container.querySelector(
      ".search__select-item-input input"
    ) as HTMLInputElement;
    input.focus();
  }

  search() {
    const query: { [key: string]: string } = {
      field: this.searchCriteria,
      value: this.searchValue.toString(),
      operator: this.amountOperator,
      startDate: formatDateToString(this.date[0]),
      endDate: formatDateToString(this.date[1])
    };

    this.$router.push({ name: "transaction", query: query });
  }

  mounted() {
    if (!this.$store.state.options.isFetchedOptions) {
      this.$store.dispatch("options/fetchOptions");
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  width: 500px;
  margin: auto;
}

.search__date-container {
  margin-bottom: 20px;
}

.search__select-item {
  &:not(:first-child) {
    margin-top: 20px;
  }
}

.search__select-item-input {
  margin-top: 10px;
}

.search__select-item-input-amount {
  display: flex;
  justify-content: space-between;
}

.search__select-item-input-amount--input {
  flex: 1;
  margin-left: 20px;
}

.search__button-container {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  margin-left: auto;
}
</style>
