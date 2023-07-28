import service from "@/services/service";
import router from "@/router";
// import axios from "axios";

export default {
  state: {
    user: {},
    message: "",
  },
  getters: {
    users: (state) => {
      return state.user;
    },
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user = userData;
    },
    LOGIN_SUCCESS(state, user) {
      state.loggedIn = true;
      state.user = user;
    },
    LOGIN_FAILURE(state) {
      state.loggedIn = false;
      state.user = null;
    },
    LOGOUT(state) {
      // state.loggedIn = false;
      state.user = null;
    },
  },
  actions: {
    login({ commit }, credentials) {
      service
        .login(credentials)
        .then(({ data }) => {
          if (data.user[0].token) {
            localStorage.setItem("user", JSON.stringify(data.user[0]));
            localStorage.setItem("token", data.user[0].token);
          }

          commit("SET_USER_DATA", data.user[0]);
          location.href = "/books";
        })
        .catch((e) => {
          alert(e.response.data.error);
        });
    },
    logout({ commit }) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      commit("LOGOUT");
      router.go(0);
    },
  },
};
