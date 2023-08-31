import service from "@/services/service";
import router from "@/router";
// import axios from "axios";

export default {
  state: {
    user: "",
    loggedIn: false,
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
          if (data.user.token) {
            localStorage.setItem("token", data.user.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("first_name", data.user.first_name);
            localStorage.setItem("last_name", data.user.last_name);
            localStorage.setItem("username", data.user.username);
          }

          data.user.role === "admin"
            ? router.push("/books")
            : router.push("/reader");
        })
        .catch((e) => {
          alert(e.response.data.error);
        });
    },
    logout({ commit }) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      localStorage.removeItem("username");
      commit("LOGOUT");
      router.go(0);
    },
  },
};
