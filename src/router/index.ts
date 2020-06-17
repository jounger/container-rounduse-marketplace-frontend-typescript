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
    path: "/user-management",
    name: "UserManagement",
    component: () => import("@/views/user/UserManagement.vue")
  },
  {
    path: "/user-detail",
    name: "UserDetail",
    component: () => import("@/views/user/UserDetail.vue")
  },
  {
    path: "/add-shipping-line",
    name: "AddShippingLine",
    component: () => import("@/views/operator/AddShippingLine.vue")
  },
  {
    path: "/add-roles",
    name: "AddRoles",
    component: () => import("@/views/admin/AddRoles.vue")
  },
  {
    path: "/admin-management",
    name: "AdminManagement",
    component: () => import("@/views/user/AdminManagement.vue")
  },
  {
    path: "/moderator-management",
    name: "ModeratorManagement",
    component: () => import("@/views/user/OperatorManagement.vue")
  },
  {
    path: "/shipping-line-management",
    name: "ShippingLineManagement",
    component: () => import("@/views/operator/ShippingLineManagement.vue")
  },
  {
    path: "/roles-management",
    name: "RolesManagement",
    component: () => import("@/views/admin/RolesManagement.vue"),
  },
  {
    path: "/permission-management",
    name: "PermissionManagement",
    component: () => import("@/views/admin/PermissionManagement.vue")
  },
  {
    path: "/consignment-management",
    name: "ConsignmentManagement",
    component: () => import("@/views/supplier/ConsignmentManagement.vue")
  },
  {
    path: "/request-user-management",
    name: "RequestUserManagement",
    component: () => import("@/views/operator/RequestUserManagement.vue")
  },
  {
    path: "/request-status",
    name: "RequestStatus",
    component: () => import("@/views/supplier/RequestStatus.vue")
  },
  {
    path: "/container-management",
    name: "ContainerManagement",
    component: () => import("@/views/supplier/ContainerManagement.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

(Vue as any).router = router;

export default router;
