import router from "@/router";
import service from "@/services/service";

export default {
  state: {
    shelves: [],
  },
  getters: {
    activeShelves: (state) => {
      return state.shelves.filter(
        (shelf) => shelf.status == "active"
      );
    },
  },
  mutations: {
    SET_SHELVES(state, shelves) {
      state.shelves = shelves;
    },
    ADD_SHELF(state, shelf) {
      state.shelves.push(shelf);
    },
    REMOVE_SHELF(state, id) {
      let index = state.shelves.findIndex((c) => c.shelf_id == id);
      state.shelves.splice(index, 0);
    },
    UPDATE_SHELF(state, id) {
      let index = state.shelves.findIndex((c) => c.shelf_id == id);
      state.shelves.splice(index, 0);
    },
  },
  actions: {
    async addShelf({ commit }, shelf) {
      try {
        await service
          .postShelf(shelf);
        await commit("ADD_SHELF", shelf);
        router.go(0);
      } catch (error) {
        console.log(error);
      }
    },
    fetchShelves({ commit }) {
      service
        .getShelves()
        .then(({data}) => {
          commit("SET_SHELVES", data.shelf);
        })
        .catch((error) => console.log(error));
    },
    removeShelf({ commit }, id) {
      service
        .removeShelf(id)
        .then(async () => {
          await commit("REMOVE_SHELF", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editShelf({ commit }, { id, shelf }) {
      service
        .updateShelf(id, shelf)
        .then(async () => {
          await commit("UPDATE_SHELF", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
