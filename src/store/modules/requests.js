import service from "@/services/service";
import router from "@/router";

export default {
  state: {
    requests: [],
  },
  getters: {
    activeRequests: (state) => {
      return state.requests.filter((request) => request.status == "active");
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
        .then(({data}) => {
          commit("SET_REQUESTS", data.request);
        })
        .catch((error) => console.log(error));
    },
    async addRequest({ commit }, request) {
      try {
        await service
          .postRequest(request);
        await commit("ADD_REQUEST", request);
        router.go(0);
      } catch (error) {
        console.log(error);
      }
    },
    removeRequest({ commit }, id) {
      service
        .removeRequest(id)
        .then(async () => {
          await commit("REMOVE_REQUEST", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
