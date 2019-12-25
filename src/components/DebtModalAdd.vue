<template>
  <form class="debt-modal-add">
    <div class="modal-card" style="width: 500px;">
      <header class="modal-card-head debt-modal-add__header">
        <p class="modal-card-title">Thêm Nợ</p>

        <button
          class="debt-modal-add__close-button"
          type="button"
          @click="$parent.close()"
        >
          +
        </button>
      </header>
      <section class="modal-card-body">
        <b-field label="Ngày Nợ">
          <b-datepicker
            placeholder="Click để chọn ngày"
            icon="calendar-alt"
            v-model="date"
            :date-formatter="formatDateToString"
          ></b-datepicker>
        </b-field>

        <b-field
          label="Nội Dung Nợ"
          :type="errorDebtContent ? 'is-danger' : ''"
          :message="errorDebtContent"
        >
          <b-input
            v-model="name"
            placeholder="Anh Long mua 5kg cam sành"
          ></b-input>
        </b-field>

        <b-field
          label="Tiền Nợ"
          :type="errorAmount ? 'is-danger' : ''"
          :message="errorAmount"
        >
          <b-numberinput
            v-model="amount"
            type="is-dark"
            controls-position="compact"
            @focus="$event.target.select()"
          ></b-numberinput>
        </b-field>
      </section>
      <footer class="modal-card-foot debt-modal-add__footer">
        <b-button
          class="debt-modal-add__add-button"
          icon-left="plus"
          type="is-dark"
          :loading="isAddingDebt"
          @click="validateForm"
          >Thêm Nợ</b-button
        >
      </footer>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import { ClientInfo } from "@/models/transaction";
import { formatDateToString } from "@/utils/date";

@Component
export default class DebtModalAdd extends Vue {
  date: Date = new Date();
  name = "";
  amount = 0;
  errorDebtContent = "";
  errorAmount = "";

  @Prop({ type: Boolean, default: false })
  isAddingDebt!: boolean;

  get clientList(): ClientInfo[] {
    return this.$store.getters.clientList;
  }

  formatDateToString(date: Date): string {
    return formatDateToString(date);
  }

  validateForm() {
    this.errorDebtContent = this.name === "" ? "Vui lòng điền nội dung nợ" : "";
    this.errorAmount = this.amount <= 0 ? "Tiền nợ phải > 0" : "";

    const isValid = !this.errorDebtContent && !this.errorAmount;

    if (isValid) return this.addDebt();
  }

  @Emit("add-debt")
  addDebt() {
    return {
      date: this.formatDateToString(this.date),
      name: this.name,
      amount: this.amount,
      paid_transaction_list: []
    };
  }
}
</script>

<style lang="scss" scoped>
.debt-modal-add__header {
  position: relative;
}
.debt-modal-add__close-button {
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

.debt-modal-add__footer {
  text-align: center;

  .debt-modal-add__add-button {
    margin: auto;
  }
}
</style>
