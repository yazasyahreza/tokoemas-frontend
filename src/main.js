import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import axios from "axios";

const app = createApp(App);

app.use(createPinia());
app.use(router);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.dispatchEvent(new Event("profile-updated"));
      window.dispatchEvent(new Event("auth-changed"));
    }
    return Promise.reject(error);
  },
);

app.mount("#app");
