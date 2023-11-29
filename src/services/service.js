import axios from "axios";

const apiClient = axios.create({
  // baseURL: "http://172.16.4.182:1000/api",
  // baseURL: "http://114.29.238.61:3000/api",
  baseURL: "http://172.16.4.182:3100/api",
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
  getBorrowRecords() {
    return apiClient.get("/borrow-records");
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

  postBook(books) {
    return apiClient.post("/books", books);
  },
  postPublisher(publishers) {
    return apiClient.post("/publisher", publishers);
  },
  postCategory(categories) {
    return apiClient.post("/categories", categories);
  },
  postUser(users) {
    return apiClient.post("/users", users);
  },
  postBorrowRecord(borrowRecords) {
    return apiClient.post("/borrow-records", borrowRecords);
  },
  postCopies(copies) {
    return apiClient.post("/copies", copies);
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
  removeBorrowRecord(borrow_id) {
    return apiClient.patch(`/user/inactive/${borrow_id}`);
  },
  removeCopy(copy_id) {
    return apiClient.patch(`/user/inactive/${copy_id}`);
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
  updateUser(user_id, user) {
    return apiClient.put(`/user/${user_id}`, user);
  },
  updateBorrowRecord(borrow_id, borrowRecord) {
    return apiClient.put(`/user/${borrow_id}`, borrowRecord);
  },
  updateCopy(copy_id, copy) {
    return apiClient.put(`/user/${copy_id}`, copy);
  },

};
