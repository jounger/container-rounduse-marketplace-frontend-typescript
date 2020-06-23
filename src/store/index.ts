import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  getters:{},
  mutations: {},
  actions: {},
  modules: {}
});

(Vue as any).store = store;

export default store;
