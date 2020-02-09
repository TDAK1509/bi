import { auth } from "@/firebase";
import { ErrorMessage } from "@/models/helpers";

export default class ApiAuth {
  private auth: firebase.auth.Auth;

  constructor() {
    this.auth = auth;
  }

  async login(username: string, password: string): Promise<Boolean> {
    try {
      await this.auth.signInWithEmailAndPassword(username, password);
      return true;
    } catch (error) {
      return false;
    }
  }

  logout() {
    return this.auth.signOut();
  }

  async checkAuthState(
    commit: Function,
    commitIsCheckedAuth: string,
    commitIsAuthName: string,
    commitIsAdminName: string
  ) {
    auth.onAuthStateChanged(async user => {
      if (user) {
        commit(commitIsAuthName, true);

        const token = await user.getIdTokenResult();
        const isAdmin = !!token.claims.isAdmin;
        commit(commitIsAdminName, isAdmin);
      } else {
        commit(commitIsAuthName, false);
        commit(commitIsAdminName, false);
      }

      commit(commitIsCheckedAuth, true);
    });
  }

  async changePassword(newPassword: string): Promise<ErrorMessage> {
    try {
      if (this.auth.currentUser) {
        await this.auth.currentUser.updatePassword(newPassword);
        return {
          success: true,
          message: "Đổi password thành công"
        };
      } else {
        throw { message: "Cần đăng nhập trước" };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
