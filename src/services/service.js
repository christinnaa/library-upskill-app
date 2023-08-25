import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://172.16.4.182:1000/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default {
  async getBooks() {
    return await apiClient.get("/book");
  },
  async login(credentials) {
    return await apiClient.post("/login", credentials);
  },
  getCategories() {
    return apiClient.get("/category");
  },
  getIssuedBooks() {
    return apiClient.get("/issue");
  },
  getPublishers() {
    return apiClient.get("/publisher");
  },
  getUsers() {
    return apiClient.get("/user");
  },
  getShelves() {
    return apiClient.get("/shelf");
  },
  getRequests() {
    return apiClient.get("/request");
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
  postIssuedBook(issuedBook) {
    return apiClient.post("/issue", issuedBook);
  },
  postUser(user) {
    return apiClient.post("/user", user);
  },
  postRequest(request) {
    return apiClient.post("/request", request);
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
  removeUser(user_id) {
    return apiClient.patch(`/user/inactive/${user_id}`);
  },
  removeRequest(request_id) {
    return apiClient.patch(`/request/inactive/${request_id}`);
  },
  updateBook(book_id, book) {
    return apiClient.put(`/book/${book_id}`, book);
  },
  updatePublisher(publisher_id, publisher) {  
    return apiClient.put(`/publisher/${publisher_id}`, publisher);
  },
  updateCategory(category_id, category) {
    return apiClient.put(`/category/${category_id}`, category);
  },
  updateIssuedBook(issuedBook_id, issuedBook) {
    return apiClient.put(`/issue/${issuedBook_id}`, issuedBook);
  },
  updateUser(user_id, user) {
    return apiClient.put(`/user/${user_id}`, user);
  },

};
