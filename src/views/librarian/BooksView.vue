<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)" />

      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Books</h4>
          <b-button v-b-modal.addBookModal class="primary-btn">Add Book</b-button>
        </div>
        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy"
          label-sort-asc="" label-sort-desc="" label-sort-clear="" fixed responsive :filter="filter" select-mode="single"
          ref="selectableTable" selectable>
          <template #cell(actions)="row">
            <b-button size="sm" @click="row.toggleDetails(); getSelectedBook(row.item.book_id)"
              class="mr-2 secondary-btn">
              {{ row.detailsShowing ? "Hide" : "Show" }} Details
            </b-button>
          </template>

          <template #row-details="row">
            <b-card class="border-0">
              <b-card-body class="d-flex flex-column pt-2">
                <div class="d-flex justify-content-between">
                  <h4 class="mb-4 book-title">
                    {{ row.item.title }}
                  </h4>
                  <AppDropdown>
                    <template v-slot:text>
                      <b-icon icon="three-dots-vertical"></b-icon>
                    </template>
                    <template v-slot:links>
                      <span>
                        <a v-b-modal.updateBookModal class="dropdown-item d-flex align-items-center py-2" href="#">
                          <b-icon icon="pencil-square" class="mr-2" font-scale=".95"></b-icon>
                          Update
                        </a>
                      </span>
                      <span>
                        <a v-b-modal.removeBookModal class="dropdown-item d-flex align-items-center py-2" href="#">
                          <b-icon icon="trash" class="mr-2" font-scale=".95"></b-icon>
                          Delete
                        </a>
                      </span>
                    </template>
                  </AppDropdown>
                </div>

                <b-list-group class="mb-3">
                  <b-list-group-item v-if="row.item.available_copies > 0"><b>Available Copies:</b> {{
                    row.item.available_copies }}</b-list-group-item>
                  <b-list-group-item v-else>
                    <b>Available Copies:</b>
                    <b-badge class="danger ml-2 py-2">
                      Not Available
                    </b-badge>
                  </b-list-group-item>
                  <b-list-group-item><b>ISBN:</b> {{ row.item.isbn }}</b-list-group-item>
                  <b-list-group-item><b>Author:</b> {{ row.item.author }}</b-list-group-item>
                  <b-list-group-item><b>Publisher:</b>
                    {{ row.item.publisher }}</b-list-group-item>
                  <b-list-group-item><b>Publication Year:</b>
                    {{ row.item.publication_year }}</b-list-group-item>
                  <b-list-group-item><b>Category:</b>
                    {{ row.item.category }}
                  </b-list-group-item>
                  <b-list-group-item><b>No. of Pages:</b>
                    {{ row.item.pages }}</b-list-group-item>
                </b-list-group>
              </b-card-body>
            </b-card>
          </template>
        </b-table>

        <b-pagination v-model.trim="currentPage" :total-rows="rows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>

        <AppModal modalId="updateBookModal" modalSize="lg" hideFooter :key="modalKey">
          <template #modal-header> Update Book </template>
          <template #modal-body>
            <form @submit.prevent="editBook(selectedBookId, updateBook)">
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
                <div class="col-4">
                  <label for="author">Author</label>
                  <b-form-input v-model.trim="updateBook.author" id="author"></b-form-input>
                </div>
                <div class="col-5">
                  <label for="publisher">Publisher</label>
                  <b-form-select v-model.trim="updateBook.publisher_id">
                    <b-form-select-option v-for="publisher in allPublishers" :key="publisher.publisher_id"
                      :value="publisher.publisher_id">
                      {{ publisher.publisher_name }}
                    </b-form-select-option>
                  </b-form-select>
                </div>
                <div class="col-3">
                  <label for="pages">Available Copies</label>
                  <b-form-input v-model="updateBook.available_copies" id="pages" disabled></b-form-input>
                </div>
              </b-row>
              <b-row class="mb-3 px-2">
                <div class="col-4">
                  <label for="publication_year">Publication Year</label>
                  <b-form-input v-model.trim="updateBook.publication_year" id="publication_year"></b-form-input>
                </div>
                <div class="col-4">
                  <label for="pages">No. of Pages</label>
                  <b-form-input v-model.trim.number="updateBook.pages" type="number" id="pages"></b-form-input>
                </div>
                <div class="col-4">
                  <label for="categories">Category</label>
                  <b-form-select v-model.trim="updateBook.category_id">
                    <b-form-select-option value="" disabled>Select ...</b-form-select-option>
                    <b-form-select-option v-for="category in allCategories" :key="category.category_id"
                      :value="category.category_id">
                      {{ category.category_name }}
                    </b-form-select-option>
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
              <div class="col-6" :class="{ 'input-group--error': $v.book.author.$error }">
                <label for="author">Author</label>
                <b-form-input v-model.trim="$v.book.author.$model" id="author"></b-form-input>
                <p class="error-message" v-if="submitStatus === 'error' && !$v.book.author.required">
                  Author is required.
                </p>
              </div>
              <div class="col-6" :class="{ 'input-group--error': $v.book.publisher_id.$error }">
                <label for="publisher">Publisher</label>
                <b-form-select v-model.trim="$v.book.publisher_id.$model">
                  <b-form-select-option value="" disabled>Select ...</b-form-select-option>
                  <b-form-select-option v-for="publisher in allPublishers" :key="publisher.publisher_id"
                    :value="publisher.publisher_id">
                    {{ publisher.publisher_name }}
                  </b-form-select-option>
                </b-form-select>
                <p class="error-message" v-if="submitStatus === 'error' && !$v.book.publisher_id.required
                  ">
                  Publisher is required.
                </p>
              </div>
            </b-row>
            <b-row class="mb-3 px-2">
              <div class="col-4" :class="{
                'input-group--error': $v.book.publication_year.$error,
              }">
                <label for="publication_year">Publication Year</label>
                <b-form-input type="number" v-model.trim="$v.book.publication_year.$model"
                  id="publication_year"></b-form-input>
                <p class="error-message" v-if="submitStatus === 'error' &&
                  !$v.book.publication_year.required
                  ">
                  Publication year is required.
                </p>
                <p class="error-message" v-if="submitStatus === 'error' &&
                  !$v.book.publication_year.numeric
                  ">
                  Publication year must be a number.
                </p>
              </div>
              <div class="col-4" :class="{ 'input-group--error': $v.book.pages.$error }">
                <label for="pages">No. of Pages</label>
                <b-form-input type="number" v-model.trim="$v.book.pages.$model" id="pages"></b-form-input>
                <p class="error-message" v-if="submitStatus === 'error' && !$v.book.pages.numeric
                  ">
                  No. of pages must be a number.
                </p>
                <p class="error-message" v-if="submitStatus === 'error' && !$v.book.pages.required
                  ">
                  No. of pages is required.
                </p>
              </div>
              <div class="col-4" :class="{ 'input-group--error': $v.book.category_id.$error }">
                <label for="categories">Category</label>
                <b-form-select v-model.trim="$v.book.category_id.$model">
                  <b-form-select-option value="" disabled>Select ...</b-form-select-option>
                  <b-form-select-option v-for="category in allCategories" :key="category.category_id"
                    :value="category.category_id">
                    {{ category.category_name }}
                  </b-form-select-option>
                </b-form-select>
                <p class="error-message" v-if="submitStatus === 'error' && !$v.book.category_id.required
                  ">
                  Category is required.
                </p>
              </div>
            </b-row>

            <div class="w-100 mtz-4 d-flex justify-content-end">
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
      <template #modal-header> Delete Book</template>
      <template #modal-body>
        <div class="pb-2">
          Are you sure you want to delete <b>{{ updateBook.title }}</b>?
        </div>

        <div class="w-100 mt-4 d-flex justify-content-end">
          <b-button class="mr-2 secondary-btn text-muted" @click="rerenderModal()">
            Cancel
          </b-button>
          <b-button variant="warning" class="warning-btn" @click="deleteBook(selectedBookId)">
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
import AppSearchbar from '@/components/AppSearchbar.vue';

