import { MutationTree, ActionTree } from "vuex";
import { RootState } from "@/store/";
import { ErrorMessage } from "@/models/helpers";

const LAST_LOGGED_IN_KEY = "lastLoggedIn";
const SESSION_MAX_LENGTH = 30 * 60 * 60; // 30min in mSec

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

  checkAuthState({ commit, dispatch, rootState }) {
    rootState.api.auth.checkAuthState(
      commit,
      "setIsCheckedAuthState",
      "setIsAuth",
      "setIsAdmin"
    );

    if (_checkIfLoggedInTooLong()) {
      dispatch("logout");
    } else {
      _resetLastLoggedInTime();
    }
  }
};

function _resetLastLoggedInTime() {
  window.localStorage.setItem(
    LAST_LOGGED_IN_KEY,
    new Date().getTime().toString()
  );
}

function _checkIfLoggedInTooLong(): boolean {
  const lastLoggedIn = window.localStorage.getItem(LAST_LOGGED_IN_KEY);

  if (lastLoggedIn === null) {
    return false;
  }

  const lastLoggedInMsec = parseInt(lastLoggedIn);
  const currentTime = new Date().getTime();
  const isPastMaxLength = currentTime - lastLoggedInMsec > SESSION_MAX_LENGTH;
  return isPastMaxLength;
}

export const auth = {
  namespaced: true,
  state: new AuthState(),
  mutations: mutations,
  actions: actions
};
