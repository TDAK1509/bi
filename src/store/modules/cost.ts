import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store/";
import { Cost, CostView } from "@/models/cost";
import { CostSearchQuery } from "@/models/search";

export class CostState {
  costs: Cost[] = [];
  isFetchingCosts = false;
  isDeletingCost = false;
  isUpdatingCost = false;
  isAddingCost = false;
}

const mutations: MutationTree<CostState> = {
  setCosts(state, payload: Cost[]) {
    state.costs = payload;
  },
  setIsFetchingCosts(state, payload: boolean) {
    state.isFetchingCosts = payload;
  },
  setIsDeletingCost(state, payload: boolean) {
    state.isDeletingCost = payload;
  },
  setIsUpdatingCost(state, payload: boolean) {
    state.isUpdatingCost = payload;
  },
  setIsAddingCost(state, payload: boolean) {
    state.isAddingCost = payload;
  }
};

const actions: ActionTree<CostState, RootState> = {
  async fetchCosts({ commit, rootState }, searchQuery: CostSearchQuery) {
    commit("setIsFetchingCosts", true);

    rootState.api.cost.fetchCosts(commit, "setCosts", searchQuery, [
      () => commit("setIsFetchingCosts", false)
    ]);
  },

  async addCost({ commit, rootState }, cost: Cost): Promise<String> {
    commit("setIsAddingCost", true);
    const costId = await rootState.api.cost.addCost(cost);
    commit("setIsAddingCost", false);
    return costId;
  },

  async removeCost({ commit, rootState }, costId: string): Promise<boolean> {
    if (!rootState.auth.isAdmin) {
      return false;
    }

    try {
      commit("setIsDeletingCost", true);
      await rootState.api.cost.removeCost(costId);
      commit("setIsDeletingCost", false);
      return true;
    } catch (error) {
      return false;
    }
  },

  async updateCost({ commit, rootState }, cost: CostView) {
    if (!rootState.auth.isAdmin) {
      return false;
    }

    commit("setIsUpdatingCost", true);
    await rootState.api.cost.updateCost(cost);
    commit("setIsUpdatingCost", false);
    return true;
  }
};

export const cost = {
  namespaced: true,
  state: new CostState(),
  mutations: mutations,
  actions: actions
};
