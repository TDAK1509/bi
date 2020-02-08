<template>
  <div class="transaction-table">
    <b-table
      paginated
      per-page="10"
      default-sort="date"
      sort-icon="chevron-up"
      :data="transactions"
      :row-class="getIsDebtClass"
    >
      >
      <template slot-scope="props">
        <b-table-column field="date" label="Ngày" sortable>
          {{ props.row.date }}
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
          <b-tooltip
            v-if="props.row.is_transaction_debt === true"
            label="Đây là giao dịch trả nợ"
            type="is-warning"
            position="is-left"
          >
            {{ props.row.amount | monetize }}
          </b-tooltip>

          <span v-else>{{ props.row.amount | monetize }}</span>
        </b-table-column>

        <b-table-column>
          <button class="transaction-table__icon-button">
            <b-icon icon="edit" pack="far" size="is-small" />
          </button>

          <button
            class="transaction-table__icon-button"
            @click="onDelete(props.row.id)"
          >
            <b-icon icon="trash" size="is-small" />
          </button>
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon icon="sad-tear" pack="fas" size="is-large"></b-icon>
            </p>
            <p>Không có giao dịch nào.</p>
          </div>
        </section>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { TransactionView } from "../models/transaction";
import filtersMixin from "@/mixins/filters";

@Component({
  mixins: [filtersMixin]
})
export default class TransactionTable extends Vue {
  @Prop({ type: Array, required: true })
  transactions!: Array<TransactionView>;

  getIsDebtClass(row: TransactionView, index: number): string {
    if (row.is_transaction_debt === true) {
      return "transaction-table__row-debt";
    }
    return "";
  }

  @Emit("delete")
  onDelete(transactionId: string) {}
}
</script>

<style lang="scss">
.transaction-table__row-debt {
  background: #3d8b88;
  color: #fff;

  .transaction-table__link {
    color: #fff;
  }
}

.transaction-table__icon-button {
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
