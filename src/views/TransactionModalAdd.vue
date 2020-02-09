<template>
  <form class="transaction-modal-add">
    <div
      v-if="!isLoading"
      class="modal-card transaction-modal-add__modal-card"
      style="width: 500px;"
    >
      <header class="modal-card-head transaction-modal-add__header">
        <p class="modal-card-title">Thêm Giao Dịch</p>

        <button
          class="transaction-modal-add__close-button"
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

        <div class="transaction-modal-add__is-debt">
          <b-switch v-model="isDebt" type="is-success">
            {{ isDebtText }}
          </b-switch>
        </div>

        <div class="transaction-modal-add__client">
          <typing-select
            class="transaction-modal-add__typing-select"
            v-model="client"
            :options="clientList"
            label="Tên Khách Hàng"
            @add="addClient"
          />
        </div>

        <transition name="fade">
          <typing-select
            v-if="sellerNameList && client"
            class="transaction-modal-add__typing-select"
            v-model="sellerName"
            :options="sellerNameList"
            label="Tên Người Bán"
            @add="addSeller"
          />
        </transition>

        <transition name="fade">
          <typing-select
            v-if="transactionTypeList && sellerName"
            class="transaction-modal-add__typing-select"
            v-model="transactionType"
            :options="transactionTypeList"
            label="Hình Thức Giao Dịch"
            @add="addTransactionType"
          />
        </transition>

        <transition name="fade">
          <typing-select
            v-if="productNameList && transactionType"
            class="transaction-modal-add__typing-select"
            v-model="productName"
            :options="productNameList"
            label="Tên Hàng Hóa"
            @add="addProductName"
          />
        </transition>

        <transition name="fade">
          <b-field v-if="productName" label="Số Lượng">
            <b-input v-model="productQuantity"></b-input>
          </b-field>
        </transition>

        <transition name="fade">
          <typing-select
            v-if="paymentTypeList && productQuantity"
            class="transaction-modal-add__typing-select"
            v-model="paymentType"
            label="Hình Thức Thanh Toán"
            :options="paymentTypeList"
            @add="addPaymentType"
          />
        </transition>

        <transition name="fade">
          <b-field
            v-if="paymentType"
            label="Thành Tiền"
            :message="amount | monetize"
          >
            <b-numberinput
              v-model="amount"
              type="is-dark"
              controls-position="compact"
              @focus="$event.target.select()"
            ></b-numberinput>
          </b-field>
        </transition>
      </section>

      <footer class="modal-card-foot transaction-modal-add__footer">
        <b-button
          class="transaction-modal-add__add-button"
          icon-left="plus"
          type="is-dark"
          :loading="isAddingTransaction"
          :disabled="isButtonDisabled"
          @click="addTransaction"
          >Thêm Giao Dịch</b-button
        >
      </footer>
    </div>

    <b-loading v-else :is-full-page="true" :active.sync="isLoading"></b-loading>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop, Mixins } from "vue-property-decorator";
import { Transaction } from "@/models/transaction";
import { formatDateToString } from "@/utils/date";
import TransactionModalAddSelectWithCreateButton from "@/components/TransactionModalAddSelectWithCreateButton.vue";
import TypingSelect from "@/components/TypingSelect.vue";
import Filters from "@/mixins/filters";
import AddOptions from "@/mixins/addOptions";

@Component({
  components: {
    TransactionModalAddSelectWithCreateButton,
    TypingSelect
  }
})
export default class TransactionModalAdd extends Mixins(AddOptions, Filters) {
  date: Date = new Date();
  client = "";
  transactionType = "";
  amount = 0;
  paymentType = "";
  sellerName = "";
  productName = "";
  productQuantity = "";
  isDebt = false;

  get isLoading(): boolean {
    return this.$store.state.options.isFetchingOptions;
  }

  get isAddingTransaction(): boolean {
    return this.$store.state.transaction.isAddingTransaction;
  }

  get isOptionsFetched(): boolean {
    return this.$store.state.options.isFetchedOptions;
  }

  get isButtonDisabled(): boolean {
    return (
      !this.client ||
      !this.sellerName ||
      !this.transactionType ||
      this.amount < 0 ||
      !this.paymentType ||
      !this.productName ||
      !this.productQuantity
    );
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

  async addTransaction() {
    const transaction: Transaction = {
      date: formatDateToString(this.date),
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
      await this.$store.dispatch("transaction/addTransaction", transaction);
      this.toastSuccess("Thêm giao dịch thành công");
      this.addTransactionDone();
    } catch (error) {
      this.toastError();
    }
  }

  @Emit("add-transaction-done")
  addTransactionDone() {}

  mounted() {
    if (!this.$store.state.options.isFetchedOptions) {
      this.$store.dispatch("options/fetchOptions");
    }
  }
}
</script>

<style lang="scss" scoped>
.transaction-modal-add__modal-card {
  min-height: 800px;
}

.transaction-modal-add__header {
  position: relative;
}
.transaction-modal-add__close-button {
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

.transaction-modal-add__footer {
  text-align: center;

  .transaction-modal-add__add-button {
    margin: auto;
  }
}

.transaction-modal-add__is-debt {
  margin-top: 10px;
  margin-bottom: 10px;
}

.transaction-modal-add__client {
  margin-bottom: 10px;
}

.transaction-modal-add__typing-select {
  margin-bottom: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
