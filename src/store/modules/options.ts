import { MutationTree, ActionTree, GetterTree } from "vuex";
import { RootState } from "@/store/";
import { SelectOptions, Product } from "@/models/helpers";

export class OptionsState {
  options: SelectOptions | null = null;
  editingProducts: Product[] = [];
  isFetchingOptions = false;
  isFetchedOptions = false;
  isAddingOption = false;
  isUpdatingStock = false;
}

const getters: GetterTree<OptionsState, RootState> = {
  productNames(state): string[] {
    if (state.options === null) return [];
    return state.options.product_names.map((product: Product) => product.name);
  }
};

const mutations: MutationTree<OptionsState> = {
  setOptions(state, payload: SelectOptions) {
    state.options = payload;
    state.editingProducts = payload.product_names;
  },
  setEditingProducts(state, payload: Product[]) {
    state.editingProducts = payload;
  },
  setIsFetchingOptions(state, payload: boolean) {
    state.isFetchingOptions = payload;
  },
  setIsFetchedOptions(state, payload: boolean) {
    state.isFetchedOptions = payload;
  },
  setIsAddingOption(state, payload: boolean) {
    state.isAddingOption = payload;
  },
  setIsUpdatingStock(state, payload: boolean) {
    state.isUpdatingStock = payload;
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

  async updateStock({ commit, rootState }, products: Product[]) {
    commit("setIsUpdatingStock", true);
    await rootState.api.options.updateStock(products);
    commit("setIsUpdatingStock", false);
  },

  async addClient({ commit, rootState }, clientName: string) {
    commit("setIsAddingOption", true);
    await rootState.api.options.addOptionClient(clientName);
    commit("setIsAddingOption", false);
  },

  async addSeller({ commit, rootState }, sellerName: string) {
    commit("setIsAddingOption", true);
    await rootState.api.options.addOptionSeller(sellerName);
    commit("setIsAddingOption", false);
  },

  async addProductName({ commit, rootState }, productName: string) {
    commit("setIsAddingOption", true);
    await rootState.api.options.addOptionProductName(productName);
    commit("setIsAddingOption", false);
  },

  async addTransactionType({ commit, rootState }, transactionType: string) {
    commit("setIsAddingOption", true);
    await rootState.api.options.addOptionTransactionType(transactionType);
    commit("setIsAddingOption", false);
  },

  async addPaymentType({ commit, rootState }, paymentType: string) {
    commit("setIsAddingOption", true);
    await rootState.api.options.addOptionPaymentType(paymentType);
    commit("setIsAddingOption", false);
  }
};

export const options = {
  namespaced: true,
  state: new OptionsState(),
  mutations: mutations,
  actions: actions,
  getters
};
