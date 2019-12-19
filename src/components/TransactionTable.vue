<template>
  <div>
    <b-table
      striped
      default-sort="date"
      sort-icon="chevron-up"
      :data="transactions"
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
          <b-tooltip label="Xem chi tiết khách hàng" type="is-dark">
            <router-link :to="`/client/${props.row.client_id}`">{{
              props.row.client_name
            }}</router-link>
          </b-tooltip>
        </b-table-column>

        <b-table-column
          field="name"
          label="Nội Dung Giao Dịch"
          sortable
          searchable
        >
          {{ props.row.name }}
        </b-table-column>

        <b-table-column field="type" label="Loại Giao Dịch" sortable>
          {{ props.row.type }}
        </b-table-column>

        <b-table-column field="amount" label="Thành Tiền" sortable numeric>
          {{ props.row.amount | monetize }}
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
import { Component, Vue, Prop } from "vue-property-decorator";
import { TransactionView } from "../models/transaction";
import filtersMixin from "@/mixins/filters";

@Component({
  mixins: [filtersMixin]
})
export default class TransactionTable extends Vue {
  @Prop({ type: Array, required: true })
  transactions!: Array<TransactionView>;
}
</script>
