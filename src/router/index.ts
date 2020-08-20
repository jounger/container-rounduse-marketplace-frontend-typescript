import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);
// DIVICE BY PERMISSION
const routes: Array<RouteConfig> = [
  // ERROR
  {
    path: "/404",
    name: "NotFound",
    meta: {
      layout: "EmptyLayout",
      title: "Không tìm thấy trang"
    },
    component: () => import("@/views/error-page/404.vue")
  },
  {
    path: "/401",
    name: "Unauthorized",
    meta: {
      layout: "EmptyLayout",
      title: "Không có quyền truy cập"
    },
    component: () => import("@/views/error-page/401.vue")
  },
  // AUTH
  {
    path: "/login",
    name: "Login",
    meta: {
      layout: "AuthLayout",
      title: "Đăng nhập"
    },
    component: () => import("@/views/auth/Login.vue")
  },
  {
    path: "/logout",
    name: "Logout",
    meta: {
      auth: true,
      title: "Đăng xuất"
    },
    component: () => import("@/views/auth/Logout.vue")
  },
  {
    path: "/register",
    name: "Register",
    meta: {
      layout: "EmptyLayout",
      title: "Đăng ký"
    },
    component: () => import("@/views/auth/Register.vue")
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    meta: {
      layout: "AuthLayout",
      title: "Quên mật khẩu"
    },
    component: () => import("@/views/user/password/ForgotPassword.vue")
  },
  // GENERAL
  {
    path: "/",
    name: "Home",
    meta: {
      layout: "DefaultLayout",
      title: "Trang chủ"
    },
    component: () => import("@/views/Home.vue")
  },
  {
    path: "/homepage",
    name: "HomePage",
    meta: {
      layout: "EmptyLayout",
      title: "Trang chủ"
    },
    component: () => import("@/views/guest/home/index.vue")
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/user/profile/index.vue"),
    meta: {
      auth: true,
      layout: "NavLayout",
      title: "Trang cá nhân"
    }
  },
  {
    path: "/change-password",
    name: "ChangePassword",
    component: () => import("@/views/user/password/ChangePassword.vue"),
    meta: {
      auth: true,
      layout: "AuthLayout",
      title: "Đổi mật khẩu"
    }
  },
  {
    path: "/reset-password/:hash",
    name: "ResetPassword",
    component: () => import("@/views/user/password/ResetPassword.vue"),
    meta: {
      layout: "AuthLayout",
      title: "Cài lại mật khẩu"
    }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/user/dashboard/index.vue"),
    meta: {
      auth: true,
      layout: "NavLayout",
      title: "Bảng điều khiển"
    }
  },
  // ADMIN
  {
    path: "/role",
    name: "Role",
    component: () => import("@/views/admin/role/index.vue"),
    meta: {
      auth: ["ROLE_ADMIN"],
      layout: "NavLayout",
      title: "Danh sách vai trò"
    }
  },
  {
    path: "/permission",
    name: "Permission",
    component: () => import("@/views/admin/permission/index.vue"),
    meta: {
      auth: ["ROLE_ADMIN"],
      layout: "NavLayout",
      title: "Danh sách quyền hạn"
    }
  },
  {
    path: "/operator",
    name: "Operator",
    component: () => import("@/views/admin/operator/index.vue"),
    meta: {
      auth: ["ROLE_ADMIN"],
      layout: "NavLayout",
      title: "Danh sách quản trị viên"
    }
  },
  // MODERATOR
  {
    path: "/shipping-line",
    name: "ShippingLine",
    component: () => import("@/views/operator/shipping-line/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"],
      layout: "NavLayout",
      title: "Danh sách hãng tàu"
    }
  },
  {
    path: "/supplier-register",
    name: "SupplierRegister",
    component: () => import("@/views/operator/supplier-register/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"],
      layout: "NavLayout",
      title: "Danh sách đơn đăng ký"
    }
  },
  {
    path: "/port",
    name: "Port",
    component: () => import("@/views/operator/port/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"],
      layout: "NavLayout",
      title: "Danh sách cảng"
    }
  },
  {
    path: "/container-type",
    name: "ContainerType",
    component: () => import("@/views/operator/container-type/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"],
      layout: "NavLayout",
      title: "Danh sách loại container"
    }
  },
  {
    path: "/discount",
    name: "Discount",
    component: () => import("@/views/operator/discount/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"],
      layout: "NavLayout",
      title: "Danh sách mã giảm giá"
    }
  },
  // SUPPLIER
  {
    path: "/application",
    name: "Application",
    component: () => import("@/views/supplier/application/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER", "ROLE_MERCHANT"],
      layout: "NavLayout",
      title: "Danh sách đơn đăng ký"
    }
  },
  {
    path: "/combined",
    name: "Combined",
    component: () => import("@/views/supplier/combined/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER", "ROLE_MERCHANT"],
      layout: "NavLayout",
      title: "Danh sách hàng ghép"
    }
  },
  {
    path: "/bidding-document/:id",
    name: "BiddingDocumentDetail",
    component: () =>
      import(
        "@/views/supplier/bidding-document/components/DetailBiddingDocument.vue"
      ),
    meta: {
      auth: ["ROLE_MERCHANT", "ROLE_FORWARDER"],
      layout: "NavLayout",
      title: "Chi tiết đấu thầu"
    }
  },
  {
    path: "/combined/:id",
    name: "CombinedDetail",
    component: () =>
      import("@/views/supplier/combined/components/DetailCombined.vue"),
    meta: {
      auth: ["ROLE_MERCHANT", "ROLE_FORWARDER"],
      layout: "NavLayout",
      title: "Chi tiết hàng ghép"
    }
  },
  {
    path: "/report/:id",
    name: "ReportDetail",
    component: () =>
      import("@/views/supplier/report/components/ReportDetail.vue"),
    meta: {
      auth: ["ROLE_MODERATOR", "ROLE_FORWARDER"],
      layout: "NavLayout",
      title: "Chi tiết báo cáo"
    }
  },
  // merchant
  {
    path: "/outbound",
    name: "Outbound",
    component: () => import("@/views/supply/outbound/index.vue"),
    meta: {
      auth: ["ROLE_MERCHANT"],
      layout: "NavLayout",
      title: "Danh sách hàng xuất"
    }
  },
  {
    path: "/bidding-document",
    name: "BiddingDocument",
    component: () => import("@/views/supplier/bidding-document/index.vue"),
    meta: {
      auth: ["ROLE_MERCHANT"],
      layout: "NavLayout",
      title: "Danh sách đấu thầu"
    }
  },
  // forwarder
  {
    path: "/inbound",
    name: "Inbound",
    component: () => import("@/views/supply/inbound/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER"],
      layout: "NavLayout",
      title: "Danh sách hàng nhập"
    }
  },
  {
    path: "/bid",
    name: "Bid",
    component: () => import("@/views/supplier/bid/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER"],
      layout: "NavLayout",
      title: "Danh sách đã gửi dự thầu"
    }
  },
  {
    path: "/invited-bidding",
    name: "InvitedBiddingDocument",
    component: () =>
      import("@/views/supplier/bid/components/InvitedNotify.vue"),
    meta: {
      auth: ["ROLE_FORWARDER"],
      layout: "NavLayout",
      title: "Danh sách đơn mời thầu"
    }
  },
  {
    path: "/driver",
    name: "Driver",
    component: () => import("@/views/supplier/driver/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER"],
      layout: "NavLayout",
      title: "Danh sách lái xe"
    }
  },
  {
    path: "/supplier",
    name: "Supplier",
    component: () => import("@/views/operator/supplier/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR"],
      layout: "NavLayout",
      title: "Danh sách nhà cung cấp"
    }
  },
  {
    path: "/trailer",
    name: "Trailer",
    component: () => import("@/views/supplier/trailer/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER"],
      layout: "NavLayout",
      title: "Danh sách đầu kéo"
    }
  },
  {
    path: "/tractor",
    name: "Tractor",
    component: () => import("@/views/supplier/tractor/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER"],
      layout: "NavLayout",
      title: "Danh sách rơ mooc"
    }
  },
  {
    path: "/contract",
    name: "Contract",
    component: () => import("@/views/supplier/contract/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER", "ROLE_MERCHANT"],
      layout: "NavLayout",
      title: "Danh sách hợp đồng"
    }
  },
  {
    path: "/invoice",
    name: "Invoice",
    component: () => import("@/views/supplier/invoice/index.vue"),
    meta: {
      auth: ["ROLE_FORWARDER", "ROLE_MERCHANT"],
      layout: "NavLayout",
      title: "Danh sách hóa đơn"
    }
  },
  {
    path: "/report",
    name: "Report",
    component: () => import("@/views/supplier/report/index.vue"),
    meta: {
      auth: ["ROLE_MODERATOR", "ROLE_FORWARDER"],
      layout: "NavLayout",
      title: "Danh sách báo cáo"
    }
  },
  // shipping line
  {
    path: "/borrow-notify",
    name: "BorrowNotify",
    component: () => import("@/views/supplier/borrow-notify/index.vue"),
    meta: {
      auth: ["ROLE_SHIPPINGLINE"],
      layout: "NavLayout",
      title: "Danh sách yêu cầu mượn vỏ container"
    }
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404" }
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Vue as any).router = router;

export default router;
