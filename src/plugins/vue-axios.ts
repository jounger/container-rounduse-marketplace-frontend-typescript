import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import snackbar from "@/store/modules/snackbar";
import { getErrorMessage } from "../utils/tool";
// --------------------------------------------------------------------
// vue-axios CONFIGURATION
// --------------------------------------------------------------------
const instance = axios.create({
  baseURL: "http://localhost:8085/api", // base on server-side port
  timeout: 15000,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer {auth_token}"
  }
});
// request interceptor
instance.interceptors.request.use(
  config => {
    // do something before request is sent
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return error;
  }
);

// response interceptor
instance.interceptors.response.use(
  response => {
    console.log(`request: ${response.config.url}`, response);
    if (response.config.url != "/auth/signin" && (response.status == 200 || response.status == 201)) {
      let method = null;
      switch (response.config.method?.toUpperCase()) {
        case "POST":
          method = "Thêm mới";
          break;
        case "PUT":
          method = "Cập nhật";
          break;
        case "PATCH":
          method = "Chỉnh sửa";
          break;
        case "DELETE":
          method = "Xóa";
          break;
      }
      if (method) {
        snackbar.setSnackbar({
          text: `${method} thành công`,
          color: "success",
          timeout: 5 * 1000
        });
        snackbar.setDisplay(true);
      }
    }
    return response;
  },
  error => {
    console.log("err" + error); // for debug
    snackbar.setSnackbar({
      text: getErrorMessage(error),
      color: error.response.status == 500 ? "error" : "warning",
      timeout: 5 * 1000
    });
    snackbar.setDisplay(true);
    return error;
  }
);

Vue.use(VueAxios, instance);
