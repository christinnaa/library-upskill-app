import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import books from "./modules/books";
import categories from "./modules/categories";
import issuedBooks from "./modules/issuedBooks";
import publishers from "./modules/publishers";
import requests from "./modules/requests";
import users from "./modules/users";
import shelves from "./modules/shelves";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    books,
    categories,
    issuedBooks,
    publishers,
    requests,
    users,
    shelves
  },
});
