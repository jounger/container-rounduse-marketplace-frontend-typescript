import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

// DIVICE BY PERMISSION
const routes: Array<RouteConfig> = [
  // AUTH
  {
    path: "/login",
    name: "Login",
    meta: {
      layout: "AuthLayout"
    },
    component: () => import("@/views/auth/Login.vue")
  },
  {
    path: "/register",
    name: "Register",
    meta: {
      layout: "RegisterLayout"
    },
    component: () => import("@/views/auth/Register.vue")
  },
  // GENERAL
  {
    path: "/",
    name: "Home",
    meta: {
      layout: "DefaultLayout"
    },
    component: () => import("@/views/Home.vue")
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/user/profile/index.vue"),
    meta: {
      auth: true,
      layout: "NavLayout"
    }
  },
  {
    path: "/notification",
    name: "Notification",
    component: () => import("@/views/user/notification/index.vue"),
    meta: {
      auth: true,
      layout: "NavLayout"
    }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/user/dashboard/index.vue"),
    meta: {
      auth: true,
      layout: "NavLayout"
    }
  },
  // ADMIN
  {
    path: "/role",
    name: "Role",
    component: () => import("@/views/admin/role/index.vue"),
    meta: {
      auth: ["ROLE_ADMIN"],
      layout: "NavLayout"
    }
  },
  {
    path: "/permission",
    name: "Permission",
    component: () => import("@/views/admin/permission/index.vue"),
    meta: {
      auth: ["ROLE_ADMIN"],
      layout: "NavLayout"
    }
  },
  {
    path: "/operator",
    name: "Operator",
    component: () => import("@/views/admin/operator/index.vue"),
    meta: {
      auth: ["ROLE_ADMIN"],
      layout: "NavLayout"
    }
  },
  // MODERATOR
  {
    path: "/shipping-line",
    name: "Shipping Line",
    component: () => import("@/views/operator/shipping-line/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"],
      layout: "NavLayout"
    }
  },
  {
    path: "/supplier-register",
    name: "SupplierRegister",
    component: () => import("@/views/operator/supplier-register/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"],
      layout: "NavLayout"
    }
  },
  {
    path: "/port",
    name: "Port",
    component: () => import("@/views/operator/port/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"],
      layout: "NavLayout"
    }
  },
  {
    path: "/container-type",
    name: "Container Type",
    component: () => import("@/views/operator/container-type/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"],
      layout: "NavLayout"
    }
  },
  {
    path: "/discount",
    name: "Mã giảm giá",
    component: () => import("@/views/operator/discount/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"],
      layout: "NavLayout"
    }
  },
  // SUPPLIER
  {
    path: "/application",
    name: "Application",
    component: () => import("@/views/supplier/application/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER", "ROLE_MERCHANT"],
      layout: "NavLayout"
    }
  },
  {
    path: "/combined",
    name: "Combined",
    component: () => import("@/views/supplier/combined/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER", "ROLE_MERCHANT"],
      layout: "NavLayout"
    }
  },
  {
    path: "/bidding-document/:id",
    name: "Bidding Document Detail",
    component: () => import("@/views/supplier/bidding-document/components/DetailBiddingDocument.vue"),
    meta: {
      auth: ["ROLE_MERCHANT", "ROLE_FORWARDER"],
      layout: "NavLayout"
    }
  },
  {
    path: "/combined/:id",
    name: "Combined Detail",
    component: () => import("@/views/supplier/combined/components/DetailCombined.vue"),
    meta: {
      auth: ["ROLE_MERCHANT", "ROLE_FORWARDER"],
      layout: "NavLayout"
    }
  },
  // merchant
  {
    path: "/outbound",
    name: "Outbound",
    component: () => import("@/views/supply/outbound/index.vue"),
    meta: {
      auth: ["ROLE_MERCHANT"],
      layout: "NavLayout"
    }
  },
  {
    path: "/bidding-document",
    name: "Bidding Document",
    component: () => import("@/views/supplier/bidding-document/index.vue"),
    meta: {
      auth: ["ROLE_MERCHANT"],
      layout: "NavLayout"
    }
  },
  // forwarder
  {
    path: "/inbound",
    name: "Inbound",
    component: () => import("@/views/supply/inbound/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER"],
      layout: "NavLayout"
    }
  },
  {
    path: "/bid",
    name: "Bid",
    component: () => import("@/views/supplier/bid/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER"],
      layout: "NavLayout"
    }
  },
  {
    path: "/invited-bidding",
    name: "Invited Bidding Document",
    component: () => import("@/views/supplier/bid/components/InvitedNotify.vue"),
    meta: {
      auth: ["ROLE_FORWARDER"],
      layout: "NavLayout"
    }
  },
  // DRIVER
  {
    path: "/driver",
    name: "Driver",
    component: () => import("@/views/supplier/driver/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER"],
      layout: "NavLayout"
    }
  },
  {
    path: "/supplier",
    name: "Supplier",
    component: () => import("@/views/operator/supplier/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"],
      layout: "NavLayout"
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
