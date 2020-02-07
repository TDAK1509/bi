import Vue from "vue";
import Vuex, { ActionTree } from "vuex";
import { api, ApiState } from "@/store/modules/api";

Vue.use(Vuex);

export interface RootState {
  api: ApiState;
}

const actions: ActionTree<RootState, RootState> = {};

export default new Vuex.Store<RootState>({
  modules: {
    api
  },

  actions
});
