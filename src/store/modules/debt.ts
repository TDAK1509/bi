import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store/";
import { Transaction, TransactionView } from "@/models/transaction";

export class DebtState {
  debts: TransactionView[] = []; // Transaction which has is_debt = true
  filterDateStart = new Date();
  filterDateEnd = new Date();
  isUpdatingDebt = false;
  isFetchingDebts = false;
  isFetchedDebts = false;
}

const mutations: MutationTree<DebtState> = {
  setFilterDateStart(state, payload: Date) {
    state.filterDateStart = payload;
  },
  setFilterDateEnd(state, payload: Date) {
    state.filterDateEnd = payload;
  },
  setDebts(state, payload: TransactionView[]) {
    state.debts = payload;
  },
  setIsFetchingDebts(state, payload: boolean) {
    state.isFetchingDebts = payload;
  },
  setIsFetchedDebts(state, payload: boolean) {
    state.isFetchedDebts = payload;
  },
  setIsUpdatingDebt(state, payload: boolean) {
    state.isUpdatingDebt = payload;
  }
};

const actions: ActionTree<DebtState, RootState> = {
  async fetchDebts({ commit, state, rootState }) {
    commit("setIsFetchingDebts", true);

    rootState.api.debt.fetchDebts(
      commit,
      "setDebts",
      state.filterDateStart,
      state.filterDateEnd,
      [
        () => commit("setIsFetchingDebts", false),
        () => commit("setIsFetchedDebts", true)
      ]
    );
  }
};

export const debt = {
  namespaced: true,
  state: new DebtState(),
  mutations: mutations,
  actions: actions
};
