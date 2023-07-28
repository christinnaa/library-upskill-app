import service from "@/services/service";
import router from "@/router";

export default {
  state: {
    publishers: [],
  },
  getters: {
    activePublishers: (state) => {
      return state.publishers.filter(
        (publisher) => publisher.p_status == "active"
      );
    },
  },
  mutations: {
    SET_PUBLISHERS(state, publishers) {
      state.publishers = publishers;
    },
    ADD_PUBLISHER(state, publisher) {
      state.publishers.push(publisher);
    },
    REMOVE_PUBLISHER(state, id) {
      let index = state.publishers.findIndex((p) => p.publisher_id == id);
      state.publishers.splice(index, 0);
    },
    UPDATE_PUBLISHER(state, id) {
      let index = state.publishers.findIndex((p) => p.publisher_id == id);
      state.publishers.splice(index, 0);
    },
  },
  actions: {
    addPublisher({ commit }, publisher) {
      return service
        .postPublisher(publisher)
        .then(() => {
          commit("ADD_PUBLISHER", publisher);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchPublishers({ commit }) {
      service
        .getPublishers()
        .then((response) => {
          commit("SET_PUBLISHERS", response.data);
        })
        .catch((error) => console.log(error));
    },
    removePublisher({ commit }, id) {
      service
        .removePublisher(id)
        .then(() => {
          commit("REMOVE_PUBLISHER", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editPublisher({ commit }, { id, publisher }) {
      service
        .updatePublisher(id, publisher)
        .then(() => {
          commit("UPDATE_PUBLISHER", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
