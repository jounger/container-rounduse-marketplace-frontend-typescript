import Vue from "vue";
import Vuex from "vuex";
import { UserEntity } from "@/store/definitions/user";
// import UserModule from "@/store/modules/user"

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
