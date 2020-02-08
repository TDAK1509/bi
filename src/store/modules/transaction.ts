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
  isUpdatingDebt = false;
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
  setIsUpdatingDebt(state, payload: boolean) {
    state.isUpdatingDebt = payload;
  }
};

const actions: ActionTree<TransactionState, RootState> = {
  async fetchTransactions({ commit, state, rootState }) {
    commit("setIsFetchingTransactions", true);

    rootState.api.transaction.fetchTransactions(
      commit,
      "setTransactions",
      state.filterDateStart,
      state.filterDateEnd,
      [
        () => commit("setIsFetchingTransactions", false),
        () => commit("setIsFetchedTransactions", true)
      ]
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
  },

  async updateDebtAmount({ commit, rootState }, { transactionId, debtAmount }) {
    commit("setIsUpdatingDebt", true);
    await rootState.api.debt.updateDebtAmount(transactionId, debtAmount);
    commit("setIsUpdatingDebt", false);
  },

  async updateDebtStatus({ commit, rootState }, { transactionId, isDebt }) {
    commit("setIsUpdatingDebt", true);
    await rootState.api.debt.updateDebtStatus(transactionId, isDebt);
    commit("setIsUpdatingDebt", false);
  }
};

export const transaction = {
  namespaced: true,
  state: new TransactionState(),
  mutations: mutations,
  actions: actions
};
