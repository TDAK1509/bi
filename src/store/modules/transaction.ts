import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store/";
import { Transaction, TransactionView } from "@/models/transaction";
import { SearchQuery } from "@/models/search";

export class TransactionState {
  transactions: TransactionView[] = [];
  filterDateStart = new Date();
  filterDateEnd = new Date();
  isFetchingTransactions = false;
  isFetchedTransactions = false;
  isDeletingTransaction = false;
  isUpdatingTransaction = false;
  isAddingTransaction = false;
}

const mutations: MutationTree<TransactionState> = {
  setFilterDateStart(state, payload: Date) {
    state.filterDateStart = payload;
  },
  setFilterDateEnd(state, payload: Date) {
    state.filterDateEnd = payload;
  },
  setTransactions(state, payload: TransactionView[]) {
    state.transactions = payload;
  },
  setIsFetchingTransactions(state, payload: boolean) {
    state.isFetchingTransactions = payload;
  },
  setIsFetchedTransactions(state, payload: boolean) {
    state.isFetchedTransactions = payload;
  },
  setIsDeletingTransaction(state, payload: boolean) {
    state.isDeletingTransaction = payload;
  },
  setIsUpdatingTransaction(state, payload: boolean) {
    state.isUpdatingTransaction = payload;
  },
  setIsAddingTransaction(state, payload: boolean) {
    state.isAddingTransaction = payload;
  }
};

const actions: ActionTree<TransactionState, RootState> = {
  async fetchTransactions({ commit, rootState }, searchQuery: SearchQuery) {
    commit("setIsFetchingTransactions", true);

    rootState.api.transaction.fetchTransactions(
      commit,
      "setTransactions",
      searchQuery,
      [
        () => commit("setIsFetchingTransactions", false),
        () => commit("setIsFetchedTransactions", true)
      ]
    );
  },

  async addTransaction(
    { commit, rootState },
    transaction: Transaction
  ): Promise<String> {
    commit("setIsAddingTransaction", true);
    const transactionId = await rootState.api.transaction.addTransaction(
      transaction
    );
    commit("setIsAddingTransaction", false);
    return transactionId;
  },

  async deleteTransaction(
    { commit, rootState },
    transactionId: string
  ): Promise<boolean> {
    try {
      commit("setIsDeletingTransaction", true);
      await rootState.api.transaction.deleteTransaction(transactionId);
      commit("setIsDeletingTransaction", false);
      return true;
    } catch (error) {
      return false;
    }
  },

  async updateTransaction({ commit, rootState }, transaction: TransactionView) {
    commit("setIsUpdatingTransaction", true);
    await rootState.api.transaction.updateTransaction(transaction);
    commit("setIsUpdatingTransaction", false);
  }
};

export const transaction = {
  namespaced: true,
  state: new TransactionState(),
  mutations: mutations,
  actions: actions
};
