import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store/";
import { Transaction, TransactionView } from "@/models/transaction";
import { TransactionSearchQuery } from "@/models/search";
import { Product } from "@/models/helpers";

export class TransactionState {
  transactions: TransactionView[] = [];
  isFetchingTransactions = false;
  isDeletingTransaction = false;
  isUpdatingTransaction = false;
  isAddingTransaction = false;
  startDate: string = "";
  endDate: string = "";
}

const mutations: MutationTree<TransactionState> = {
  setTransactions(state, payload: TransactionView[]) {
    state.transactions = payload;
  },
  setStartDate(state, payload: string) {
    state.startDate = payload;
  },
  setEndDate(state, payload: string) {
    state.endDate = payload;
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
      [
        () => commit("setStartDate", searchQuery.start_date),
        () => commit("setEndDate", searchQuery.end_date),
        () => commit("setIsFetchingTransactions", false)
      ]
    );
  },

  async addTransaction(
    { commit, rootState, dispatch },
    transaction: Transaction
  ): Promise<String> {
    commit("setIsAddingTransaction", true);
    const transactionId = await rootState.api.transaction.addTransaction(
      transaction
    );

    await dispatch("updateStock", transaction);

    commit("setIsAddingTransaction", false);
    return transactionId;
  },

  async updateStock({ rootState }, transaction: TransactionView | Transaction) {
    const products: Product[] = [...rootState.options.options!.product_names];

    for (let i = 0; i < products.length; i++) {
      if (products[i].name === transaction.product_name) {
        products[i].stock -= parseInt(transaction.product_quantity);
        break;
      }
    }

    return rootState.api.options.updateStock(products);
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

  async updateTransaction(
    { commit, rootState, dispatch },
    transaction: TransactionView
  ) {
    if (!rootState.auth.isAdmin) {
      return false;
    }

    commit("setIsUpdatingTransaction", true);
    await rootState.api.transaction.updateTransaction(transaction);
    await dispatch("updateStock", transaction);
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
