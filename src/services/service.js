import axios from "axios";

const apiClient = axios.create({
  // baseURL: "https://assessment2.biotechfarms.net/api/",
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc1MzkxNjgxLCJleHAiOjE2NzU0NzgwODF9.cu67ItInlVBlRoMlYgOft5ZLiKTa0KVE3nd9HaU0-OY`,
  },
});

export default {
  getBooks() {
    return apiClient.get("/books");
  },
  getCategories() {
    return apiClient.get("/category");
  },
  getIssuedBooks() {
    return apiClient.get("/issued_books");
  },
  getPublishers() {
    return apiClient.get("/publishers");
  },
  getRequests() {
    return apiClient.get("/request");
  },
  postBook(book) {
    return apiClient.post("/books", book);
  },
  postPublisher(publisher) {
    return apiClient.post("/publishers", publisher);
  },
  postCategory(category) {
    return apiClient.post("/category", category);
  },
  postIssuedBook(issuedBook) {
    return apiClient.post("/issued_books", issuedBook);
  },
  postRequest(request) {
    return apiClient.post("/request", request);
  },
  removeBook(isbn) {
    return apiClient.patch(`/books/delete/${isbn}`);
  },
  removePublisher(publisher_id) {
    return apiClient.patch(`/publishers/delete/${publisher_id}`);
  },
  removeCategory(category_id) {
    return apiClient.patch(`/category/delete/${category_id}`);
  },
  removeRequest(request_id) {
    return apiClient.patch(`/request/delete/${request_id}`);
  },
  updateBook(isbn, book) {
    return apiClient.patch(`/books/${isbn}`, book);
  },
  updatePublisher(publisher_id, publisher) {
    return apiClient.patch(`/publishers/${publisher_id}`, publisher);
  },
  updateCategory(category_id, category) {
    return apiClient.patch(`/category/${category_id}`, category);
  },
  updateIssuedBook(issuedBook_id, issuedBook) {
    return apiClient.patch(`/issued_books/${issuedBook_id}`, issuedBook);
  },
  login(credentials) {
    return apiClient.post("/users/login", credentials);
  },
};
