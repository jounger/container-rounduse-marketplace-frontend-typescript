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
      auth: true
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
    path: "/register",
    name: "Register",
    component: () => import("@/views/auth/Register.vue")
  },
  {
    path: "/operator",
    name: "Operator",
    component: () => import("@/views/admin/operator/index.vue"),
    meta: {
      auth: ["ROLE_ADMIN"]
    }
  },
  {
    path: "/shipping-line",
    name: "ShippingLine",
    component: () => import("@/views/operator/shipping-line/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"]
    }
  },
  {
    path: "/roles",
    name: "Roles",
    component: () => import("@/views/admin/roles/index.vue"),
    meta: {
      auth: ["ROLE_ADMIN"]
    }
  },
  {
    path: "/permission",
    name: "Permission",
    component: () => import("@/views/admin/permission/index.vue"),
    meta: {
      auth: ["ROLE_ADMIN"]
    }
  },
  {
    path: "/consignment",
    name: "Consignment",
    component: () => import("@/views/supply/consignment/index.vue"),
    meta: {
      auth: ["ROLE_MERCHANT"]
    }
  },
  {
    path: "/container",
    name: "Container",
    component: () => import("@/views/supply/container/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER"]
    }
  },
  {
    path: "/supplier",
    name: "Supplier",
    component: () => import("@/views/operator/supplier/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"]
    }
  },
  {
    path: "/application",
    name: "Application",
    component: () => import("@/views/supplier/application/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER", "ROLE_MERCHANT"]
    }
  },
  {
    path: "/driver",
    name: "Driver",
    component: () => import("@/views/supplier/driver/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER"]
    }
  },
  {
    path: "/icd",
    name: "ICD",
    component: () => import("@/views/operator/icd/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"]
    }
  },
  {
    path: "/port",
    name: "Port",
    component: () => import("@/views/operator/port/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"]
    }
  },
  {
    path: "/container-type",
    name: "ContainerType",
    component: () => import("@/views/operator/container-type/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"]
    }
  },
  {
    path: "/bidding-document",
    name: "Bidding Document",
    component: () => import("@/views/supplier/bidding-document/index.vue"),
    meta: {
      auth: ["ROLE_MERCHANT"]
    }
  },
  {
    path: "/consignment-new",
    name: "Consignment New",
    component: () => import("@/views/supply/consignment/ConsignmentNew.vue"),
    meta: {
      auth: true
    }
  },
  {
    path: "/category",
    name: "ConsignmentCategory",
    component: () => import("@/views/operator/consignment-category/index.vue"),
    meta: {
      auth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

(Vue as any).router = router;

export default router;
