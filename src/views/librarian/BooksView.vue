<template>
  <div class="wrapper">
    <main>
      <div
        class="nav__header container-fluid w-100 px-4 mb-4 d-flex align-items-center justify-content-between rounded bg-white">
        <div class="search__container w-100">
          <b-icon icon="search" class="mr-3"></b-icon>
          <input type="text" placeholder="Search" class="w-75 border-0" id="filter-input" v-model.trim="filter" />
        </div>

        <AppDropdown>
          <template v-slot:text>
            Admin
            <b-icon class="ml-2" font-scale=".75" icon="caret-down-fill"></b-icon>
          </template>
          <template v-slot:links>
            <a class="dropdown-item" @click="logout">Logout</a>
          </template>
        </AppDropdown>
      </div>

      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Books</h4>
          <b-button v-b-modal.addBookModal class="primary-btn">Add Book</b-button>
        </div>
        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" label-sort-asc=""
          label-sort-desc="" label-sort-clear="" responsive :filter="filter" @filtered="onFiltered">
          <template #cell(actions)="row">
            <b-button size="sm" @click="row.toggleDetails" class="mr-2 secondary-btn">
              {{ row.detailsShowing ? "Hide" : "Show" }} Details
            </b-button>
          </template>

          <template #row-details="row">
            <b-card class="border-0">
              <b-card-body class="d-flex flex-column pt-2">
                <div class="d-flex justify-content-between">
                  <h4 class="mb-3 text-dark">
                    {{ row.item.title }}
                  </h4>

                  <AppDropdown>
                    <template v-slot:text>
                      <b-icon @click="getSelectedBook(row.item.isbn)" icon="three-dots-vertical"></b-icon>
                    </template>
                    <template v-slot:links>
                      <li>
                        <a v-b-modal.updateBookModal class="dropdown-item d-flex align-items-center py-2" href="#">
                          <b-icon icon="pencil-square" class="mr-2" font-scale=".95"></b-icon>
                          Update
                        </a>
                      </li>
                      <li v-if="row.item.status == 'active'">
                        <a v-b-modal.removeBookModal class="dropdown-item d-flex align-items-center py-2" href="#">
                          <b-icon icon="slash-circle" class="mr-2" font-scale=".95"></b-icon>
                          Mark as inactive
                        </a>
                      </li>
                      <li v-else-if="row.item.status == 'inactive'">
                        <a @click="editBook(selectedIsbn, updateBook)"
                          class="dropdown-item d-flex align-items-center py-2" href="#">
                          <b-icon icon="check2-circle" class="mr-2" font-scale=".95"></b-icon>
                          Mark as active
                        </a>
                      </li>
                    </template>
                  </AppDropdown>
                </div>

                <b-card-text>{{ row.item.description }}</b-card-text>

                <b-list-group class="mb-3">
                  <b-list-group-item><b>ISBN:</b> {{ row.item.isbn }}</b-list-group-item>
                  <b-list-group-item><b>Author:</b> {{ row.item.author }}</b-list-group-item>
                  <b-list-group-item><b>Publisher:</b>
                    {{ row.item.publisher_name }}</b-list-group-item>
                  <b-list-group-item><b>Publication Year:</b>
                    {{ row.item.publication_year }}</b-list-group-item>
                  <b-list-group-item><b>Category:</b>
                    <!-- <b-badge pill variant="light" class="ml-2" :key="index"
                                            v-for="(category, index) in row.item.subcategories">{{ category }}</b-badge> -->
                    <b-badge pill variant="light" class="ml-2">{{
                      row.item.category_name
                    }}</b-badge>
                  </b-list-group-item>
                  <b-list-group-item><b>No. of Pages:</b>
                    {{ row.item.no_of_pages }}</b-list-group-item>
                  <b-list-group-item><b>No. of Copies:</b>
                    {{ row.item.no_of_copies }}</b-list-group-item>
                  <b-list-group-item><b>Shelf:</b> {{ row.item.shelf }}</b-list-group-item>
                  <b-list-group-item><b>Status:</b>
                    <b-badge pill v-if="row.item.status == 'active'" variant="success" class="ml-2 text-white">{{
                      row.item.status
                    }}</b-badge>
                    <b-badge pill v-if="row.item.status == 'inactive'" variant="warning" class="ml-2 text-white">{{
                      row.item.status
                    }}</b-badge>
                  </b-list-group-item>
                </b-list-group>
              </b-card-body>
            </b-card>
          </template>
        </b-table>

        <b-pagination v-model.trim="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>

        <AppModal modalId="updateBookModal" modalSize="lg" hideFooter :key="modalKey">
          <template #modal-header> Update Book </template>
          <template #modal-body>
            <form @submit.prevent="editBook(selectedIsbn, updateBook)">
              <b-row class="mb-3 px-2">
                <div class="col-6">
                  <label for="title">Title</label>
                  <b-form-input v-model.trim="updateBook.title" id="title"></b-form-input>
                </div>
                <div class="col-6">
                  <label for="ISBN">ISBN</label>
                  <b-form-input v-model.trim="updateBook.isbn" id="isbn"></b-form-input>
                </div>
              </b-row>
              <b-row class="mb-3 px-2">
                <div class="col-12">
                  <label for="description">Description</label>
                  <b-form-textarea id="description" v-model.trim="updateBook.description" rows="3"
                    max-rows="6"></b-form-textarea>
                </div>
              </b-row>
              <b-row class="mb-3 px-2">
                <div class="col-6">
                  <label for="author">Author</label>
                  <b-form-input v-model.trim="updateBook.author" id="author"></b-form-input>
                </div>
                <div class="col-6">
                  <label for="publisher">Publisher</label>
                  <b-form-select v-model.trim="updateBook.p_publisher_id">
                    <b-form-select-option value="" disabled>Select</b-form-select-option>
                    <b-form-select-option v-for="publisher in activePublishers" :key="publisher.publisher_id"
                      :value="publisher.publisher_id">{{ publisher.publisher_name }}</b-form-select-option>
                  </b-form-select>
                </div>
              </b-row>
              <b-row class="mb-3 px-2">
                <div class="col-3">
                  <label for="publication_year">Publication Year</label>
                  <b-form-input v-model.trim="updateBook.publication_year" id="publication_year"></b-form-input>
                </div>
                <div class="col-3">
                  <label for="no_of_copies">No. of Copies</label>
                  <b-form-input v-model.trim.number="updateBook.no_of_copies" type="number"
                    id="no_of_copies"></b-form-input>
                </div>
                <div class="col-3">
                  <label for="shelf">Shelf</label>
                  <b-form-input v-model.trim.number="updateBook.shelf" type="number" id="shelf"></b-form-input>
                </div>
                <div class="col-3">
                  <label for="no_of_pages">No. of Pages</label>
                  <b-form-input v-model.trim.number="updateBook.no_of_pages" type="number"
                    id="no_of_pages"></b-form-input>
                </div>
              </b-row>
              <b-row class="mb-2 px-2">
                <div class="col-12">
                  <label for="categories">Categories</label>
                  <!-- <multiselect v-model.trim="book.c_category_id" :options="cats" :multiple="true"
                                    group-values="subcategories" group-label="category_name"
                                    placeholder="Type to search">
                                    <span slot="noResult">Oops! No elements found. Consider changing the search
                                        query.</span>
                                </multiselect> -->
                  <b-form-select v-model.trim="updateBook.c_category_id">
                    <b-form-select-option value="" disabled>Select</b-form-select-option>
                    <b-form-select-option v-for="category in activeCategories" :key="category.category_id"
                      :value="category.category_id">{{ category.category_name }}</b-form-select-option>
                  </b-form-select>
                </div>
              </b-row>

              <div class="w-100 mt-4 d-flex justify-content-end">
                <b-button class="mr-2 secondary-btn" @click="rerenderModal()">
                  Cancel
                </b-button>
                <b-button type="submit" class="primary-btn"> Update </b-button>
              </div>
            </form>
          </template>
        </AppModal>
      </div>

      <AppModal :key="modalKey" modalId="addBookModal" modalSize="lg" submitMethod="addBook" hideFooter>
        <template #modal-header> Add Book </template>
        <template #modal-body>
          <form @submit.prevent="addBook">
            <b-row class="mb-3 px-2">
              <div class="col-6" :class="{ 'input-group--error': $v.book.title.$error }">
                <label for="title">Title</label>
                <b-form-input v-model.trim="$v.book.title.$model" id="title"></b-form-input>
                <p class="error-message" v-if="submitStatus === 'error' && !$v.book.title.required">
                  Title is required.
                </p>
              </div>
              <div class="col-6" :class="{ 'input-group--error': $v.book.isbn.$error }">
                <label for="ISBN">ISBN</label>
                <b-form-input v-model.trim="$v.book.isbn.$model" id="isbn"></b-form-input>
                <p class="error-message" v-if="submitStatus === 'error' && !$v.book.isbn.required">
                  ISBN is required.
                </p>
              </div>
            </b-row>
            <b-row class="mb-3 px-2">
              <div class="col-12" :class="{ 'input-group--error': $v.book.description.$error }">
                <label for="description">Description</label>
                <b-form-textarea id="description" v-model.trim="$v.book.description.$model" rows="3"
                  max-rows="6"></b-form-textarea>
                <p class="error-message" v-if="
                  submitStatus === 'error' && !$v.book.description.required
                ">
                  Description is required.
                </p>
              </div>
            </b-row>
            <b-row class="mb-3 px-2">
              <div class="col-6" :class="{ 'input-group--error': $v.book.author.$error }">
                <label for="author">Author</label>
                <b-form-input v-model.trim="$v.book.author.$model" id="author"></b-form-input>
                <p class="error-message" v-if="submitStatus === 'error' && !$v.book.author.required">
                  Author is required.
                </p>
              </div>
              <div class="col-6" :class="{ 'input-group--error': $v.book.p_publisher_id.$error }">
                <label for="publisher">Publisher</label>
                <b-form-select v-model.trim="$v.book.p_publisher_id.$model">
                  <b-form-select-option value disabled>Select</b-form-select-option>
                  <b-form-select-option v-for="publisher in activePublishers" :key="publisher.publisher_id"
                    :value="publisher.publisher_id">{{ publisher.publisher_name }}</b-form-select-option>
                </b-form-select>
                <p class="error-message" v-if="
                  submitStatus === 'error' && !$v.book.p_publisher_id.required
                ">
                  Publisher is required.
                </p>
              </div>
            </b-row>
            <b-row class="mb-3 px-2">
              <div class="col-3" :class="{
                'input-group--error': $v.book.publication_year.$error,
              }">
                <label for="publication_year">Publication Year</label>
                <b-form-input v-model.trim="$v.book.publication_year.$model" id="publication_year"></b-form-input>
                <p class="error-message" v-if="
                  submitStatus === 'error' &&
                  !$v.book.publication_year.required
                ">
                  Publication year is required.
                </p>
                <p class="error-message" v-if="
                  submitStatus === 'error' &&
                  !$v.book.publication_year.numeric
                ">
                  Publication year must be a number.
                </p>
              </div>
              <div class="col-3" :class="{ 'input-group--error': $v.book.no_of_copies.$error }">
                <label for="no_of_copies">No. of Copies</label>
                <b-form-input v-model.number="$v.book.no_of_copies.$model" id="no_of_copies"></b-form-input>
                <p class="error-message" v-if="
                  submitStatus === 'error' && !$v.book.no_of_copies.numeric
                ">
                  No. of copies must be a number.
                </p>
                <p class="error-message" v-if="
                  submitStatus === 'error' && !$v.book.no_of_copies.required
                ">
                  No. of copies is required.
                </p>
              </div>
              <div class="col-3" :class="{ 'input-group--error': $v.book.shelf.$error }">
                <label for="shelf">Shelf</label>
                <b-form-input v-model.trim="$v.book.shelf.$model" id="shelf"></b-form-input>
                <p class="error-message" v-if="submitStatus === 'error' && !$v.book.shelf.numeric">
                  Shelf must be a number.
                </p>
                <p class="error-message" v-if="submitStatus === 'error' && !$v.book.shelf.required">
                  Shelf is required.
                </p>
              </div>
              <div class="col-3" :class="{ 'input-group--error': $v.book.no_of_pages.$error }">
                <label for="no_of_pages">No. of Pages</label>
                <b-form-input v-model.trim="$v.book.no_of_pages.$model" id="no_of_pages"></b-form-input>
                <p class="error-message" v-if="
                  submitStatus === 'error' && !$v.book.no_of_pages.numeric
                ">
                  No. of pages must be a number.
                </p>
                <p class="error-message" v-if="
                  submitStatus === 'error' && !$v.book.no_of_pages.required
                ">
                  No. of pages is required.
                </p>
              </div>
            </b-row>
            <b-row class="mb-2 px-2">
              <div class="col-12" :class="{ 'input-group--error': $v.book.c_category_id.$error }">
                <label for="categories">Category</label>
                <b-form-select v-model.trim="$v.book.c_category_id.$model">
                  <b-form-select-option value="" disabled>Select</b-form-select-option>
                  <b-form-select-option v-for="category in activeCategories" :key="category.category_id"
                    :value="category.category_id">{{ category.category_name }}</b-form-select-option>
                </b-form-select>
                <p class="error-message" v-if="
                  submitStatus === 'error' && !$v.book.c_category_id.required
                ">
                  Category is required.
                </p>
              </div>
            </b-row>

            <div class="w-100 mt-4 d-flex justify-content-end">
              <b-button class="mr-2 secondary-btn" @click="rerenderModal()">
                Cancel
              </b-button>
              <b-button type="submit" class="primary-btn"> Add </b-button>
            </div>
          </form>
        </template>
      </AppModal>
    </main>

    <AppModal modalId="removeBookModal" hideFooter>
      <template #modal-header> Mark Selected Book as Inactive</template>
      <template #modal-body>
        <div class="pb-2">
          Are you sure you want to mark
          <b>{{ updateBook.title }}</b> as inactive?
        </div>

        <div class="w-100 mt-4 d-flex justify-content-end">
          <b-button class="mr-2 secondary-btn text-muted" @click="rerenderModal()">
            Cancel
          </b-button>
          <b-button variant="warning" class="warning-btn" @click="deleteBook(selectedIsbn)">
            Yes
          </b-button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script>
