import service from "@/services/service";
import router from "@/router";

export default {
  state: {
    requests: [],
  },
  getters: {
    activeRequests: (state) => {
      return state.requests.filter((request) => request.r_status == "active");
    },
  },
  mutations: {
    SET_REQUESTS(state, requests) {
      state.requests = requests;
    },
    ADD_REQUEST(state, request) {
      state.requests.push(request);
    },
    REMOVE_REQUEST(state, id) {
      let index = state.requests.findIndex((r) => r.request_id == id);
      state.requests.splice(index, 0);
    },
  },
  actions: {
    fetchRequests({ commit }) {
      service
        .getRequests()
        .then((response) => {
          commit("SET_REQUESTS", response.data);
        })
        .catch((error) => console.log(error));
    },
    addRequest({ commit }, request) {
      return service
        .postRequest(request)
        .then(() => {
          commit("ADD_REQUEST", request);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    removeRequest({ commit }, id) {
      service
        .removeRequest(id)
        .then(() => {
          commit("REMOVE_REQUEST", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
