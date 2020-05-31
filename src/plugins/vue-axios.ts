import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
// --------------------------------------------------------------------
// vue-axios CONFIGURATION
// --------------------------------------------------------------------
const instance = axios.create({
  baseURL: "http://localhost:8085/api", // base on server-side port
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json"
  }
});
Vue.use(VueAxios, instance);
