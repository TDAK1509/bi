import Vue from "vue";
import Vuex from "vuex";
import {
  TransactionView,
  Client,
  ClientInfo,
  ClientToAddToDatabase
} from "@/models/transaction";
import * as API from "@/api/api-methods";
import { formatDateToString } from "@/utils/date";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    clients: <Array<Client>>[],
    filterValue: <Number>new Date().getMonth()
  },

  getters: {
    transactionViews: function(state): TransactionView[] {
      const clients = state.clients;

      let transactionViews: TransactionView[] = [];

      clients.forEach(client => {
        // Convert Transaction[] to TransactionView[]
        const transactionViewsOfThisClient: TransactionView[] = client.transactions.map(
          transaction => {
            return {
              client_id: client._id,
              client_name: client.name,
              ...transaction
            };
          }
        );

        transactionViews = [
          ...transactionViews,
          ...transactionViewsOfThisClient
        ];
      });

      return transactionViews;
    },

    transactionViewsThisMonth: function(state, getters): TransactionView[] {
      return getters.transactionViews.filter(
        (transactionView: TransactionView) => {
          const date = new Date(transactionView.date);
          return date.getMonth() === state.filterValue;
        }
      );
    },

    transactionViewsThisYear: function(state, getters): TransactionView[] {
      return getters.transactionViews.filter(
        (transactionView: TransactionView) => {
          const date = new Date(transactionView.date);
          return date.getFullYear() === state.filterValue;
        }
      );
    },

    clientList: function(state): ClientInfo[] {
      const clientList: ClientInfo[] = [];
      state.clients.forEach(client => {
        clientList.push({ id: client._id, name: client.name });
      });
      return clientList;
    }
  },

  mutations: {
    setClients(state, payload: Array<Client>) {
      state.clients = payload;
    },
    setFilterValue(state, payload: number) {
      state.filterValue = payload;
    }
  },

  actions: {
    async fetchClients({ commit }) {
      const clients: Client[] = await API.getAllClients();
      commit("setClients", clients);
    },

    async addTransaction({ state }, { clientId, transaction }) {
      await API.addTransaction(clientId, transaction);

      const clientToAdd: Client | undefined = state.clients.find(
        (client: Client) => client._id === clientId
      );

      // No need to commit because clientToAdd is not cloned
      if (typeof clientToAdd !== "undefined")
        clientToAdd.transactions.push(transaction);
    },

    async addClient({ state, commit }, clientName: string) {
      const newClientInfo: ClientToAddToDatabase = {
        name: clientName,
        created_at: formatDateToString(new Date()),
        transactions: [],
        debts: []
      };
      const clientId = await API.addClient(newClientInfo);

      const client: Client = {
        _id: clientId,
        ...newClientInfo
      };

      commit("setClients", [...state.clients, client]);
    },

    async addDebt({ state }, { clientId, debt }) {
      await API.addDebt(clientId, debt);

      const clientToAdd: Client | undefined = state.clients.find(
        (client: Client) => client._id === clientId
      );

      // No need to commit because clientToAdd is not cloned
      if (typeof clientToAdd !== "undefined") clientToAdd.debts.push(debt);
    }
  }
});
