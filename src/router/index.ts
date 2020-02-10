import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import { auth } from "@/firebase";
import { LAST_LOGGED_IN_KEY, SESSION_MAX_LENGTH } from "@/const/auth";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue")
  },

  {
    path: "/main",
    name: "main",
    component: () => import("@/views/Main.vue"),
    children: [
      {
        path: "debt",
        name: "debt",
        component: () => import("@/views/Debt.vue")
      },

      {
        path: "transaction",
        name: "transaction",
        component: () => import("@/views/Transaction.vue")
      },

      {
        path: "search",
        name: "search",
        component: () => import("@/views/Search.vue")
      },

      {
        path: "admin",
        name: "admin",
        component: () => import("@/views/Admin.vue")
      }
    ]
  }
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? "hash" : "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  auth.onAuthStateChanged(async user => {
    if (user) {
      if (_checkIfLoggedInTooLong()) {
        store.dispatch("auth/logout");
        next({ name: "login" });
        return;
      }

      _resetLastLoggedInTime();

      const token = await user.getIdTokenResult();
      const isAdmin = !!token.claims.isAdmin;

      store.commit("auth/setIsAuth", true);
      store.commit("auth/setUserEmail", user.email);
      store.commit("auth/setIsAdmin", isAdmin);

      if (to.name === "admin") {
        if (store.state.auth.isAdmin) {
          next();
          return;
        }

        next({ name: "login" });
        return;
      }

      next();
    } else {
      store.commit("auth/setIsAuth", false);
      store.commit("auth/setIsAdmin", false);

      if (to.name !== "login") {
        next({ name: "login" });
        return;
      }

      next();
    }
  });
});

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

export default router;
