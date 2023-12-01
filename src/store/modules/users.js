import router from "@/router";
import service from "@/services/service";

export default {
  state: {
    users: [],
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    ADD_USER(state, user) {
      state.users.push(user);
    },
    REMOVE_USER(state, id) {
      let index = state.users.findIndex((s) => s.user_id == id);
      state.users.splice(index, 0);
    },
    UPDATE_USER(state, id) {
      let index = state.users.findIndex((s) => s.user_id == id);
      state.users.splice(index, 0);
    },
  },
  actions: {
    async addUser({ commit }, user) {
      try {
        await service
          .postUser(user);
        await commit("ADD_USER", user);
        router.go(0);
      } catch (error) {
        console.log(error);
      }
    },
    fetchUsers({ commit }) {
      service
        .getUsers()
        .then(({data}) => {
          commit("SET_USERS", data);
          // console.log(data)
        })
        .catch((error) => console.log(error));
    },
    removeUser({ commit }, id) {
      service
        .removeUser(id)
        .then(async () => {
          await commit("REMOVE_USER", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editUser({ commit }, { user_id, user }) {
      service
        .updateUser(user_id, user)
        .then(async () => {
          await commit("UPDATE_USER", user_id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
