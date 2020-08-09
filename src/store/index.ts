import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  modules: {}
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Vue as any).store = store;

export default store;
