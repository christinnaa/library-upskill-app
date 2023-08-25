import service from "@/services/service";
import router from "@/router";

export default {
  state: {
    books: [],
  },
  getters: {
    activeBooks: (state) => {
      return state.books.filter((book) => book.status == "active");
    },
    getBookByIsbn: (state) => (isbn) => {
      return state.books.find((book) => book.isbn === isbn);
    },
  },
  mutations: {
    SET_BOOKS(state, books) {
      state.books = books;
    },
    ADD_BOOK(state, book) {
      state.books.push(book);
    },
    REMOVE_BOOK(state, book_id) {
      let index = state.books.findIndex((b) => b.book_id == book_id);
      state.books.splice(index, 0);
    },
    UPDATE_BOOK(state, book_id) {
      let index = state.books.findIndex((b) => b.book_id == book_id);
      state.books.splice(index, 0);
    },
  },
  actions: {
    async addBook({ commit }, book) {
      try {
        await service
          .postBook(book);
        await commit("ADD_BOOK", book);
        router.go(0);
      } catch (error) {
        console.log(error);
      }
    },
    fetchBooks({ commit }) {
      service
        .getBooks()
        .then(({data}) => {
          commit("SET_BOOKS", data.book);
        })
        .catch((error) => console.log(error));
    },
    removeBook({ commit }, book_id) {
      service
        .removeBook(book_id)
        .then(async () => {
          await commit("REMOVE_BOOK", book_id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async editBook({ commit }, { book_id, book }) {
      try {
        await service
          .updateBook(book_id, book);
        await commit("UPDATE_BOOK", book_id);
        router.go(0);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
