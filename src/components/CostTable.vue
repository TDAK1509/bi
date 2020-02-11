<template>
  <div class="cost-table">
    <b-table
      paginated
      per-page="10"
      default-sort="date"
      sort-icon="chevron-up"
      :data="costs"
    >
      >
      <template slot-scope="props">
        <b-table-column field="date" label="Ngày" sortable>
          {{ props.row.date }}
        </b-table-column>

        <b-table-column field="description" label="Mô tả chi phí" searchable>
          {{ props.row.description }}
        </b-table-column>

        <b-table-column
          field="seller_name"
          label="Tên Người Bán"
          sortable
          searchable
        >
          {{ props.row.seller_name }}
        </b-table-column>

        <b-table-column field="amount" label="Chi phí" sortable numeric>
          {{ props.row.amount | monetize }}
        </b-table-column>

        <b-table-column v-if="isAdmin">
          <button
            class="cost-table__icon-button"
            @click="showModalEdit(props.row)"
          >
            <b-icon icon="edit" size="is-small" />
          </button>
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-success has-text-centered">
            <p>
              <b-icon icon="smile" pack="fas" size="is-large"></b-icon>
            </p>
            <p>Chưa phát sinh chi phí</p>
          </div>
        </section>
      </template>
    </b-table>

    <b-modal
      :active.sync="showModal"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <transaction-modal-edit :transaction="editData" is-edit-debt />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { CostView } from "@/models/cost";
import Filters from "@/mixins/filters";
import TransactionModalEdit from "@/views/TransactionModalEdit.vue";

@Component({
  components: {
    TransactionModalEdit
  }
})
export default class CostTable extends Filters {
  @Prop({ type: Array, required: true })
  costs!: CostView[];

  @Prop({ type: Boolean, default: false })
  isAdmin!: boolean;

  showModal = false;
  editData: CostView | null = null;

  showModalEdit(rowData: CostView) {
    this.showModal = true;
    this.editData = rowData;
  }
}
</script>

<style lang="scss">
.cost-table__row-debt {
  background: #3d8b88;
  color: #fff;

  .cost-table__link {
    color: #fff;
  }
}

.cost-table__icon-button {
  background: none;
  border: none;
  padding: 0;
  font-size: 1em;
  cursor: pointer;

  &:not(:last-child) {
    margin-right: 10px;
  }
}
</style>
