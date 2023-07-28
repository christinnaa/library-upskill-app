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
        .then((response) => {
          commit("SET_ISSUED_BOOKS", response.data);
        })
        .catch((error) => console.log(error));
    },
    addIssuedBook({ commit }, issuedBook) {
      return service
        .postIssuedBook(issuedBook)
        .then(() => {
          commit("ADD_ISSUED_BOOK", issuedBook);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editIssuedBook({ commit }, { id, issuedBook }) {
      return service
        .updateIssuedBook(id, issuedBook)
        .then(() => {
          commit("UPDATE_ISSUED_BOOK", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
