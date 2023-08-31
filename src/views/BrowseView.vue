<template>
  <div class="wrapper">
    <main>
      <div
        class="nav__header container-fluid w-100 px-4 mb-4 d-flex align-items-center justify-content-between rounded bg-white">
        <div class="search__container w-100">
          <b-icon icon="search" class="mr-3"></b-icon>
          <input type="text" placeholder="Search" class="w-75 border-0" id="filter-input" v-model="filter" />
        </div>

        <b-button class="rounded primary-btn" v-b-modal.loginModal>Login</b-button>
      </div>

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

                <div class="mb-3">
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
              </b-card-body>
            </b-card> </template>user
        </b-table>

        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>
      </div>

      <AppModal modalId="loginModal" modalSize="md" hideFooter :key="modalKey">
        <template #modal-header> Login </template>
        <template #modal-body>
          <form class="px-2" @submit.prevent="login">
            <div class="mb-3 pt-0" :class="{
              'input-group--error': $v.username.$error,
            }">
              <label for="username">Username</label>
              <b-input id="username" v-model="username"></b-input>
              <p class="error-message" v-if="submitStatus === 'error' &&
                !$v.username.required
                ">
                Username is required.
              </p>
            </div>
            <div class="mb-2" :class="{
              'input-group--error': $v.password.$error,
            }">
              <label for="password">Password</label>
              <b-form-input type="password" id="password" v-model="password"></b-form-input>
              <p class="error-message" v-if="submitStatus === 'error' &&
                !$v.password.required
                ">
                Password is required.
              </p>
            </div>
            <div class="w-100 mt-4 d-flex justify-content-center">
              <b-button class="rounded-pill w-25 primary-btn" type="submit">
                Login
              </b-button>
            </div>
          </form>
        </template>
      </AppModal>
    </main>
  </div>
</template>
  
<script>
import AppModal from "@/components/AppModal.vue";
import { required } from "vuelidate/lib/validators";
import { mapState, mapGetters } from "vuex";

export default {
  name: "BrowseView",
  components: {
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

      perPage: 14,
      currentPage: 1,
      totalRows: 1,
      filter: null,
      modalKey: 0,
      request: {
        isbn: "",
        title: "",
        date_requested: "",
        librarian_id: "",
      },
      selectedIsbn: "",
      username: "",
      password: "",
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
    async login() {
      await this.$store.dispatch("login", { username: this.username, password: this.password });
      this.loggedIn = this.$store.state.auth.loggedIn;
    },
  },
  computed: {
    ...mapState(["books"]),
    ...mapGetters(["activeBooks", "users"]),
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
main {
  margin-left: 0;
}

.table__container {
  background: white;
}

.search {
  height: 50px;

}
.main__header{
  button {
  height: 50px;
}
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
  