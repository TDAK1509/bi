<template>
  <form class="modal-add-transaction">
    <div v-if="!isLoading" class="modal-card" style="width: 500px;">
      <header class="modal-card-head modal-add-transaction__header">
        <p class="modal-card-title">Thêm Giao Dịch</p>

        <button
          class="modal-add-transaction__close-button"
          type="button"
          @click="$parent.close()"
        >
          +
        </button>
      </header>
      <section class="modal-card-body">
        <b-field label="Ngày Giao Dịch">
          <b-datepicker
            placeholder="Click để chọn ngày"
            icon="calendar-alt"
            v-model="date"
            :date-formatter="formatDateToString"
          ></b-datepicker>
        </b-field>

        <transaction-modal-add-select-with-create-button
          v-model="clientInfo"
          label="Tên Khách Hàng"
          :error-message="errorClientName"
          :list="clientList"
          @add-to-list="addClient"
        />

        <transaction-modal-add-select-with-create-button
          v-if="sellerNameList"
          v-model="sellerName"
          label="Tên Người Bán"
          :error-message="errorSellerName"
          :list="sellerNameList"
          @add-to-list="addSeller"
        />

        <transaction-modal-add-select-with-create-button
          v-if="transactionTypeList"
          v-model="transactionType"
          label="Hình Thức Giao Dịch"
          :error-message="errorTransactionType"
          :list="transactionTypeList"
          @add-to-list="addTransactionType"
        />

        <transaction-modal-add-select-with-create-button
          v-if="productNameList"
          v-model="productName"
          label="Tên Hàng Hóa"
          :error-message="errorProductName"
          :list="productNameList"
          @add-to-list="addProductName"
        />

        <b-field
          label="Số Lượng"
          :type="errorProductQuantity ? 'is-danger' : ''"
          :message="errorProductQuantity"
        >
          <b-input v-model="productQuantity"></b-input>
        </b-field>

        <transaction-modal-add-select-with-create-button
          v-if="paymentTypeList"
          v-model="paymentType"
          label="Hình Thức Thanh Toán"
          :error-message="errorPaymentType"
          :list="paymentTypeList"
          @add-to-list="addPaymentType"
        />

        <b-field label="Thành Tiền" :message="amount | monetize">
          <b-numberinput
            v-model="amount"
            type="is-dark"
            controls-position="compact"
            @focus="$event.target.select()"
          ></b-numberinput>
        </b-field>
      </section>
      <footer class="modal-card-foot modal-add-transaction__footer">
        <b-button
          class="modal-add-transaction__add-button"
          icon-left="plus"
          type="is-dark"
          :loading="isAddingTransaction"
          @click="validateForm"
          >Thêm Giao Dịch</b-button
        >
      </footer>
    </div>

    <b-loading v-else :is-full-page="true" :active.sync="isLoading"></b-loading>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import { ClientInfo, TransactionAddArguments } from "@/models/transaction";
import { formatDateToString } from "@/utils/date";
import TransactionModalAddSelectWithCreateButton from "./TransactionModalAddSelectWithCreateButton.vue";
import filterMixin from "@/mixins/filters";

@Component({
  components: {
    TransactionModalAddSelectWithCreateButton
  },
  mixins: [filterMixin]
})
export default class ModalAddTransaction extends Vue {
  date: Date = new Date();
  clientInfo: ClientInfo = { id: "", name: "" };
  transactionType = "";
  amount = 0;
  paymentType = "";
  sellerName = "";
  productName = "";
  productQuantity = "";

  errorClientName = "";
  errorTransactionType = "";
  errorPaymentType = "";
  errorSellerName = "";
  errorProductName = "";
  errorProductQuantity = "";

  @Prop({ type: Boolean, default: false })
  isAddingClient!: boolean;

  @Prop({ type: Boolean, default: false })
  isAddingTransaction!: boolean;

  get isLoading(): boolean {
    return this.$store.state.isFetchingOptions;
  }

  get clientList(): ClientInfo[] {
    return this.$store.getters.clientList;
  }

  get sellerNameList(): string[] {
    return this.$store.state.options.sellers;
  }

  get transactionTypeList(): string[] {
    return this.$store.state.options.transaction_types;
  }

  get productNameList(): string[] {
    return this.$store.state.options.product_names;
  }

  get paymentTypeList(): string[] {
    return this.$store.state.options.payment_types;
  }

  formatDateToString(date: Date): string {
    return formatDateToString(date);
  }

  validateForm() {
    this.errorClientName =
      this.clientInfo.name === "" ? "Vui lòng chọn khách hàng" : "";

    this.errorTransactionType =
      this.transactionType === "" ? "Vui lòng chọn loại giao dịch" : "";

    this.errorSellerName =
      this.sellerName === "" ? "Vui lòng chọn người bán" : "";

    this.errorPaymentType =
      this.paymentType === "" ? "Vui lòng chọn hình thức thanh toán" : "";

    this.errorProductName =
      this.productName === "" ? "Vui lòng chọn tên hàng hóa" : "";

    this.errorProductQuantity =
      this.productQuantity === "" ? "Vui lòng chọn số lượng" : "";

    const isValid =
      !this.errorClientName &&
      !this.errorTransactionType &&
      !this.errorSellerName &&
      !this.errorPaymentType &&
      !this.errorProductName &&
      !this.errorProductQuantity;

    if (isValid === true) return this.addTransaction();
  }

  @Emit("add-transaction")
  addTransaction(): TransactionAddArguments {
    return {
      clientId: this.clientInfo.id,

      transaction: {
        date: this.formatDateToString(this.date),
        transaction_type: this.transactionType,
        amount: this.amount,
        payment_type: this.paymentType,
        seller_name: this.sellerName,
        product_name: this.productName,
        product_quantity: this.productQuantity
      }
    };
  }

  @Emit("add-client")
  addClient(value: string) {}

  @Emit("add-seller")
  addSeller(value: string) {}

  @Emit("add-transaction-type")
  addTransactionType(value: string) {}

  @Emit("add-product-name")
  addProductName(value: string) {}

  @Emit("add-payment-type")
  addPaymentType(value: string) {}

  mounted() {
    this.$store.dispatch("fetchOptions");
  }
}
</script>

<style lang="scss" scoped>
.modal-add-transaction__header {
  position: relative;
}
.modal-add-transaction__close-button {
  border: none;
  background: none;
  transform: rotate(45deg);
  font-size: 3rem;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 0px;
  right: 15px;
  cursor: pointer;

  &:hover {
    transform: rotate(45deg) scale(1.2);
    transition: 0.3s;
  }
}

.modal-add-transaction__footer {
  text-align: center;

  .modal-add-transaction__add-button {
    margin: auto;
  }
}
.modal-add-transaction__client-name {
  display: flex;
}
</style>
