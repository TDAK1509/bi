import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Main from "../views/Main.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: Login
  },

  {
    path: "/main",
    name: "main",
    component: Main,
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
      }
    ]
  }
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? "hash" : "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
