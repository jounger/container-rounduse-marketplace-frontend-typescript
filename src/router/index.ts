import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

// DIVICE BY PERMISSION
const routes: Array<RouteConfig> = [
  // AUTH
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
  // GENERAL
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue")
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
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/user/dashboard/index.vue"),
    meta: {
      auth: true
    }
  },
  // ADMIN
  {
    path: "/role",
    name: "Role",
    component: () => import("@/views/admin/role/index.vue"),
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
    path: "/operator",
    name: "Operator",
    component: () => import("@/views/admin/operator/index.vue"),
    meta: {
      auth: ["ROLE_ADMIN"]
    }
  },
  // MODERATOR
  {
    path: "/shipping-line",
    name: "Shipping Line",
    component: () => import("@/views/operator/shipping-line/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"]
    }
  },
  {
    path: "/supplier-register",
    name: "SupplierRegister",
    component: () => import("@/views/operator/supplier-register/index.vue"),
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
    name: "Container Type",
    component: () => import("@/views/operator/container-type/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"]
    }
  },
  {
    path: "/discount",
    name: "Mã giảm giá",
    component: () => import("@/views/operator/discount/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"]
    }
  },
  // SUPPLIER
  {
    path: "/application",
    name: "Application",
    component: () => import("@/views/supplier/application/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER", "ROLE_MERCHANT"]
    }
  },
  // merchant
  {
    path: "/outbound",
    name: "Outbound",
    component: () => import("@/views/supply/outbound/index.vue"),
    meta: {
      auth: ["ROLE_MERCHANT"]
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
    path: "/outbound-new",
    name: "Outbound New",
    component: () => import("@/views/supply/outbound/OutboundNew.vue"),
    meta: {
      auth: true
    }
  },
  // forwarder
  {
    path: "/inbound",
    name: "Inbound",
    component: () => import("@/views/supply/inbound/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER"]
    }
  },
  // DRIVER
  {
    path: "/driver",
    name: "Driver",
    component: () => import("@/views/supplier/driver/index.vue"),
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
    path: "/supplier-ban",
    name: "SupplierBan",
    component: () => import("@/views/operator/supplier-ban/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"]
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
