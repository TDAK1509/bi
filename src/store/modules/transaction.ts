import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store/";
import { Transaction, TransactionView } from "@/models/transaction";

export class TransactionState {
  transactions: TransactionView[] = [];
  filterDateStart = new Date();
  filterDateEnd = new Date();
  isFetchingTransactions = false;
  isFetchedTransactions = false;
  isDeletingTransaction = false;
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
  }
};

const actions: ActionTree<TransactionState, RootState> = {
  async fetchTransactions({ commit, state, rootState }) {
    commit("setIsFetchingTransactions", true);
    const transactions: TransactionView[] = await rootState.api.transaction.fetchTransactions(
      state.filterDateStart,
      state.filterDateEnd
    );
    commit("setTransactions", transactions);
    commit("setIsFetchingTransactions", false);
    commit("setIsFetchedTransactions", true);

    rootState.api.transaction.setRealtimeUpdateTransactions(
      commit,
      "setTransactions",
      state.filterDateStart,
      state.filterDateEnd
    );
  },

  async addTransaction(
    { rootState },
    transaction: Transaction
  ): Promise<String> {
    const transactionId = await rootState.api.transaction.addTransaction(
      transaction
    );
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
  }
};

export const transaction = {
  namespaced: true,
  state: new TransactionState(),
  mutations: mutations,
  actions: actions
};
