import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vue from "vue";
import Vuetify from "vuetify/";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "md" || "fa" || "fa4" || "faSvg" || "mdi" || "mdiSvg"
  },
  theme: {
    themes: {
      light: {
        primary: "#00532f",
        secondary: "#eea632",
        tertiary: "#005CAF",
        accent: "#5CBBF6",
        success: "#128e17",
        error: "#991f25",
        expired: "#404040"
      }
    }
  }
});
