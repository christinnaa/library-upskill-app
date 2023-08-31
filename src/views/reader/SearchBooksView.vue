<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)"/>

      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex mt-2 mb-4">
          <h4>Books</h4>
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
                  <h4 class="mb-3">
                    {{ row.item.title }}
                  </h4>
                  <b-icon @click="row.toggleDetails" class="h6 mt-1" icon="x-lg"></b-icon>
                </div>

                <div class="mb-4">
                  <b-badge pill v-if="row.item.copies > 0" class="bg-success">AVAILABLE: <b>{{
                    row.item.copies
                  }}</b></b-badge>
                  <b-badge pill v-else-if="row.item.copies == 0" class="bg-light text-secondary">NOT
                    AVAILABLE</b-badge>
                </div>

                <b-list-group class="mb-3">
                  <b-list-group-item><b>ISBN:</b> {{ row.item.isbn }}</b-list-group-item>
                  <b-list-group-item><b>Author:</b> {{ row.item.author }}
                  </b-list-group-item>
                  <b-list-group-item><b>Publisher:</b>
                    {{ row.item.p_name }}</b-list-group-item>
                  <b-list-group-item><b>Publication Year:</b>
                    {{ row.item.publication_year }}</b-list-group-item>
                  <b-list-group-item><b>Category: </b>
                  {{ row.item.cat_name }}</b-list-group-item>
                  <b-list-group-item><b>Subcategory: </b>
                  {{ row.item.subcat_name }}</b-list-group-item>
                  <b-list-group-item><b>No. of Pages:</b>
                    {{ row.item.pages }}</b-list-group-item>
                  <b-list-group-item><b>Shelf:</b> {{ row.item.shelf_name }}</b-list-group-item>
                </b-list-group>

                <b-button @click="getSelectedBook(row.item.book_id)" v-if="row.item.copies > 0"
                  class="mx-auto rounded-pill primary-btn">
                  Borrow
                </b-button>
              </b-card-body>
            </b-card> </template>user
        </b-table>

        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>
      </div>

    </main>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { mapState, mapGetters } from "vuex";
import AppSearchbar from "@/components/AppSearchbar.vue";

export default {
  name: "SearchBooksView",
  components: {
    AppSearchbar
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

      perPage: 14,
      currentPage: 1,
      totalRows: 1,
      filter: null,
      modalKey: 0,
      request: {
        book_id: "",
        date_requested: "",
        user_id: "",
      },
      selectedBookId: "",
      loggedIn: false,
      submitStatus: null
    };
  },
  validations: {
    username: {
      required
    },
    password: {
      required
    }
  },
  created() {
    this.$store.dispatch("fetchBooks");
    this.$store.dispatch("fetchUsers");
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    addRequest() {
      this.$store
        .dispatch("addRequest", this.request)
    },
    getSearchData(data){
      this.filter = data;
    },
    getSelectedBook(book_id) {
      this.selectedBookId = book_id;
      let result = this.activeBooks.find((book) => book.book_id == book_id);
        console.log("result:", result);
        this.request.book_id = result.book_id;
        this.request.date_requested = new Date().toLocaleDateString();
        this.request.user_id = this.userId;

        console.log("request:", this.request);
        this.addRequest();
    },
  },
  computed: {
    ...mapState(["books", "users"]),
    ...mapGetters(["activeBooks"]),
    username() {
      return localStorage.getItem("username");
    },
    userId() {
      return this.users.users.find(u => u.username == this.username).user_id
    },
    items() {
      return this.activeBooks;
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

form {
  // width: 30rem;
  padding: 0 35px;
  border-radius: 10px;

  input {
    height: 48px;
  }

  button {
    height: 42px;
  }
}
</style>
