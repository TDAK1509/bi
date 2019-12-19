<template>
  <div class="client">
    <page-title>KHÁCH HÀNG: {{ client.name }}</page-title>
    <debt-table :debts="debts" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Client, DebtView, Debt } from "@/models/transaction";
import DebtTable from "@/components/DebtTable.vue";
import PageTitle from "@/components/PageTitle.vue";

@Component({
  components: {
    DebtTable,
    PageTitle
  }
})
export default class ClientView extends Vue {
  get clientId(): string {
    return this.$route.params.clientId;
  }

  get clients(): Client[] {
    return this.$store.state.clients;
  }

  get client(): Client | undefined {
    return this.clients.find((client: Client) => client._id == this.clientId);
  }

  get debts(): DebtView[] {
    if (typeof this.client === "undefined") return [];
    return this.client.debts.map((debt: Debt) => {
      let totalPaid = 0;
      debt.paid_transaction_list.forEach(transaction => {
        totalPaid += transaction.amount;
      });

      return { paid: totalPaid, ...debt };
    });
  }
}
</script>

<style lang="scss" scoped>
.client {
  margin-top: 30px;
}
</style>
