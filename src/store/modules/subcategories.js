// import router from "@/router";
import service from "@/services/service";

export default {
  state: {
    subcategories: [],
  },
  getters: {
    activeSubcategories: (state) => {
      return state.subcategories.filter(
        (subcategory) => subcategory.status == "active"
      );
    },
  },
  mutations: {
    SET_SUBCATEGORIES(state, subcategories) {
      state.subcategories = subcategories;
    },
    ADD_SUBCATEGORY(state, subcategory) {
      state.subcategories.push(subcategory);
    },
    REMOVE_SUBCATEGORY(state, id) {
      let index = state.subcategories.findIndex((c) => c.subcategory_id == id);
      state.subcategories.splice(index, 0);
    },
    UPDATE_SUBCATEGORY(state, id) {
      let index = state.subcategories.findIndex((c) => c.subcategory_id == id);
      state.subcategories.splice(index, 0);
    },
  },
  actions: {
    async addSubcategory({ commit }, subcategory) {
      try {
        await service
          .postSubcategory(subcategory);
        await commit("ADD_SUBCATEGORY", subcategory);
        // router.go(0);
      } catch (error) {
        console.log(error);
      }
    },
    fetchSubcategories({ commit }) {
      service
        .getSubcategories()
        .then(({data}) => {
          commit("SET_SUBCATEGORIES", data.subcategory);
        })
        .catch((error) => console.log(error));
    },
    removeSubcategory({ commit }, id) {
      service
        .removeSubcategory(id)
        .then(async () => {
          await commit("REMOVE_SUBCATEGORY", id);
          // router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editSubcategory({ commit }, { id, subcategory }) {
      service
        .updateSubcategory(id, subcategory)
        .then(async () => {
          await commit("UPDATE_SUBCATEGORY", id);
          // router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
