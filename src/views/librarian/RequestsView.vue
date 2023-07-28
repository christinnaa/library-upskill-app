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
          <h4>Requests</h4>
          <div>
            <b-button v-if="selectedRow[0] && selectedBookData.no_of_copies > 0" v-b-modal.addReaderModal
              class="mr-2 success-btn">
              <b-icon icon="check2-circle" scale=".85"></b-icon>
              Approve</b-button>
            <b-button @click="removeRequest(selectedRequest.request_id)" v-if="selectedRow[0]" class="mr-2 warning-btn"
              v-b-modal.rejectRequestModal>
              <b-icon icon="x-octagon" scale=".85"></b-icon>
              Reject</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" label-sort-asc=""
          label-sort-desc="" label-sort-clear="" fixed responsive :filter="filter" select-mode="single"
          ref="selectableTable" selectable @row-selected="onRowSelected" @filtered="onFiltered">
          <template #cell(request_id)="row">
            <template v-if="row.item.request_id.length == 1">
              <span>00</span></template>
            <template v-else-if="row.item.request_id.length > 1">
              <span>0</span>
            </template>
            <template v-else></template>
            <span>{{ row.item.request_id }}</span>
          </template>
        </b-table>

        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>
      </div>
    </main>

    <AppModal modalId="addReaderModal" hideFooter :key="modalKey">
      <template #modal-header> Approve Request </template>

      <template #modal-body>
        <form class="px-2" @submit.prevent="addIssuedBook">
          <div class="mb-4 pt-0">
            <b>Book:</b>
            <br />
            <i>{{ selectedRequest.title }}</i>
          </div>
          <div class="pt-0" :class="{
            'input-group--error': $v.issuedBook.reader_name.$error,
          }">
            <b-input v-model="issuedBook.reader_name" id="request_name" placeholder="Reader's Full Name"></b-input>
            <p class="error-message" v-if="
              submitStatus === 'error' && !$v.issuedBook.reader_name.required
            ">
              Reader's name is required.
            </p>
          </div>

          <div class="w-100 mt-4 d-flex justify-content-end">
            <b-button class="mr-2 secondary-btn" @click="rerenderModal()">
              Cancel
            </b-button>
            <b-button type="submit" class="primary-btn"> Approve </b-button>
          </div>
        </form>
      </template>
    </AppModal>
  </div>
</template>

<script>
import AppDropdown from "@/components/AppDropdown.vue";
import AppModal from "@/components/AppModal.vue";
import { required } from "vuelidate/lib/validators";
import { mapGetters, mapState } from "vuex";

export default {
  props: [],
  components: {
    AppDropdown,
    AppModal,
  },
  validations: {
    issuedBook: {
      reader_name: {
        required,
      },
    },
  },
  data() {
    return {
      fields: [
        {
          key: "request_id",
          thStyle: { textTransform: "uppercase", width: "170px" },
          sortable: true,
        },
        {
          key: "title",
          label: "book",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
        {
          key: "date_requested",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
        // { key: 'actions', thStyle: { textTransform: "uppercase" } },
      ],
      perPage: 12,
      currentPage: 1,
      totalRows: 1,
      filter: null,
      modalKey: 0,
      selectedRow: [],
      selectedRequest: {},
      issuedBook: {
        return_date: this.sevenDaysFromNow(),
        date_returned: "",
        date_issued: this.dateToday(),
        ib_status: "active",
        b_isbn: "",
        title: "",
        reader_name: "",
      },
      selectedBookData: {},
      submitStatus: null,
    };
  },
  created() {
    this.$store.dispatch("fetchBooks");
    this.$store.dispatch("fetchRequests");
  },
  computed: {
    ...mapState(["books"]),
    ...mapGetters(["activeRequests"]),
    items() {
      return this.activeRequests;
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
      for (let request of this.selectedRow) {
        this.selectedRequest = request;
        this.issuedBook.b_isbn = this.selectedRequest.b_isbn;
        this.issuedBook.title = this.selectedRequest.title;
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
        (b) => b.isbn == this.issuedBook.b_isbn
      );
    },
    addIssuedBook() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        this.$store
          .dispatch("addIssuedBook", this.issuedBook)

        this.selectedBookData.no_of_copies--;
        this.editBook(this.selectedBookData.isbn, this.selectedBookData);
        this.removeRequest(this.selectedRequest.request_id);
      }
    },
    editBook(isbn, book) {
      this.$store
        .dispatch("editBook", { isbn, book })

    },
    removeRequest(id) {
      this.$store
        .dispatch("removeRequest", id)

    },
    sevenDaysFromNow() {
      return new Date(
        new Date().setDate(new Date().getDate() + 7)
      ).toLocaleDateString();
    },
    dateToday() {
      return new Date(
        new Date().setDate(new Date().getDate())
      ).toLocaleDateString();
    },
    logout() {
      this.$store.dispatch("logout")
    },
  },
};
</script>

<style>

</style>
