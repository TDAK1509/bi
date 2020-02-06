import Vue from "vue";
import Vuex from "vuex";
import { Transaction, TransactionView } from "@/models/transaction";
import {
  Client,
  ClientView,
  DebtTransaction,
  ClientInfo
} from "@/models/client";
import { SelectOptions, ErrorMessage, VueSelectOption } from "@/models/helpers";
import * as API from "@/api/api-methods";
import { formatDateToString } from "@/utils/date";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    transactions: <Array<TransactionView>>[],
    filterDateStart: new Date(),
    filterDateEnd: new Date(),
    clients: <Array<ClientView>>[],
    options: <SelectOptions>{},
    isFetchingClients: false,
    isFetchingOptions: false,
    isFetchingTransactions: false,
    isFetchedClients: false,
    isFetchedOptions: false,
    isFetchedTransactions: false,
    isLoggedIn: false,
    userEmail: ""
  },

  getters: {
    optionClients(state): VueSelectOption[] {
      const options: VueSelectOption[] = [];
      state.clients.forEach((client: ClientView) => {
        const value: ClientInfo = { id: client.id, name: client.name };
        const label = client.name;
        options.push({ value, label });
      });
      return options;
    }
  },

  mutations: {
    setTransactions(state, payload: TransactionView[]) {
      state.transactions = payload;
    },
    setClients(state, payload: ClientView[]) {
      state.clients = payload;
    },
    setOptions(state, payload: SelectOptions) {
      state.options = payload;
    },
    setIsFetchingClients(state, payload: boolean) {
      state.isFetchingClients = payload;
    },
    setIsFetchingOptions(state, payload: boolean) {
      state.isFetchingOptions = payload;
    },
    setIsFetchingTransactions(state, payload: boolean) {
      state.isFetchingTransactions = payload;
    },
    setIsFetchedClients(state, payload: boolean) {
      state.isFetchedClients = payload;
    },
    setIsFetchedOptions(state, payload: boolean) {
      state.isFetchedOptions = payload;
    },
    setIsFetchedTransactions(state, payload: boolean) {
      state.isFetchedTransactions = payload;
    },
    setFilterDateStart(state, payload: Date) {
      state.filterDateStart = payload;
    },
    setFilterDateEnd(state, payload: Date) {
      state.filterDateEnd = payload;
    },
    setIsLoggedIn(state, payload: boolean) {
      state.isLoggedIn = payload;
    },
    setUserEmail(state, payload: string) {
      state.userEmail = payload;
    }
  },

  actions: {
    async init({ state, dispatch }) {
      if (!state.isFetchedClients) await dispatch("fetchClients");
    },

    async fetchTransactions({ commit, state }) {
      commit("setIsFetchingTransactions", true);
      const transactions: TransactionView[] = await API.fetchTransactions(
        state.filterDateStart,
        state.filterDateEnd
      );
      commit("setTransactions", transactions);
      commit("setIsFetchingTransactions", false);
      commit("setIsFetchedTransactions", true);
    },

    async fetchClients({ commit }) {
      commit("setIsFetchingClients", true);
      const clients: ClientView[] = await API.fetchClients();
      commit("setClients", clients);
      commit("setIsFetchingClients", false);
      commit("setIsFetchedClients", true);
    },

    async fetchOptions({ commit }) {
      commit("setIsFetchingOptions", true);
      const options = await API.getOptions();
      commit("setOptions", options);
      commit("setIsFetchingOptions", false);
      commit("setIsFetchedOptions", true);
    },

    async addTransaction(
      { state, commit },
      transaction: Transaction
    ): Promise<String> {
      const transactionId = await API.addTransaction(transaction);

      const transactionView: TransactionView = {
        id: transactionId,
        ...transaction
      };

      commit("setTransactions", [...state.transactions, transactionView]);
      return transactionId;
    },

    async addClient({ state, commit }, clientName: string) {
      const newClientInfo: Client = {
        name: clientName,
        date: formatDateToString(new Date()),
        debts: []
      };

      const clientId = await API.addClient(newClientInfo);
      const client: ClientView = {
        id: clientId,
        ...newClientInfo
      };

      commit("setClients", [...state.clients, client]);
    },

    async addDebt({ state }, { clientId, debt }) {
      await API.addDebt(clientId, debt);
      const clientToAdd: ClientView | undefined = state.clients.find(
        (client: ClientView) => client.id === clientId
      );
      // No need to commit because clientToAdd is not cloned
      if (typeof clientToAdd !== "undefined") clientToAdd.debts.push(debt);
    },

    async updateDebt(
      { state },
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

      await API.updateDebts(clientId, clientToUpdate.debts);
    },

    async addSeller({ state }, sellerName: string) {
      state.options.sellers.push(sellerName);
      await API.addOptionSeller(state.options.sellers);
    },

    async addProductName({ state }, payload: string) {
      state.options.product_names.push(payload);
      await API.addOptionProductName(state.options.product_names);
    },

    async addTransactionType({ state }, payload: string) {
      state.options.transaction_types.push(payload);
      await API.addOptionTransactionType(state.options.transaction_types);
    },

    async addPaymentType({ state }, payload: string) {
      state.options.payment_types.push(payload);
      await API.addOptionPaymentType(state.options.payment_types);
    },

    async login({ commit }, { username, password }): Promise<Boolean> {
      const loggedIn = await API.login(username, password);
      commit("setIsLoggedIn", loggedIn);
      commit("setUserEmail", username);
      return loggedIn;
    },

    async changePassword(
      { dispatch, state },
      { oldPassword, newPassword }
    ): Promise<ErrorMessage> {
      const loggedIn = await dispatch("login", {
        username: state.userEmail,
        password: oldPassword
      });

      if (!loggedIn) {
        return {
          success: false,
          message: "Password cũ không chính xác"
        };
      }

      return await API.changePassword(newPassword);
    }
  }
});
