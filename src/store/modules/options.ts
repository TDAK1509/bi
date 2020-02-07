import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store/";
import { SelectOptions, VueSelectOption } from "@/models/helpers";

export class OptionsState {
  options: SelectOptions = {};

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

  async addSeller({ state, rootState }, sellerName: string) {
    state.options.sellers.push(sellerName);
    await rootState.api.options.addOptionSeller(state.options.sellers);
  },

  async addProductName({ state, rootState }, payload: string) {
    state.options.product_names.push(payload);
    await rootState.api.options.addOptionProductName(
      state.options.product_names
    );
  },

  async addTransactionType({ state, rootState }, payload: string) {
    state.options.transaction_types.push(payload);
    await rootState.api.options.addOptionTransactionType(
      state.options.transaction_types
    );
  },

  async addPaymentType({ state, rootState }, payload: string) {
    state.options.payment_types.push(payload);
    await rootState.api.options.addOptionPaymentType(
      state.options.payment_types
    );
  }
};

export const options = {
  namespaced: true,
  state: new OptionsState(),
  mutations: mutations,
  actions: actions
};
