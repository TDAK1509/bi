import Vue from "vue";
import Vuex, { ActionTree } from "vuex";
import { api, ApiState } from "@/store/modules/api";
import { options, OptionsState } from "@/store/modules/options";
import { transaction, TransactionState } from "@/store/modules/transaction";
import { debt, DebtState } from "@/store/modules/debt";
import { auth, AuthState } from "@/store/modules/auth";
import { cost, CostState } from "@/store/modules/cost";

Vue.use(Vuex);

export interface RootState {
  auth: AuthState;
  api: ApiState;
  options: OptionsState;
  transaction: TransactionState;
  debt: DebtState;
  cost: CostState;
}

const actions: ActionTree<RootState, RootState> = {};

export default new Vuex.Store<RootState>({
  modules: {
    auth,
    api,
    options,
    transaction,
    debt,
    cost
  },

  actions
});
