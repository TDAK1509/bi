<template>
  <form class="modal-add-transaction">
    <div class="modal-card" style="width: 500px;">
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

        <b-field
          label="Tên Khách Hàng (Chưa có thì tạo mới rồi chọn)"
          :type="errorClientName ? 'is-danger' : ''"
          :message="errorClientName"
        >
          <b-select placeholder="Chọn loại giao dịch" v-model="clientInfo">
            <option
              v-for="client in clientList"
              :key="client.id"
              :value="{ id: client.id, name: client.name }"
              >{{ client.name }}</option
            >
          </b-select>
        </b-field>

        <b-field>
          <b-input
            placeholder="Tạo khách hàng mới"
            type="text"
            v-model="newClient"
            :disabled="isAddingClient"
          ></b-input>
          <p class="control">
            <b-tooltip
              label="Vui lòng điền tên khách hàng muốn tạo"
              type="is-info"
            >
              <b-button
                native-type="button"
                type="is-danger"
                icon-right="plus"
                :loading="isAddingClient"
                :disabled="!newClient"
                @click="addClient"
              />
            </b-tooltip>
          </p>
        </b-field>

        <b-field
          label="Nội Dung Giao Dịch"
          :type="errorTransactionName ? 'is-danger' : ''"
          :message="errorTransactionName"
        >
          <b-input v-model="transactionName"></b-input>
        </b-field>

        <b-field
          label="Loại Giao Dịch"
          :type="errorTransactionType ? 'is-danger' : ''"
          :message="errorTransactionType"
        >
          <b-select placeholder="Chọn loại giao dịch" v-model="transactionType">
            <option v-for="type in transactionTypeList" :key="type">
              {{ type }}
            </option>
          </b-select>
        </b-field>

        <b-field label="Thành Tiền">
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
  </form>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import { TransactionView, ClientInfo } from "@/models/transaction";
import { formatDateToString } from "@/utils/date";

@Component
export default class ModalAddTransaction extends Vue {
  date: Date = new Date();
  clientInfo: ClientInfo = { id: "", name: "" };
  transactionName = "";
  transactionType = "";
  amount = 0;
  newClient = "";

  errorClientName = "";
  errorTransactionName = "";
  errorTransactionType = "";

  @Prop({ type: Boolean, default: false })
  isAddingClient!: boolean;

  @Prop({ type: Boolean, default: false })
  isAddingTransaction!: boolean;

  get transactionTypeList(): string[] {
    return ["Tien mat", "VCB"];
  }

  get clientList(): ClientInfo[] {
    return this.$store.getters.clientList;
  }

  formatDateToString(date: Date): string {
    return formatDateToString(date);
  }

  validateForm() {
    this.errorClientName =
      this.clientInfo.name === "" ? "Vui lòng chọn khách hàng" : "";

    this.errorTransactionName =
      this.transactionName === "" ? "Vui lòng điền tên giao dịch" : "";

    this.errorTransactionType =
      this.transactionType === "" ? "Vui lòng chọn loại giao dịch" : "";

    const isValid =
      !this.errorClientName &&
      !this.errorTransactionName &&
      !this.errorTransactionType;

    if (isValid === true) return this.addTransaction();
  }

  @Emit("add-transaction")
  addTransaction(): TransactionView {
    return {
      date: this.formatDateToString(this.date),
      name: this.transactionName,
      type: this.transactionType,
      amount: this.amount,
      client_name: this.clientInfo.name,
      client_id: this.clientInfo.id
    };
  }

  @Emit("add-client")
  addClient() {
    return this.newClient;
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
