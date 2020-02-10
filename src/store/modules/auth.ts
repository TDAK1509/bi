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
  },
  setLoggedOut(state) {
    state.isAdmin = false;
    state.isAuth = false;
    state.userEmail = "";
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

  async logout({ commit, rootState }) {
    await rootState.api.auth.logout();
    commit("setLoggedOut");
  },

  createUser({ rootState }, { email, password }) {
    return rootState.api.auth.createUser(email, password);
  }
};

export const auth = {
  namespaced: true,
  state: new AuthState(),
  mutations: mutations,
  actions: actions
};
