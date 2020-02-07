import Vue from "vue";
import Vuex, { ActionTree } from "vuex";
import { api, ApiState } from "@/store/modules/api";
import { client, ClientState } from "@/store/modules/client";
import { options, OptionsState } from "@/store/modules/options";
import { transaction, TransactionState } from "@/store/modules/transaction";

Vue.use(Vuex);

export interface RootState {
  api: ApiState;
  client: ClientState;
  options: OptionsState;
  transaction: TransactionState;
}

const actions: ActionTree<RootState, RootState> = {
  async init({ dispatch }) {
    await dispatch("client/fetchClients");
  }
};

export default new Vuex.Store<RootState>({
  modules: {
    api,
    client,
    options,
    transaction
  },

  actions
});
