import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/",
    name: "home",
    redirect: { name: "browse" },
  },
  {
    path: "/browse",
    name: "browse",
    component: () => import("../views/BrowseView.vue"),
  },
  {
    path: "/reader/:id?",
    name: "reader",
    component: () => import("../views/reader/ReaderView.vue"),
    redirect: { name: "reader-browse" },
    children: [
      {
        path: "/reader/browse",
        name: "reader-browse",
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
      {
        path: "/shelves",
        name: "shelves",
        component: () => import("../views/librarian/ShelvesView.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, _from, next) => {
//   const publicPage = "/browse";
//   const authRequired = !publicPage.includes(to.path);
//   const loggedIn = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   if (authRequired && !loggedIn) {
//     next("/");
//   } 
//   else if (role !== "admin" && to.path !== "/reader/browse" && to.path !== "/browse") {
//     next("/reader/browse")
//   }
//   else {
//     next();
//   }
// });



export default router;
