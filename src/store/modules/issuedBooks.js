import service from "@/services/service";
import router from "@/router";

export default {
  state: {
    issuedBooks: [],
  },
  mutations: {
    SET_ISSUED_BOOKS(state, issuedBooks) {
      state.issuedBooks = issuedBooks;
    },
    ADD_ISSUED_BOOK(state, issuedBook) {
      state.issuedBooks.push(issuedBook);
    },
    UPDATE_ISSUED_BOOK(state, id) {
      let index = state.issuedBooks.findIndex((ib) => ib.issuedBook_id == id);
      state.issuedBooks.splice(index, 0);
    },
  },
  actions: {
    fetchIssuedBooks({ commit }) {
      service
        .getIssuedBooks()
        .then(({data}) => {
          commit("SET_ISSUED_BOOKS", data.issue);
        })
        .catch((error) => console.log(error));
    },
    async addIssuedBook({ commit }, issuedBook) {
      try {
        await service
          .postIssuedBook(issuedBook);
        await commit("ADD_ISSUED_BOOK", issuedBook);
        router.go(0);
      } catch (error) {
        console.log(error);
      }
    },
    async editIssuedBook({ commit }, { id, issuedBook }) {
      try {
        await service
          .updateIssuedBook(id, issuedBook);
        await commit("UPDATE_ISSUED_BOOK", id);
        router.go(0);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
