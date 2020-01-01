import Vue, { VNode, CreateElement } from "vue";
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
        path: "client/:clientId",
        name: "client",
        component: () => import("@/views/Client.vue")
      },

      {
        path: "transaction",
        name: "transaction",
        component: () => import("@/views/Transaction.vue")
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
