import Vue from "vue";
import Vuex from "vuex";
import NotificationModule from './notification/index';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  modules: {
    NotificationModule
  }
});

(Vue as any).store = store;

export default store;
