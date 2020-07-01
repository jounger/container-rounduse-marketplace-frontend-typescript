import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./plugins/vue-axios";
import "./plugins/vue-auth";
import NavLayout from './layouts/NavLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';
import DefaultLayout from './layouts/DefaultLayout.vue';
import EmptyLayout from './layouts/EmptyLayout.vue';
import RegisterLayout from './layouts/RegisterLayout.vue';

Vue.component("NavLayout", NavLayout);
Vue.component("AuthLayout", AuthLayout);
Vue.component("RegisterLayout", RegisterLayout);
Vue.component("DefaultLayout", DefaultLayout);
Vue.component("EmptyLayout", EmptyLayout);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
