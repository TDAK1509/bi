import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store/";
import { ErrorMessage } from "@/models/helpers";

export class AuthState {
  isAuth = false;
  userEmail = "";
  isAdmin = false;
  isCheckedAuthState = false;
}

const mutations: MutationTree<AuthState> = {
  setIsAuth(state, payload: boolean) {
    state.isAuth = payload;
  },
  setUserEmail(state, payload: string) {
    state.userEmail = payload;
  },
  setIsAdmin(state, payload: boolean) {
    state.isAdmin = payload;
  },
  setIsCheckedAuthState(state, payload: boolean) {
    state.isCheckedAuthState = payload;
  }
};

const actions: ActionTree<AuthState, RootState> = {
  async login({ commit, rootState }, { username, password }): Promise<Boolean> {
    const loggedIn = await rootState.api.auth.login(username, password);
    commit("setIsAuth", loggedIn);
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
  },

  checkAuthState({ commit, rootState }) {
    rootState.api.auth.checkAuthState(
      commit,
      "setIsCheckedAuthState",
      "setIsAuth",
      "setIsAdmin"
    );
  }
};

export const auth = {
  namespaced: true,
  state: new AuthState(),
  mutations: mutations,
  actions: actions
};
