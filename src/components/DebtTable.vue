<template>
  <div class="debt-table">
    <b-table
      paginated
      per-page="10"
      default-sort="date"
      sort-icon="chevron-up"
      :data="debts"
    >
      >
      <template slot-scope="props">
        <b-table-column field="date" label="Ngày" sortable>
          {{ props.row.date }}
        </b-table-column>

        <b-table-column field="id" label="Mã Giao Dịch" searchable>
          {{ props.row.id }}
        </b-table-column>

        <b-table-column
          field="client_name"
          label="Khách Hàng"
          sortable
          searchable
        >
          {{ props.row.client_name }}
        </b-table-column>

        <b-table-column
          field="seller_name"
          label="Tên Người Bán"
          sortable
          searchable
        >
          {{ props.row.seller_name }}
        </b-table-column>

        <b-table-column
          field="transaction_type"
          label="Hình Thức Giao Dịch"
          sortable
          searchable
        >
          {{ props.row.transaction_type }}
        </b-table-column>

        <b-table-column
          field="product_name"
          label="Tên Hàng Hóa"
          sortable
          searchable
        >
          {{ props.row.product_name }}
        </b-table-column>

        <b-table-column field="product_quantity" label="Số Lượng" sortable>
          {{ props.row.product_quantity }}
        </b-table-column>

        <b-table-column
          field="payment_type"
          label="Hình Thức Thanh Toán"
          sortable
          searchable
        >
          {{ props.row.payment_type }}
        </b-table-column>

        <b-table-column field="amount" label="Thành Tiền" sortable numeric>
          {{ props.row.amount | monetize }}
        </b-table-column>

        <b-table-column>
          <button
            class="debt-table__icon-button"
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
            <p>Không có giao dịch nào đang nợ.</p>
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
      <transaction-modal-edit :transaction="editData" />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { TransactionView } from "@/models/transaction";
import filtersMixin from "@/mixins/filters";
import TransactionModalEdit from "@/views/TransactionModalEdit.vue";

@Component({
  components: {
    TransactionModalEdit
  },
  mixins: [filtersMixin]
})
export default class DebtTable extends Vue {
  @Prop({ type: Array, required: true })
  debts!: TransactionView[];

  showModal = false;
  editData: TransactionView | null = null;

  @Emit("delete")
  onEdit(transactionId: string) {}

  showModalEdit(rowData: TransactionView) {
    this.showModal = true;
    this.editData = rowData;
  }
}
</script>

<style lang="scss">
.debt-table__row-debt {
  background: #3d8b88;
  color: #fff;

  .debt-table__link {
    color: #fff;
  }
}

.debt-table__icon-button {
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
