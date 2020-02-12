import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store/";
import { TransactionView } from "@/models/transaction";

export class DebtState {
  debts: TransactionView[] = []; // Transaction which has is_debt = true
  startDate: string = "";
  endDate: string = "";
  isUpdatingDebt = false;
  isFetchingDebts = false;
  isFetchedDebts = false;
}

const mutations: MutationTree<DebtState> = {
  setStartDate(state, payload: string) {
    state.startDate = payload;
  },
  setEndDate(state, payload: string) {
    state.endDate = payload;
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
      state.startDate,
      state.endDate,
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
