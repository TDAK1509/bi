<template>
  <form class="cost-modal-add">
    <div
      v-if="!isLoading"
      class="modal-card cost-modal-add__modal-card"
      style="width: 500px;"
    >
      <header class="modal-card-head cost-modal-add__header">
        <p class="modal-card-title">Thêm Chi Phí</p>

        <button
          class="cost-modal-add__close-button"
          type="button"
          @click="$parent.close()"
        >
          +
        </button>
      </header>

      <section class="modal-card-body">
        <b-field label="Ngày">
          <b-datepicker
            placeholder="Click để chọn ngày"
            icon="calendar-alt"
            v-model="date"
            :date-formatter="formatDateToString"
          ></b-datepicker>
        </b-field>

        <transition name="fade">
          <b-field v-if="date" label="Mô tả chi phí">
            <b-input v-model="description"></b-input>
          </b-field>
        </transition>

        <transition name="fade">
          <typing-select
            v-if="sellerNameList && description"
            class="cost-modal-add__typing-select"
            v-model="sellerName"
            :options="sellerNameList"
            label="Tên Người Bán"
            @add="addSeller"
          />
        </transition>

        <transition-group name="fade"
          ><b-field
            v-if="sellerName"
            label="Thành Tiền"
            :message="amount | monetize"
            key="amount"
          >
            <b-numberinput
              v-model="amount"
              type="is-dark"
              @focus="$event.target.select()"
            ></b-numberinput>
          </b-field>
        </transition-group>
      </section>

      <footer class="modal-card-foot cost-modal-add__footer">
        <b-button
          class="cost-modal-add__add-button"
          icon-left="plus"
          type="is-dark"
          :loading="isAddingCost"
          :disabled="isButtonDisabled"
          @click="addCost"
          >Thêm Chi Phí</b-button
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
  Emit,
  Prop,
  Mixins,
  Watch
} from "vue-property-decorator";
import { Transaction } from "@/models/transaction";
import { formatDateToString } from "@/utils/date";
import TransactionModalAddSelectWithCreateButton from "@/components/TransactionModalAddSelectWithCreateButton.vue";
import TypingSelect from "@/components/TypingSelect.vue";
import Filters from "@/mixins/filters";
import Options from "@/mixins/options";
import { Cost } from "@/models/cost";

@Component({
  components: {
    TransactionModalAddSelectWithCreateButton,
    TypingSelect
  }
})
export default class CostModalAdd extends Mixins(Options, Filters) {
  date: Date = new Date();
  description = "";
  amount = 0;
  sellerName = "";

  get isLoading(): boolean {
    return this.$store.state.options.isFetchingOptions;
  }

  get isAddingCost(): boolean {
    return this.$store.state.cost.isAddingCost;
  }

  get isButtonDisabled(): boolean {
    return !this.sellerName || !this.description || this.amount < 0;
  }

  formatDateToString(date: Date): string {
    return formatDateToString(date);
  }

  async addCost() {
    const cost: Cost = {
      date: formatDateToString(this.date),
      description: this.description,
      amount: this.amount,
      seller_name: this.sellerName
    };

    try {
      await this.$store.dispatch("cost/addCost", cost);
      this.toastSuccess("Thêm chi phí thành công");
      this.addCostDone();
    } catch (error) {
      this.toastError();
    }
  }

  @Emit("add-done")
  addCostDone() {}

  mounted() {
    if (!this.$store.state.options.isFetchedOptions) {
      this.$store.dispatch("options/fetchOptions");
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/animations.scss";

.cost-modal-add__modal-card {
  min-height: 800px;
}

.cost-modal-add__header {
  position: relative;
}
.cost-modal-add__close-button {
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

.cost-modal-add__footer {
  text-align: center;

  .cost-modal-add__add-button {
    margin: auto;
  }
}

.cost-modal-add__typing-select {
  margin-bottom: 10px;
}
</style>
