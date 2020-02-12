import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store/";
import { Transaction, TransactionView } from "@/models/transaction";
import { TransactionSearchQuery } from "@/models/search";

export class TransactionState {
  transactions: TransactionView[] = [];
  isFetchingTransactions = false;
  isDeletingTransaction = false;
  isUpdatingTransaction = false;
  isAddingTransaction = false;
}

const mutations: MutationTree<TransactionState> = {
  setTransactions(state, payload: TransactionView[]) {
    state.transactions = payload;
  },
  setIsFetchingTransactions(state, payload: boolean) {
    state.isFetchingTransactions = payload;
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
  async fetchTransactions(
    { commit, rootState },
    searchQuery: TransactionSearchQuery
  ) {
    commit("setIsFetchingTransactions", true);

    rootState.api.transaction.fetchTransactions(
      commit,
      "setTransactions",
      searchQuery,
      [() => commit("setIsFetchingTransactions", false)]
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
    if (!rootState.auth.isAdmin) {
      return false;
    }

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
    if (!rootState.auth.isAdmin) {
      return false;
    }

    commit("setIsUpdatingTransaction", true);
    await rootState.api.transaction.updateTransaction(transaction);
    commit("setIsUpdatingTransaction", false);
    return true;
  }
};

export const transaction = {
  namespaced: true,
  state: new TransactionState(),
  mutations: mutations,
  actions: actions
};
