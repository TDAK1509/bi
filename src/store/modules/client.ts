import { MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState } from "@/store/";
import { Client, ClientView, ClientInfo } from "@/models/client";
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

const mutations = <MutationTree<ClientState>>{
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

const actions = <ActionTree<ClientState, RootState>>{
  async fetchClients({ commit, rootState }) {
    commit("setIsFetchingClients", true);
    const clients: ClientView[] = await rootState.api.client.fetchClients();
    commit("setClients", clients);
    commit("setIsFetchingClients", false);
    commit("setIsFetchedClients", true);
  },

  async addClient({ state, commit, rootState }, clientName: string) {
    const newClientInfo: Client = {
      name: clientName,
      date: formatDateToString(new Date()),
      debts: []
    };

    const clientId = await rootState.api.client.addClient(newClientInfo);
    const client: ClientView = {
      id: clientId,
      ...newClientInfo
    };

    commit("setClients", [...state.clients, client]);
  }
};

export const client = {
  namespaced: true,
  state: new ClientState(),
  mutations: mutations,
  actions: actions,
  getters
};
