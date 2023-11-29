import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import books from "./modules/books";
import categories from "./modules/categories";
import publishers from "./modules/publishers";
import copies from "./modules/copies";
import users from "./modules/users";
import borrowRecords from "./modules/borrowRecords";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    books,
    categories,
    publishers,
    users,
    copies,
    borrowRecords
  },
});
