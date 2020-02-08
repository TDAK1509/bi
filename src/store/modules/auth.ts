import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store/";
import { ErrorMessage } from "@/models/helpers";

export class AuthState {
  isLoggedIn = false;
  userEmail = "";
}

const mutations: MutationTree<AuthState> = {
  setIsLoggedIn(state, payload: boolean) {
    state.isLoggedIn = payload;
  },
  setUserEmail(state, payload: string) {
    state.userEmail = payload;
  }
};

const actions: ActionTree<AuthState, RootState> = {
  async login({ commit, rootState }, { username, password }): Promise<Boolean> {
    const loggedIn = await rootState.api.auth.login(username, password);
    commit("setIsLoggedIn", loggedIn);
    commit("setUserEmail", username);
    return loggedIn;
  },

  async changePassword(
    { dispatch, state, rootState },
    { oldPassword, newPassword }
  ): Promise<ErrorMessage> {
    const loggedIn = await dispatch("login", {
      username: state.userEmail,
      password: oldPassword
    });

    if (!loggedIn) {
      return {
        success: false,
        message: "Password cũ không chính xác"
      };
    }

    return await rootState.api.auth.changePassword(newPassword);
  }
};

export const auth = {
  namespaced: true,
  state: new AuthState(),
  mutations: mutations,
  actions: actions
};
