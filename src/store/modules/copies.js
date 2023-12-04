import service from '@/services/service';
import router from "@/router";

export default {
  state: {
    copies: [],
  },
  getters: {
    activeCopies: (state) => {
      return state.copies.filter((copy) => copy.status == 'Active');
    },
  },
  mutations: {
    SET_COPIES(state, copies) {
      state.copies = copies;
    },
    ADD_COPIES(state, copy) {
      state.copies.push(copy);
    },
    REMOVE_COPIES(state, id) {
      let index = state.copies.findIndex((c) => c.copy_id == id);
      state.copies.splice(index, 0);
    },
    UPDATE_COPIES(state, id) {
      let index = state.copies.findIndex((c) => c.copy_id == id);
      state.copies.splice(index, 0);
    },
  },
  actions: {
    fetchCopies({ commit }) {
      service
        .getCopies()
        .then(({ data }) => {
          commit('SET_COPIES', data);
        })
        .catch((error) => console.log(error));
    },
    async addCopy({ commit }, copy) {
      try {
        await service
          .postCopies(copy);
        await commit("ADD_COPIES", copy);
        router.go(0);
      } catch (error) {
        console.log(error);
      }
    },
    removeCopy({ commit }, id) {
      service
        .removeCopy(id)
        .then(async () => {
          await commit("REMOVE_COPIES", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editCopy({ commit }, { id, copy }) {
      service
        .updateCopy(id, copy)
        .then(async () => {
          console.log(copy)
          await commit("UPDATE_COPIES", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
