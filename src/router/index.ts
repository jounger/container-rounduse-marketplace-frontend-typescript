import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue")
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/user/dashboard/index.vue"),
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
    component: () => import("@/views/user/profile/index.vue"),
    meta: {
      auth: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/Login.vue")
  },
  {
    path: "/logout",
    name: "Logout",
    component: () => import("@/views/auth/Logout.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/auth/Register.vue")
  },
  {
    path: "/user-management",
    name: "UserManagement",
    component: () => import("@/views/user/user/index.vue")
  },
  {
    path: "/admin-management",
    name: "AdminManagement",
    component: () => import("@/views/user/admin/index.vue")
  },
  {
    path: "/moderator-management",
    name: "ModeratorManagement",
    component: () => import("@/views/user/moderator/index.vue")
  },
  {
    path: "/shipping-line-management",
    name: "ShippingLineManagement",
    component: () => import("@/views/operator/shipping-line/index.vue")
  },
  {
    path: "/roles-management",
    name: "RolesManagement",
    component: () => import("@/views/admin/roles/index.vue"),
  },
  {
    path: "/permission-management",
    name: "PermissionManagement",
    component: () => import("@/views/admin/permission/index.vue")
  },
  {
    path: "/consignment-management",
    name: "ConsignmentManagement",
    component: () => import("@/views/supply/consignment/index.vue")
  },
  {
    path: "/request-user-management",
    name: "RequestUserManagement",
    component: () => import("@/views/operator/supplier-register/index.vue")
  },
  {
    path: "/request-status",
    name: "RequestStatus",
    component: () => import("@/views/supplier/request-status/index.vue")
  },
  {
    path: "/container-management",
    name: "ContainerManagement",
    component: () => import("@/views/supply/container/index.vue")
  },
  {
    path: "/driver-management",
    name: "DriverManagement",
    component: () => import("@/views/supplier/driver/index.vue")
  },
  {
    path: "/icd-management",
    name: "ICDManagement",
    component: () => import("@/views/operator/icd/index.vue")
  },
  {
    path: "/port-management",
    name: "PortManagement",
    component: () => import("@/views/operator/port/index.vue")
  },
  {
    path: "/container-type-management",
    name: "ContainerTypeManagement",
    component: () => import("@/views/operator/container-type/index.vue")
  },
  {
    path: "/bidding-document-management",
    name: "BiddingDocumentManagement",
    component: () => import("@/views/supplier/bidding-document/index.vue")
  },
  {
    path: "/consignment-management-new",
    name: "ConsignmentManagementNew",
    component: () => import("@/views/supply/consignment/ConsignmentManagementNew.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

(Vue as any).router = router;

export default router;
