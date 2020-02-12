<template>
  <form class="cost-modal-edit">
    <div
      v-if="!isLoading"
      class="modal-card cost-modal-edit__modal-card"
      style="width: 500px;"
    >
      <header class="modal-card-head cost-modal-edit__header">
        <p class="modal-card-title">Sửa Chi Phí</p>

        <button
          class="cost-modal-edit__close-button"
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

        <b-field label="Mô tả chi phí">
          <b-input v-model="description"></b-input>
        </b-field>

        <typing-select
          class="cost-modal-edit__typing-select"
          v-model="sellerName"
          :options="sellerNameList"
          label="Tên Người Bán"
          @add="addSeller"
        />

        <b-field label="Thành Tiền" :message="amount | monetize">
          <b-numberinput
            v-model="amount"
            type="is-dark"
            @focus="$event.target.select()"
          ></b-numberinput>
        </b-field>
      </section>

      <footer class="modal-card-foot cost-modal-edit__footer">
        <b-button
          class="cost-modal-edit__button"
          icon-left="plus"
          type="is-dark"
          :loading="isUpdatingCost"
          @click="updateCost"
          >Sửa Chi Phí</b-button
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
import { CostView } from "@/models/cost";
import { formatDateToString } from "@/utils/date";
import TypingSelect from "@/components/TypingSelect.vue";
import Filters from "@/mixins/filters";
import AddOptions from "@/mixins/addOptions";

@Component({
  components: {
    TypingSelect
  }
})
export default class CostModalEdit extends Mixins(AddOptions, Filters) {
  @Prop({ type: Object, required: true })
  cost!: CostView;

  date: Date = new Date(this.cost.date);
  description = this.cost.description;
  amount = this.cost.amount;
  sellerName = this.cost.seller_name;

  get isLoading(): boolean {
    return (
      this.$store.state.options.isFetchingOptions ||
      this.$store.state.options.isAddingOption
    );
  }

  get isUpdatingCost(): boolean {
    return this.$store.state.cost.isUpdatingCost;
  }

  get isOptionsFetched(): boolean {
    return this.$store.state.options.isFetchedOptions;
  }

  get sellerNameList(): string[] {
    if (!this.isOptionsFetched) {
      return [];
    }
    return this.$store.state.options.options.sellers;
  }

  formatDateToString(date: Date): string {
    return formatDateToString(date);
  }

  async updateCost() {
    const cost: CostView = {
      id: this.cost.id,
      date: this.formatDateToString(this.date),
      description: this.description,
      amount: this.amount,
      seller_name: this.sellerName
    };

    try {
      const isSuccess = await this.$store.dispatch("cost/updateCost", cost);

      if (!isSuccess) throw "Failed";

      this.toastSuccess("Sửa chi phí thành công");
      this.onEditDone();
    } catch (error) {
      this.toastError();
    }
  }

  @Emit("edit-done")
  onEditDone() {}

  mounted() {
    if (!this.$store.state.options.isFetchedOptions) {
      this.$store.dispatch("options/fetchOptions");
    }
  }
}
</script>

<style lang="scss" scoped>
.cost-modal-edit__modal-card {
  min-height: 800px;
}

.cost-modal-edit__header {
  position: relative;
}
.cost-modal-edit__close-button {
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

.cost-modal-edit__footer {
  text-align: center;

  .cost-modal-edit__button {
    margin: auto;
  }
}

.cost-modal-edit__debt-amount {
  margin-top: 10px;
}

.cost-modal-edit__typing-select {
  margin-bottom: 10px;
}
</style>
