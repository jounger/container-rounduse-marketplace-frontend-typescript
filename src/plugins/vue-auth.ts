import Vue from "vue";
import VueAuth from "@d0whc3r/vue-auth-plugin";

const options = {
  authMeta: "auth",
  rolesVar: "roles",
  tokenDefaultName: "default_auth_token",
  userDefaultName: "default_auth_user",
  tokenStore: ["vuex", "localStorage", "cookie"],
  headerTokenReplace: "{auth_token}",
  tokenType: "Bearer",
  vuexStoreSpace: "vue-auth",

  authRedirect: "/login",

  loginData: {
    url: "/auth/signin",
    method: "POST",
    redirect: "/admin",
    headerToken: "Authorization",
    fetchUser: true,
    fetchData: (response: any) => response.data.userInfo
    // customToken: (response: any) => response.data['token'],
  },
  logoutData: {
    // url: '/auth/signout',
    // method: 'POST',
    redirect: "/signout"
    // makeRequest: false,
  },
  fetchItem: "",
  fetchData: {
    url: "/auth/user",
    method: "GET",
    interval: 30,
    enabled: false
  },
  refreshData: {
    url: "/auth/refresh",
    method: "GET",
    interval: 30,
    enabled: false
  }
};

Vue.use(VueAuth, options);