export default {
  name: "SearchBooksView",
  components: {
    AppDropdown,
    AppModal,
    AppSearchbar,
  },
  data() {
    return {
      sortBy: 'title',
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
      // value: this.book.available_copies,
      value: "",
      perPage: 8,
      filter: null,
      currentPage: 1,
      totalRows: 1,
      book: {
        title: "",
        isbn: "",
        author: "",
        publisher_id: "",
        publication_year: "",
        copies: "",
        pages: "",
        category_id: "",
      },
      modalKey: 0,
      updateBook: {},
      selectedBookId: "",
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
      author: {
        required,
      },
      publisher_id: {
        required,
      },
      publication_year: {
        required,
        numeric,
      },
      pages: {
        required,
        numeric,
      },
      category_id: {
        required,
      }
    },
  },
  created() {
    this.$store.dispatch("fetchBooks");
    this.$store.dispatch("fetchPublishers");
    this.$store.dispatch("fetchCategories");

    // fetch('http://114.29.238.61:3000/api/books')
    //   .then(response => response.json())
    //   .then(data => {
    //     // Log the data to the console
    //     console.log(data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching data from API:', error);
    // });
  },
  mounted() {
    // Set the initial number of items
    this.$root.$on("addNewBook", this.addBook);
    this.showToast();
  },
  // watch: {
  //   'updateBook.category_id'() {
  //     this.updateBook.copy_id = this.activeCategories.filter(c => c.category_id == this.updateBook.category_id)[0].copy_id;
  //   },
  //   'book.category_id'() {
  //     this.book.shelf_id = this.activeCategories.filter(c => c.category_id == this.book.category_id)[0].copy_id;
  //   }
  // },
  methods: {
    rerenderModal() {
      this.modalKey += 1;
      this.clear();
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    getSearchData(data) {
      this.filter = data;
    },

    addBook() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        this.performAction('addBook', this.book, 'success');
        // .catch(() => {
        //     console.log("There was a problem adding the book.");
        // });
      }
    },
    deleteBook(id) {
      this.performAction('removeBook', id, 'warning');
      // .catch((error) => {
      //   console.log(error);
      // });
    },
    getSelectedBook(book_id) {
      this.selectedBookId = book_id;
      let result = this.books.books.filter((book) => book.book_id == book_id);
      for (let book of result) {
        this.updateBook = book;
        console.log(this.updateBook)
      }
    },
    editBook(book_id, book) {
      delete book.status;
      this.performAction('editBook', { book_id, book }, 'info');
      // this.$store.dispatch("editBook", { book_id, book })
      // .catch((error) => {
      //   console.log(error);
      // });
    },
    // setBookPublisher(value) {
    //   this.book.publisher = value;
    //   this.$v.book.publisher.$touch();
    // },
    clear() {
      this.book = {
        title: "",
        isbn: "",
        author: "",
        publisher_id: "",
        publication_year: "",
        copies: "",
        pages: "",
        category_id: "",
      }
    },
    performAction(action, data, toastType) {
      this.$store.dispatch(action, data);

      localStorage.setItem('toastAction', action);
      localStorage.setItem('toastData', JSON.stringify(data));
      localStorage.setItem('toastType', toastType);
    },
    showToast() {
      const toastAction = localStorage.getItem('toastAction');
      if (toastAction) {
        // const toastData = JSON.parse(localStorage.getItem('toastData'));
        const toastType = localStorage.getItem('toastType') || 'success'; // Default to 'success' if not set

        let message = 'Default toast message';
        if (toastAction === 'addBook') {
          message = `Book Added Successfully!`;
        } else if (toastAction === 'editBook') {
          message = `Book Updated Successfully!`;
        } else if (toastAction === 'removeBook') {
          message = `Book Deleted Successfully!`;
        }

        this.$toast[toastType](message, {
          position: "bottom-right",
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: true,
          closeButton: "button",
          icon: true,
          rtl: false
        });

        localStorage.removeItem('toastAction');
        localStorage.removeItem('toastData');
        localStorage.removeItem('toastType');
      }
    }
  },
  computed: {
    ...mapState(["books", "publishers", "categories"]),
    ...mapGetters(["allPublishers", "allCategories"]),
    items() {
      return this.books.books.map((items) => ({ ...items }));
    },
    rows() {
      return this.items.length;
    },
    sortOptions() {
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

.book-title {
  color: #81B29A;
  font-weight: 600;
}
</style>
