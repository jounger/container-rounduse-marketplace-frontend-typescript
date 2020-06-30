import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  modules: {}
});

(Vue as any).store = store;

export default store;
