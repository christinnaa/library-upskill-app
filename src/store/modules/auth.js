import service from "@/services/service";
import router from "@/router";
// import axios from "axios";

export default {
  state: {
    user: "",
    loggedIn: false,
    loginError: ""
  },
  getters: {
    users: (state) => {
      return state.user;
    },
  },
  mutations: {
    LOGIN_SUCCESSFUL(state, userData) {
      state.user = userData;
      state.loggedIn = true;
    },
    LOGIN_ERROR(state, error) {
      state.loginError = error;
    },
    CLEAR_LOGIN_ERROR(state) {
      state.loginError = null;
    },
    LOGOUT(state) {
      state.user = null;
    },
  },
  actions: {
    async login({ commit }, { username, password }) {
      service
        .login({ username, password })
        .then(async ({ data }) => {
          await commit("LOGIN_SUCCESSFUL", data.user);
          await commit("CLEAR_LOGIN_ERROR");
          if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("first_name", data.user.first_name);
            localStorage.setItem("last_name", data.user.last_name);
            localStorage.setItem("username", data.user.username);
          }
          router.push("/dashboard");
          // data.user.role === "admin"
          //   ? router.push("/dashboard")
          //   : router.push("/books");

        })
        .catch((e) => {
          commit("LOGIN_ERROR", e.response.data.message);
        });
    },
    logout({ commit }) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      localStorage.removeItem("username");
      commit("LOGOUT");
      router.push("/");
    },
  },
};
