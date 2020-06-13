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
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/user/Profile.vue"),
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
  {
    path: "/list-user",
    name: "ListUser",
    component: () => import("@/views/user/ListUser.vue")
  },
  {
    path: "/user-detail",
    name: "UserDetail",
    component: () => import("@/views/user/UserDetail.vue")
  },
  {
    path: "/add-shipping-line",
    name: "AddShippingLine",
    component: () => import("@/views/AddShippingLine.vue")
  },
  {
    path: "/add-roles",
    name: "AddRoles",
    component: () => import("@/views/AddRoles.vue")
  },
  {
    path: "/list-admin",
    name: "ListAdmin",
    component: () => import("@/views/user/ListAdmin.vue")
  },
  {
    path: "/list-moderator",
    name: "ListModerator",
    component: () => import("@/views/user/ListModerator.vue")
  },
  {
    path: "/list-shipping-line",
    name: "ListShippingLine",
    component: () => import("@/views/ListShippingLine.vue")
  },
  {
    path: "/list-roles",
    name: "ListRoles",
    component: () => import("@/views/ListRoles.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

(Vue as any).router = router;

export default router;
