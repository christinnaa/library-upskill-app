import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuelidate from "vuelidate";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

const options = {
  // You can set your default options here
  transition:"Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
};

Vue.config.productionTip = false;

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/custom.scss";

Vue.use(Toast, options);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(Vuelidate)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
