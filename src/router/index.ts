import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Login from "@/views/auth/Login.vue";
import Logout from "@/views/auth/Logout.vue";
import Home from "@/views/Home.vue";
import Admin from "@/views/user/Admin.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: {
      auth: ["ROLE_ADMIN"]
    }
  },
  {
    path: "/user",
    name: "User",
    component: () => import("@/views/user/User.vue"),
    meta: {
      auth: ["ROLE_ADMIN", "ROLE_MODERATOR"]
    }
  },
  {
    path: "/my-profile",
    name: "MyProfile",
    component: () => import("@/views/user/MyProfile.vue"),
    meta: {
      auth: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/logout",
    name: "Logout",
    component: Logout
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/auth/Register.vue")
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

(Vue as any).router = router;

export default router;
