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
          v-model="searchValue"
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
