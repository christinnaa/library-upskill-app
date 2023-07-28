import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    redirect: { name: "search" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/reader/:id?",
    name: "reader",
    component: () => import("../views/reader/ReaderView.vue"),
    redirect: { name: "search" },
    children: [
      {
        path: "/reader/search",
        name: "search",
        component: () => import("../views/reader/SearchBooksView.vue"),
      },
    ],
  },
  {
    path: "/:id?",
    name: "librarian",
    component: () => import("../views/librarian/LibrarianView.vue"),
    redirect: { name: "books" },
    children: [
      {
        path: "/books",
        name: "books",
        component: () => import("../views/librarian/BooksView.vue"),
      },
      {
        path: "/issued-books",
        name: "issued-books",
        component: () => import("../views/librarian/IssuedBooksView.vue"),
      },
      {
        path: "/publishers",
        name: "publishers",
        component: () => import("../views/librarian/PublishersView.vue"),
      },
      {
        path: "/categories",
        name: "categories",
        component: () => import("../views/librarian/CategoriesView.vue"),
      },
      {
        path: "/requests",
        name: "requests",
        component: () => import("../views/librarian/RequestsView.vue"),
      },
      {
        path: "/users",
        name: "users",
        component: () => import("../views/librarian/UsersView.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   const publicPage = "/reader/search";
//   const authRequired = !publicPage.includes(to.path);
//   const loggedIn = localStorage.getItem("user");

//   if (authRequired && !loggedIn) {
//     next("/");
//   } else next();
// });

export default router;
