import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import books from "./modules/books";
import categories from "./modules/categories";
import issuedBooks from "./modules/issuedBooks";
import publishers from "./modules/publishers";
import copies from "./modules/copies";
import requests from "./modules/requests";
import users from "./modules/users";
import shelves from "./modules/shelves";
import subcategories from "./modules/subcategories";

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
    shelves,
    subcategories,
    copies
  },
});
