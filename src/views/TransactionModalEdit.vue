<template>
  <form class="transaction-modal-edit">
    <div
      v-if="!isLoading"
      class="modal-card transaction-modal-edit__modal-card"
      style="width: 500px;"
    >
      <header class="modal-card-head transaction-modal-edit__header">
        <p class="modal-card-title">Sửa Giao Dịch</p>

        <button
          class="transaction-modal-edit__close-button"
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

        <div class="transaction-modal-edit__is-debt">
          <b-switch v-model="isDebt" type="is-success">
            {{ isDebtText }}
          </b-switch>
        </div>

        <typing-select
          class="transaction-modal-edit__typing-select"
          v-model="client"
          :options="clientList"
          label="Tên Khách Hàng"
          @add="addClient"
        />

        <typing-select
          class="transaction-modal-edit__typing-select"
          v-model="sellerName"
          :options="sellerNameList"
          label="Tên Người Bán"
          @add="addSeller"
        />

        <typing-select
          class="transaction-modal-edit__typing-select"
          v-model="transactionType"
          :options="transactionTypeList"
          label="Hình Thức Giao Dịch"
          @add="addTransactionType"
        />

        <typing-select
          class="transaction-modal-edit__typing-select"
          v-model="productName"
          :options="productNameList"
          label="Tên Hàng Hóa"
          @add="addProductName"
        />

        <b-field label="Số Lượng">
          <b-input v-model="productQuantity"></b-input>
        </b-field>

        <typing-select
          class="transaction-modal-edit__typing-select"
          v-model="paymentType"
          label="Hình Thức Thanh Toán"
          :options="paymentTypeList"
          @add="addPaymentType"
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

      <footer class="modal-card-foot transaction-modal-edit__footer">
        <b-button
          class="transaction-modal-edit__button"
          icon-left="plus"
          type="is-dark"
          :loading="isUpdatingTransaction"
          @click="updateTransaction"
          >Sửa Giao Dịch</b-button
        >
      </footer>
    </div>

    <b-loading v-else :is-full-page="true" :active.sync="isLoading"></b-loading>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";
import { TransactionView } from "@/models/transaction";
import { formatDateToString } from "@/utils/date";
import TypingSelect from "@/components/TypingSelect.vue";
import Filters from "@/mixins/filters";
import ErrorHandling from "@/mixins/errorHandling";

@Component({
  components: {
    TypingSelect
  }
})
export default class TransactionModalAdd extends Mixins(
  ErrorHandling,
  Filters
) {
  @Prop({ type: Object, required: true })
  transaction!: TransactionView;

  date: Date = new Date(this.transaction.date);
  client = this.transaction.client_name;
  transactionType = this.transaction.transaction_type;
  amount = this.transaction.amount;
  paymentType = this.transaction.payment_type;
  sellerName = this.transaction.seller_name;
  productName = this.transaction.product_name;
  productQuantity = this.transaction.product_quantity;
  isDebt = this.transaction.is_debt;

  get isLoading(): boolean {
    return (
      this.$store.state.options.isFetchingOptions ||
      this.$store.state.options.isAddingSelectOption
    );
  }

  get isUpdatingTransaction(): boolean {
    return this.$store.state.transaction.isUpdatingTransaction;
  }

  get isOptionsFetched(): boolean {
    return this.$store.state.options.isFetchedOptions;
  }

  get isDebtText(): string {
    return this.isDebt ? "Nợ" : "Không phải nợ";
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

  formatDateToString(date: Date): string {
    return formatDateToString(date);
  }

  async addClient(clientName: string) {
    try {
      await this.$store.dispatch("options/addClient", clientName);
      this.toastSuccess(`Khách hàng ${clientName} đã được tạo!`);
    } catch (error) {
      this.toastError();
    }
  }

  async addSeller(sellerName: string) {
    try {
      await this.$store.dispatch("options/addSeller", sellerName);
      this.toastSuccess(`Thêm người bán thành công!`);
    } catch (error) {
      this.toastError();
    }
  }

  async addTransactionType(transactionType: string) {
    try {
      await this.$store.dispatch("options/addTransactionType", transactionType);
      this.toastSuccess(`Thêm loại giao dịch thành công!`);
    } catch (error) {
      this.toastError();
    }
  }

  async addProductName(productName: string) {
    try {
      await this.$store.dispatch("options/addProductName", productName);
      this.toastSuccess(`Thêm sản phẩm thành công!`);
    } catch (error) {
      this.toastError();
    }
  }

  async addPaymentType(paymentType: string) {
    try {
      await this.$store.dispatch("options/addPaymentType", paymentType);
      this.toastSuccess(`Thêm hình thức thanh toán thành công!`);
    } catch (error) {
      this.toastError();
    }
  }

  async updateTransaction() {
    const transaction: TransactionView = {
      id: this.transaction.id,
      date: this.formatDateToString(this.date),
      transaction_type: this.transactionType,
      amount: this.amount,
      payment_type: this.paymentType,
      seller_name: this.sellerName,
      product_name: this.productName,
      product_quantity: this.productQuantity,
      client_name: this.client,
      is_debt: this.isDebt
    };

    try {
      await this.$store.dispatch("transaction/updateTransaction", transaction);
      this.toastSuccess("Sửa giao dịch thành công");
    } catch (error) {
      this.toastError();
    }
  }

  mounted() {
    if (!this.$store.state.options.isFetchedOptions) {
      this.$store.dispatch("options/fetchOptions");
    }
  }
}
</script>

<style lang="scss" scoped>
.transaction-modal-edit__modal-card {
  min-height: 800px;
}

.transaction-modal-edit__header {
  position: relative;
}
.transaction-modal-edit__close-button {
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

.transaction-modal-edit__footer {
  text-align: center;

  .transaction-modal-edit__button {
    margin: auto;
  }
}

.transaction-modal-edit__is-debt {
  margin-top: 10px;
  margin-bottom: 10px;
}

.transaction-modal-edit__typing-select {
  margin-bottom: 10px;
}
</style>
