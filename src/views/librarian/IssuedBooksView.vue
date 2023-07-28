<template>
  <div class="wrapper">
    <main>
      <div
        class="nav__header container-fluid w-100 px-4 mb-4 d-flex align-items-center justify-content-between rounded bg-white">
        <div class="search__container w-100">
          <b-icon icon="search" class="mr-3"></b-icon>
          <input type="text" placeholder="Search" class="w-75 border-0" id="filter-input" v-model="filter" />
        </div>

        <AppDropdown>
          <template v-slot:text>
            Admin
            <b-icon class="ml-2" font-scale=".75" icon="caret-down-fill"></b-icon>
          </template>
          <template v-slot:links>
            <a class="dropdown-item" @click="logout">Logout </a>
          </template>
        </AppDropdown>
      </div>

      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Issued Books</h4>
          <div>
            <b-button v-if="selectedRow[0] && selectedIssuedBook.ib_status == 'active'" v-b-modal.updateIssuedBookModal
              class="mr-2 primary-btn">Update</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" label-sort-asc=""
          label-sort-desc="" label-sort-clear="" fixed responsive :filter="filter" select-mode="single"
          ref="selectableTable" selectable @row-selected="onRowSelected" @filtered="onFiltered">
          <template #cell(ib_status)="row">
            <b-badge pill v-if="row.item.ib_status == 'Overdue'" class="bg-danger">{{ row.item.ib_status }}</b-badge>
            <b-badge pill v-else-if="row.item.ib_status == 'active'" class="bg-primary">{{
              row.item.ib_status
            }}</b-badge>
            <b-badge pill v-else-if="row.item.ib_status == 'returned'" class="bg-success">{{
              row.item.ib_status
            }}</b-badge>
          </template>
        </b-table>

        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>
      </div>
    </main>

    <AppModal modalId="updateIssuedBookModal" hideFooter :key="modalKey">
      <template #modal-header> Update Issued Book </template>
      <template #modal-body>
        <form class="px-2" @submit.prevent="
          editIssuedBook(selectedIssuedBook.issue_id, selectedIssuedBook)
        ">
          <div class="mb-2" :class="{
            'input-group--error': $v.selectedIssuedBook.date_returned.$error,
          }">
            <label for="date_returned">Date Returned</label>
            <b-form-input v-model="selectedIssuedBook.date_returned" type="date" id="date_returned"></b-form-input>
            <p class="error-message" v-if="
              submitStatus === 'error' &&
              !$v.selectedIssuedBook.date_returned.required
            ">
              Date is required.
            </p>
          </div>
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
</template>

<script>
import AppModal from "@/components/AppModal.vue";
import AppDropdown from "@/components/AppDropdown.vue";
import moment from "moment";
import { required } from "vuelidate/lib/validators";

import { mapState } from "vuex";

export default {
  props: [],
  components: {
    AppDropdown,
    AppModal,
  },
  data() {
    return {
      fields: [
        {
          key: "title",
          thStyle: { textTransform: "uppercase", width: "400px" },
          sortable: true,
        },
        {
          key: "reader_name",
          thStyle: { textTransform: "uppercase", width: "190px" },
          sortable: true,
        },
        {
          key: "date_issued",
          thStyle: { textTransform: "uppercase", width: "160px" },
          sortable: true,
          formatter: (value) => {
            return moment(value).format("MMM DD, YYYY");
          },
        },
        {
          key: "return_date",
          label: " return by",
          thStyle: { textTransform: "uppercase", width: "160px" },
          sortable: true,
          formatter: (value) => {
            return moment(value).format("MMM DD, YYYY");
          },
        },

        {
          key: "date_returned",
          thStyle: { textTransform: "uppercase", width: "180px" },
          sortable: true,
          formatter: (value) => {
            if (value) return moment(value).format("MMM DD, YYYY");
          },
        },
        {
          key: "ib_status",
          label: "status",
          thStyle: { textTransform: "uppercase", width: "110px" },
          sortable: true,
        },
      ],
      perPage: 12,
      currentPage: 1,
      totalRows: 1,
      filter: null,
      modalKey: 0,
      selectedRow: [],
      selectedIssuedBook: {},
      selectedBookData: {},
      submitStatus: null,
    };
  },
  validations: {
    selectedIssuedBook: {
      date_returned: {
        required,
      },
    },
  },
  created() {
    this.$store.dispatch("fetchIssuedBooks");
    this.$store.dispatch("fetchBooks");
  },
  computed: {
    ...mapState(["issuedBooks", "books"]),
    items() {
      return this.issuedBooks.issuedBooks;
    },
    sortOptions() {
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
  },
  mounted() {
    this.totalRows = this.items.length;
  },
  methods: {
    onRowSelected(items) {
      this.selectedRow = items;
      for (let issuedBook of this.selectedRow) {
        this.selectedIssuedBook = issuedBook;
        this.getSelectedBookData();
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    rerenderModal() {
      this.modalKey += 1;
    },
    getSelectedBookData() {
      this.selectedBookData = this.books.books.find(
        (b) => b.isbn == this.selectedIssuedBook.b_isbn
      );
    },
    editIssuedBook(id, issuedBook) {
      this.$v.$touch();

      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        this.$store
          .dispatch("editIssuedBook", { id, issuedBook })


        this.selectedBookData.no_of_copies++;
        this.editBook(this.selectedBookData.isbn, this.selectedBookData);
      }
    },
    editBook(isbn, book) {
      this.$store
        .dispatch("editBook", { isbn, book })

    },
    logout() {
      this.$store.dispatch("logout")
    },
  },
};
</script>

<style lang="scss" scoped>
td {
  .badge {
    text-transform: capitalize;
  }
}
</style>
