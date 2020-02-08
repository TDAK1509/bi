import Vue from "vue";
import Vuex, { ActionTree } from "vuex";
import { api, ApiState } from "@/store/modules/api";
import { options, OptionsState } from "@/store/modules/options";
import { transaction, TransactionState } from "@/store/modules/transaction";
import { auth, AuthState } from "@/store/modules/auth";

Vue.use(Vuex);

export interface RootState {
  api: ApiState;
  options: OptionsState;
  transaction: TransactionState;
  auth: AuthState;
}

const actions: ActionTree<RootState, RootState> = {};

export default new Vuex.Store<RootState>({
  modules: {
    api,
    options,
    transaction,
    auth
  },

  actions
});
