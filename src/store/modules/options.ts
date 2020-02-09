import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store/";
import { SelectOptions } from "@/models/helpers";

export class OptionsState {
  options: SelectOptions | null = null;
  isFetchingOptions = false;
  isFetchedOptions = false;
  isAddingOption = false;
}

const mutations: MutationTree<OptionsState> = {
  setOptions(state, payload: SelectOptions) {
    state.options = payload;
  },
  setIsFetchingOptions(state, payload: boolean) {
    state.isFetchingOptions = payload;
  },
  setIsFetchedOptions(state, payload: boolean) {
    state.isFetchedOptions = payload;
  },
  setIsAddingOption(state, payload: boolean) {
    state.isAddingOption = payload;
  }
};

const actions: ActionTree<OptionsState, RootState> = {
  async fetchOptions({ commit, rootState }) {
    commit("setIsFetchedOptions", false);
    commit("setIsFetchingOptions", true);
    rootState.api.options.fetchOptions(commit, "setOptions", [
      () => commit("setIsFetchingOptions", false),
      () => commit("setIsFetchedOptions", true)
    ]);
  },

  async addClient({ commit, rootState }, clientName: string) {
    commit("setIsAddingOptions", true);
    await rootState.api.options.addOptionClient(clientName);
    commit("setIsAddingOptions", false);
  },

  async addSeller({ commit, rootState }, sellerName: string) {
    commit("setIsAddingOptions", true);
    await rootState.api.options.addOptionSeller(sellerName);
    commit("setIsAddingOptions", false);
  },

  async addProductName({ commit, rootState }, productName: string) {
    commit("setIsAddingOptions", true);
    await rootState.api.options.addOptionProductName(productName);
    commit("setIsAddingOptions", false);
  },

  async addTransactionType({ commit, rootState }, transactionType: string) {
    commit("setIsAddingOptions", true);
    await rootState.api.options.addOptionTransactionType(transactionType);
    commit("setIsAddingOptions", false);
  },

  async addPaymentType({ commit, rootState }, paymentType: string) {
    commit("setIsAddingOptions", true);
    await rootState.api.options.addOptionPaymentType(paymentType);
    commit("setIsAddingOptions", false);
  }
};

export const options = {
  namespaced: true,
  state: new OptionsState(),
  mutations: mutations,
  actions: actions
};
