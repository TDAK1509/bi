import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store/";
import { SelectOptions } from "@/models/helpers";

export class OptionsState {
  options: SelectOptions | null = null;
  isFetchingOptions = false;
  isFetchedOptions = false;
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
  }
};

const actions: ActionTree<OptionsState, RootState> = {
  async fetchOptions({ commit, rootState }) {
    commit("setIsFetchingOptions", true);
    const options = await rootState.api.options.getOptions();
    commit("setOptions", options);
    commit("setIsFetchingOptions", false);
    commit("setIsFetchedOptions", true);
  },

  async addSeller({ rootState }, sellerName: string) {
    await rootState.api.options.addOptionSeller(sellerName);
  },

  async addProductName({ rootState }, productName: string) {
    await rootState.api.options.addOptionProductName(productName);
  },

  async addTransactionType({ rootState }, transactionType: string) {
    await rootState.api.options.addOptionTransactionType(transactionType);
  },

  async addPaymentType({ rootState }, paymentType: string) {
    await rootState.api.options.addOptionPaymentType(paymentType);
  }
};

export const options = {
  namespaced: true,
  state: new OptionsState(),
  mutations: mutations,
  actions: actions
};
