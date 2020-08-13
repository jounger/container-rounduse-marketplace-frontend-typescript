import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import snackbar from "@/store/modules/snackbar";
import loading from "@/store/modules/loading";
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
    console.log("REQUEST", config);
    const method = config.method?.toUpperCase();
    if (
      method == "POST" ||
      method == "PUT" ||
      method == "PATCH" ||
      method == "DELETE"
    ) {
      loading.setLoading(true);
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug

    setTimeout(() => loading.setLoading(false), 200);
    return error;
  }
);

// response interceptor
instance.interceptors.response.use(
  response => {
    console.log(`RESPONSE: ${response.config.url}`, response);
    if (
      response.config.method?.toUpperCase() != "GET" &&
      response.config.url?.includes("/notification") == false &&
      response.data.message.length > 0 &&
      (response.status == 200 ||
        response.status == 201 ||
        response.status == 204)
    ) {
      snackbar.setSnackbar({
        text: response.data.message,
        color: "success",
        timeout: 5 * 1000
      });
      snackbar.setDisplay(true);
    }

    setTimeout(() => loading.setLoading(false), 200);
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

    setTimeout(() => loading.setLoading(false), 200);
    return error;
  }
);

Vue.use(VueAxios, instance);
