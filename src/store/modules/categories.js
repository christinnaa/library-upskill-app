import router from "@/router";
import service from "@/services/service";

export default {
  state: {
    categories: [],
  },
  getters: {
    activeCategories: (state) => {
      return state.categories.filter(
        (category) => category.c_status == "active"
      );
    },
  },
  mutations: {
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
    ADD_CATEGORY(state, category) {
      state.categories.push(category);
    },
    REMOVE_CATEGORY(state, id) {
      let index = state.categories.findIndex((c) => c.category_id == id);
      state.categories.splice(index, 0);
    },
    UPDATE_CATEGORY(state, id) {
      let index = state.categories.findIndex((c) => c.category_id == id);
      state.categories.splice(index, 0);
    },
  },
  actions: {
    addCategory({ commit }, category) {
      return service
        .postCategory(category)
        .then(() => {
          commit("ADD_CATEGORY", category);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchCategories({ commit }) {
      service
        .getCategories()
        .then((response) => {
          commit("SET_CATEGORIES", response.data);
          console.log(response.data)
        })
        .catch((error) => console.log(error));
    },
    removeCategory({ commit }, id) {
      service
        .removeCategory(id)
        .then(() => {
          commit("REMOVE_CATEGORY", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editCategory({ commit }, { id, category }) {
      service
        .updateCategory(id, category)
        .then(() => {
          commit("UPDATE_CATEGORY", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
