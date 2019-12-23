<template>
  <div class="client">
    <page-title>KHÁCH HÀNG: {{ client.name }}</page-title>
    <debt-table :debts="debts" />
    <add-button @click="isShowAddModal = true" />

    <b-modal :active.sync="isShowAddModal" has-modal-card trap-focus aria-role="dialog" aria-modal>
      <debt-modal-add :is-adding-debt="isAddingDebt" @add-debt="addDebt" />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Client, DebtView, Debt } from "@/models/transaction";
import DebtTable from "@/components/DebtTable.vue";
import PageTitle from "@/components/PageTitle.vue";
import AddButton from "@/components/AddButton.vue";
import DebtModalAdd from "@/components/DebtModalAdd.vue";

@Component({
  components: {
    DebtTable,
    PageTitle,
    AddButton,
    DebtModalAdd
  }
})
export default class ClientView extends Vue {
  isShowAddModal = false;
  isAddingDebt = false;

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

  async addDebt(debt: Debt) {
    this.isAddingDebt = true;

    await this.$store.dispatch("addDebt", {
      clientId: this.clientId,
      debt
    });

    this.isAddingDebt = false;

    this.$buefy.toast.open({
      message: `Thêm nợ thành công!`,
      type: "is-success"
    });

    this.isShowAddModal = false;
  }
}
</script>

<style lang="scss" scoped>
.client {
  margin-top: 30px;
}
</style>
