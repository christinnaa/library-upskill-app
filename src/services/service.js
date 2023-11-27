import axios from "axios";

const apiClient = axios.create({
  // baseURL: "http://172.16.4.182:1000/api",
  baseURL: "http://114.29.238.61:3000/api",
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default {
  login(credentials) {
    return apiClient.post("/login", credentials);
  },
  getBooks() {
    return apiClient.get("/books");
  },
  getCategories() {
    return apiClient.get("/categories");
  },
  getIssuedBooks() {
    return apiClient.get("/issue");
  },
  getPublishers() {
    return apiClient.get("/publishers");
  },
  getCopies() {
    return apiClient.get("/copies");
  },
  getUsers() {
    return apiClient.get("/users");
  },
  postBook(book) {
    return apiClient.post("/book", book);
  },
  postPublisher(publisher) {
    return apiClient.post("/publisher", publisher);
  },
  postCategory(category) {
    return apiClient.post("/category", category);
  },
  // postSubcategory(subcategory) {
  //   return apiClient.post("/subcategory", subcategory);
  // },
  postUser(user) {
    return apiClient.post("/user", user);
  },
  postRequest(request) {
    return apiClient.post("/request", request);
  },
  postShelf(shelf) {
    return apiClient.post("/shelf", shelf);
  },
  removeBook(book_id) {
    return apiClient.patch(`/book/inactive/${book_id}`);
  },
  removePublisher(publisher_id) {
    return apiClient.patch(`/publisher/inactive/${publisher_id}`);
  },
  removeCategory(category_id) {
    return apiClient.patch(`/category/inactive/${category_id}`);
  },
  // removeSubcategory(subcategory_id) {
  //   return apiClient.patch(`/subcategory/inactive/${subcategory_id}`);
  // },
  removeUser(user_id) {
    return apiClient.patch(`/user/inactive/${user_id}`);
  },
  removeRequest(request_id) {
    return apiClient.patch(`/request/inactive/${request_id}`);
  },
  // removeShelf(shelf_id) {
  //   return apiClient.patch(`/shelf/inactive/${shelf_id}`);
  // },
  updateBook(book_id, book) {
    return apiClient.put(`/book/${book_id}`, book);
  },
  updatePublisher(publisher_id, publisher) {  
    return apiClient.put(`/publisher/${publisher_id}`, publisher);
  },
  updateCategory(category_id, category) {
    return apiClient.put(`/category/${category_id}`, category);
  },
  updateSubcategory(subcategory_id, subcategory) {
    return apiClient.put(`/subcategory/${subcategory_id}`, subcategory);
  },
  updateIssuedBook(issuedBook_id, issuedBook) {
    return apiClient.put(`/issue/${issuedBook_id}`, issuedBook);
  },
  updateUser(user_id, user) {
    return apiClient.put(`/user/${user_id}`, user);
  },
  updateShelf(shelf_id, shelf) {
    return apiClient.put(`/shelf/${shelf_id}`, shelf);
  },

};
