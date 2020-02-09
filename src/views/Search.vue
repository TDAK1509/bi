<template>
  <div class="search">
    <page-title>TÌM GIAO DỊCH</page-title>

    <div class="search__select-container">
      <div class="search__select-item">
        <b-radio v-model="searchCriteria" type="is-dark" native-value="id">
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
              &gt;=
            </b-radio-button>

            <b-radio-button v-model="amountOperator" native-value="==">
              =
            </b-radio-button>

            <b-radio-button v-model="amountOperator" native-value="<=">
              &lt;=
            </b-radio-button>
          </b-field>

          <b-numberinput
            class="search__select-item-input-amount--input"
            v-model.trim="searchValue"
            controls-position="compact"
            expanded
            type="is-dark"
            step="5000"
          />
        </div>
      </div>
    </div>

    <b-loading :is-full-page="true" :active="!isOptionsFetched"></b-loading>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import PageTitle from "@/components/PageTitle.vue";

@Component({
  components: {
    PageTitle
  }
})
export default class Search extends Vue {
  searchCriteria: string = "id";
  searchValue: string | number = "";
  amountOperator = "<=";

  @Watch("searchCriteria")
  onSearchCriteriaChange(value: string) {
    this.searchValue = value === "amount" ? 0 : "";
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

  mounted() {
    if (!this.$store.state.options.isFetchedOptions) {
      this.$store.dispatch("options/fetchOptions");
    }
  }
}
</script>

<style lang="scss" scoped>
.search__select-container {
  width: 500px;
  margin: auto;
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
</style>
