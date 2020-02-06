import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Buefy from "buefy";
import "./../node_modules/@fortawesome/fontawesome-free/css/all.css";
import vSelect from "vue-select";

Vue.config.productionTip = false;
Vue.use(Buefy, {
  defaultIconPack: "fas"
});

Vue.component("v-select", vSelect);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
