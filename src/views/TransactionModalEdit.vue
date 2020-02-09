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
            :disabled="isEditDebt"
          ></b-datepicker>
        </b-field>

        <typing-select
          class="transaction-modal-edit__typing-select"
          v-model="client"
          :options="clientList"
          label="Tên Khách Hàng"
          :disabled="isEditDebt"
          @add="addClient"
        />

        <typing-select
          class="transaction-modal-edit__typing-select"
          v-model="sellerName"
          :options="sellerNameList"
          label="Tên Người Bán"
          :disabled="isEditDebt"
          @add="addSeller"
        />

        <typing-select
          class="transaction-modal-edit__typing-select"
          v-model="transactionType"
          :options="transactionTypeList"
          label="Hình Thức Giao Dịch"
          :disabled="isEditDebt"
          @add="addTransactionType"
        />

        <typing-select
          class="transaction-modal-edit__typing-select"
          v-model="productName"
          :options="productNameList"
          label="Tên Hàng Hóa"
          :disabled="isEditDebt"
          @add="addProductName"
        />

        <b-field label="Số Lượng">
          <b-input v-model="productQuantity" :disabled="isEditDebt"></b-input>
        </b-field>

        <typing-select
          class="transaction-modal-edit__typing-select"
          v-model="paymentType"
          label="Hình Thức Thanh Toán"
          :options="paymentTypeList"
          :disabled="isEditDebt"
          @add="addPaymentType"
        />

        <b-field label="Thành Tiền" :message="amount | monetize">
          <b-numberinput
            v-model="amount"
            type="is-dark"
            step="5000"
            :disabled="isEditDebt"
            @focus="$event.target.select()"
          ></b-numberinput>
        </b-field>

        <div class="transaction-modal-edit__is-debt">
          <b-switch v-model="isDebt" type="is-success">
            {{ isDebtText }}
          </b-switch>
        </div>

        <div
          v-if="isDebt"
          class="transaction-modal-edit__debt-amount"
          key="debtAmount"
        >
          <b-field
            label="Tiền Nợ"
            type="is-danger"
            :message="debtAmount | monetize"
          >
            <b-numberinput
              v-model="debtAmount"
              type="is-danger"
              step="5000"
              :max="amount"
              @focus="$event.target.select()"
            ></b-numberinput>
          </b-field>
        </div>
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
import {
  Component,
  Vue,
  Prop,
  Mixins,
  Emit,
  Watch
} from "vue-property-decorator";
import { TransactionView } from "@/models/transaction";
import { formatDateToString } from "@/utils/date";
import TypingSelect from "@/components/TypingSelect.vue";
import Filters from "@/mixins/filters";
import AddOptions from "@/mixins/addOptions";

@Component({
  components: {
    TypingSelect
  }
})
export default class TransactionModalEdit extends Mixins(AddOptions, Filters) {
  @Prop({ type: Object, required: true })
  transaction!: TransactionView;

  @Prop({ type: Boolean, default: false })
  isEditDebt!: boolean;

  date: Date = new Date(this.transaction.date);
  client = this.transaction.client_name;
  transactionType = this.transaction.transaction_type;
  amount = this.transaction.amount;
  paymentType = this.transaction.payment_type;
  sellerName = this.transaction.seller_name;
  productName = this.transaction.product_name;
  productQuantity = this.transaction.product_quantity;
  isDebt = this.transaction.is_debt || false;
  debtAmount = this.transaction.debt_amount || 0;

  get isLoading(): boolean {
    return (
      this.$store.state.options.isFetchingOptions ||
      this.$store.state.options.isAddingOption
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

  @Watch("isDebt")
  onChangeIsDebt(value: boolean) {
    this.debtAmount = value ? this.amount : 0;

    if (value) {
      this.scrollToDebtAmount();
    }
  }

  @Watch("debtAmount")
  onChangeDebtAmount(debtAmount: number) {
    this.debtAmount = debtAmount > this.amount ? this.amount : debtAmount;
  }

  @Watch("amount")
  onChangeAmount(amount: number) {
    if (this.isDebt && this.debtAmount > amount) {
      this.debtAmount = amount;
    }
  }

  scrollToDebtAmount() {
    setTimeout(() => {
      const debtAmountElement = document.querySelector(
        ".transaction-modal-edit__debt-amount"
      );
      if (debtAmountElement !== null) {
        debtAmountElement.scrollIntoView({
          behavior: "smooth"
        });
      }
    }, 100);
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
      is_debt: this.isDebt,
      debt_amount: this.debtAmount
    };

    try {
      await this.$store.dispatch("transaction/updateTransaction", transaction);
      this.toastSuccess("Sửa giao dịch thành công");
      this.onEditTransactionDone();
    } catch (error) {
      this.toastError();
    }
  }

  @Emit("edit-transaction-done")
  onEditTransactionDone() {}

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
  margin-top: 28px;
  margin-bottom: 20px;
}

.transaction-modal-edit__debt-amount {
  margin-top: 10px;
}

.transaction-modal-edit__typing-select {
  margin-bottom: 10px;
}
</style>
