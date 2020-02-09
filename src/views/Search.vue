<template>
  <div class="search">
    <page-title>TÌM GIAO DỊCH</page-title>

    <div class="search__select-container">
      <div class="search__select-item">
        <b-radio v-model="searchCriteria" type="is-dark" native-value="id">
          Mã giao dịch
        </b-radio>

        <b-input
          class="search__select-item-input"
          v-model.trim="searchValue"
          placeholder="Điền mã giao dịch"
        ></b-input>
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
      </div>

      <div class="search__select-item">
        <b-radio
          v-model="searchCriteria"
          type="is-dark"
          native-value="product_name"
        >
          Tên hàng hóa
        </b-radio>
      </div>

      <div class="search__select-item">
        <b-radio
          v-model="searchCriteria"
          type="is-dark"
          native-value="payment_type"
        >
          Hình thức thanh toán
        </b-radio>
      </div>

      <div class="search__select-item">
        <b-radio v-model="searchCriteria" type="is-dark" native-value="amount">
          Thành tiền
        </b-radio>
      </div>
    </div>

    <b-loading :is-full-page="true" :active="!isOptionsFetched"></b-loading>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import PageTitle from "@/components/PageTitle.vue";

@Component({
  components: {
    PageTitle
  }
})
export default class Search extends Vue {
  searchCriteria: string = "id";
  searchValue: string = "";

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
</style>
