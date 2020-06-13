import Vue from "vue";
import Vuex from "vuex";
import { UserEntity } from "@/store/definitions/user";
// import UserModule from "@/store/modules/user"

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userDetail: [] as Array<UserEntity>,
    from: 0
  },
  getters:{
    getUserDetail(state): Array<UserEntity>{
      return state.userDetail;
    },
    getFrom(state): number{
      return state.from;
    }
  },
  mutations: {
    setUserDetail(state, user: UserEntity){
      state.userDetail.splice(0,1,user);
    },
    setFrom(state, number: number){
      state.from= number;
    }
  },
  actions: {
    setUserDetail(context, user: UserEntity){
      context.commit("setUserDetail", user);
    },
    setFrom(context, number: number){
      context.commit("setFrom",number);
    }
  },
  modules: {}
});

(Vue as any).store = store;

export default store;