import AppDropdown from "@/components/AppDropdown.vue";
import AppModal from "@/components/AppModal.vue";
import { required, numeric } from "vuelidate/lib/validators";
import { mapState, mapGetters } from "vuex";

export default {
  name: "SearchBooksView",
  components: {
    AppDropdown,
    AppModal,
  },
  data() {
    return {
      fields: [
        { key: "isbn", thStyle: { textTransform: "uppercase" } },
        {
          key: "title",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
        {
          key: "author",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
        { key: "actions", thStyle: { textTransform: "uppercase" } },
      ],

      perPage: 20,
      currentPage: 1,
      totalRows: 1,
      filter: null,
      book: this.newBookObject(),
      modalKey: 0,
      updateBook: {},
      book_id: 0,
      selectedIsbn: "",
      submitStatus: null,
    };
  },
  validations: {
    book: {
      title: {
        required,
      },
      isbn: {
        required,
      },
      description: {
        required,
      },
      author: {
        required,
      },
      p_publisher_id: {
        required,
      },
      publication_year: {
        required,
        numeric,
      },
      no_of_copies: {
        required,
        numeric,
      },
      shelf: {
        required,
        numeric,
      },
      no_of_pages: {
        required,
        numeric,
      },
      c_category_id: {
        required,
      },
    },
  },
  created() {
    this.$store.dispatch("fetchBooks");
    this.$store.dispatch("fetchPublishers");
    this.$store.dispatch("fetchCategories");
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
    this.$root.$on("addNewBook", this.addBook);
  },
  methods: {
    rerenderModal() {
      this.modalKey += 1;
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    addBook() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        this.$store
          .dispatch("addBook", this.book)
          .then(() => {
            // setTimeout(() => {
            //   this.$router.go(0);
            // }, 700);
          })
          .catch(() => {
            console.log("There was a problem adding the book.");
          });
      }
    },
    deleteBook(isbn) {
      this.$store
        .dispatch("removeBook", isbn)
        .then(() => {
          // setTimeout(() => {
          //   this.$router.go(0);
          // }, 750);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSelectedBook(isbn) {
      this.selectedIsbn = isbn;
      let result = this.books.books.filter((book) => book.isbn == isbn);
      for (let book of result) {
        this.updateBook = book;
      }
    },
    editBook(isbn, book) {
      this.$store
        .dispatch("editBook", { isbn, book })
        .then(() => {
          // this.rerenderModal();
          // setTimeout(() => {
          //   this.$router.go(0);
          // }, 750);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    newBookObject() {
      return {
        title: "",
        isbn: "",
        description: "",
        author: "",
        p_publisher_id: "",
        publication_year: "",
        no_of_copies: "",
        shelf: "",
        no_of_pages: "",
        c_category_id: "",
      };
    },

    logout() {
      this.$store.dispatch("logout")
    },
    setBookPublisher(value) {
      this.book.publisher = value;
      this.$v.book.publisher.$touch();
    },
  },
  computed: {
    ...mapState(["books"]),
    ...mapGetters(["activePublishers", "activeCategories"]),
    items() {
      return this.books.books.map((item) => ({
        ...item,
        book_id: this.book_id++,
      }));
    },
    cats() {
      return this.categories.categories;
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "vue-multiselect/dist/vue-multiselect.min.css";

.multiselect__option--highlight {
  background: #333;
}

.table__container {
  background: white;
}

.nav__header {
  height: 70px;
}

input {
  outline: none;
}

.bi-x-lg {
  cursor: pointer;
  transition: 300ms;

  &:hover {
    color: lighten(black, 40%);
  }
}

.dropdown-toggle {
  &::after {
    display: none;
  }

  border: 0;
}

.list-group-item {
  span {
    text-transform: capitalize;
  }
}
</style>
