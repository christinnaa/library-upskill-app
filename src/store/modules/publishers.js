import service from '@/services/service';
import router from '@/router';

export default {
  state: {
    publishers: [],
  },
  getters: {
    allPublishers: (state) => {
      return state.publishers;
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
    async addPublisher({ commit }, publisher) {
      try {
        await service.postPublisher(publisher);
        await commit('ADD_PUBLISHER', publisher);
        router.go(0);
      } catch (error) {
        console.log(error);
      }
    },
    fetchPublishers({ commit }) {
      service
        .getPublishers()
        .then(({ data }) => {
          commit('SET_PUBLISHERS', data);
        })
        .catch((error) => console.log(error));
    },
    removePublisher({ commit }, id) {
      service
        .removePublisher(id)
        .then(async () => {
          await commit('REMOVE_PUBLISHER', id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editPublisher({ commit }, { id, publisher }) {
      service
        .updatePublisher(id, publisher)
        .then(async () => {
          await commit('UPDATE_PUBLISHER', id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
