import { MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState } from "@/store/";
import {
  Client,
  ClientView,
  ClientInfo,
  DebtTransaction
} from "@/models/client";
import { VueSelectOption } from "@/models/helpers";
import { formatDateToString } from "@/utils/date";

export class ClientState {
  clients: ClientView[] = [];
  isFetchingClients = false;
  isFetchedClients = false;
}

const getters: GetterTree<ClientState, RootState> = {
  optionClients(state): VueSelectOption[] {
    const options: VueSelectOption[] = [];
    state.clients.forEach((client: ClientView) => {
      const value: ClientInfo = { id: client.id, name: client.name };
      const label = client.name;
      options.push({ value, label });
    });
    return options;
  }
};

const mutations: MutationTree<ClientState> = {
  setClients(state, payload: ClientView[]) {
    state.clients = payload;
  },
  setIsFetchingClients(state, payload: boolean) {
    state.isFetchingClients = payload;
  },
  setIsFetchedClients(state, payload: boolean) {
    state.isFetchedClients = payload;
  }
};

const actions: ActionTree<ClientState, RootState> = {
  fetchClients({ commit, rootState }) {
    commit("setIsFetchingClients", true);
    rootState.api.client.fetchClients(commit, "setClients", [
      () => commit("setIsFetchingClients", false),
      () => commit("setIsFetchedClients", true)
    ]);
  },

  async addClient({ rootState }, clientName: string) {
    const newClientInfo: Client = {
      name: clientName,
      date: formatDateToString(new Date()),
      debts: []
    };

    await rootState.api.client.addClient(newClientInfo);
  },

  async addDebt({ rootState }, { clientId, debt }) {
    await rootState.api.debt.addDebt(clientId, debt);
  },

  async updateDebt(
    { state, rootState },
    { clientId, debtId, transactionId, amount, transactionDate }
  ) {
    const clientToUpdate: ClientView | undefined = state.clients.find(
      (client: ClientView) => client.id === clientId
    );

    if (typeof clientToUpdate === "undefined") {
      return;
    }

    const debtTransaction: DebtTransaction = {
      id: transactionId,
      amount: amount,
      date: transactionDate
    };

    clientToUpdate.debts[debtId].paid_transaction_list.push(debtTransaction);

    await rootState.api.debt.updateDebts(clientId, clientToUpdate.debts);
  }
};

export const client = {
  namespaced: true,
  state: new ClientState(),
  mutations: mutations,
  actions: actions,
  getters
};
