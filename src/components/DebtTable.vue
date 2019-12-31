<template>
  <div class="debt-table">
    <b-table
      :data="debts"
      striped
      default-sort="date"
      sort-icon="chevron-up"
      hoverable
      detailed
      show-detail-icon
      detail-key="_id"
    >
      <template slot-scope="props">
        <b-table-column field="date" label="Ngày" sortable>
          {{ props.row.date }}
        </b-table-column>

        <b-table-column field="name" label="Nội Dung Nợ" sortable searchable>
          {{ props.row.name }}
        </b-table-column>

        <b-table-column field="amount" label="Nợ Ban Đầu" sortable numeric>
          {{ props.row.amount | monetize }}
        </b-table-column>

        <b-table-column field="paid" label="Đã Thanh Toán" sortable numeric>
          {{ props.row.paid | monetize }}
        </b-table-column>

        <b-table-column label="Nợ Còn Lại" sortable numeric>
          {{ (props.row.amount - props.row.paid) | monetize }}
        </b-table-column>
      </template>

      <template slot="detail" slot-scope="props">
        <ul
          class="debt-table__transaction-detail-list"
          v-if="props.row.paid_transaction_list.length > 0"
        >
          <li
            class="debt-table__transaction-detail-list-item"
            v-for="transaction in props.row.paid_transaction_list"
            :key="transaction.id"
          >
            <router-link
              class="debt-table__transaction-detail-list-item-link"
              :to="{
                name: 'home',
                query: { transaction_date: transaction.date }
              }"
              >Trả nợ <strong>{{ transaction.amount | monetize }}</strong> vào
              ngày
              <strong>{{ transaction.date }}</strong>
            </router-link>
          </li>
        </ul>

        <div v-else class="debt-table__transaction-detail-empty">
          Thằng này chưa trả nợ
          <b-icon
            class="debt-table__transaction-detail-empty-icon"
            icon="sad-cry"
            size="is-large"
            type="is-danger"
          ></b-icon>
        </div>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon
                icon="laugh-beam"
                pack="fas"
                size="is-large"
                type="is-success"
              ></b-icon>
            </p>
            <p>Không nợ nần gì cả.</p>
          </div>
        </section>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Debt } from "../models/client";
import filtersMixin from "@/mixins/filters";

@Component({
  mixins: [filtersMixin]
})
export default class DebtTable extends Vue {
  @Prop({ type: Array, required: true })
  debts!: Array<Debt>;
}
</script>

<style lang="scss" scoped>
.debt-table__transaction-detail-list {
  display: inline-block;
  margin-left: 50px;
}

.debt-table__transaction-detail-list-item {
  list-style-type: disc;
  padding: 5px 0;
}
.debt-table__transaction-detail-empty {
  display: flex;
  align-items: center;
  justify-content: center;
}
.debt-table__transaction-detail-empty-icon {
  margin-left: 20px;
}
</style>
