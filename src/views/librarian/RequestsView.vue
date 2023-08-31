<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)"/>

      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Requests</h4>
          <div>
            <b-button v-if="selectedRow[0] && selectedBookData.copies > 0" v-b-modal.addReaderModal
              class="mr-2 success-btn">
              <b-icon icon="check2-circle" scale=".85"></b-icon>
              Approve</b-button>
            <b-button @click="removeRequest(selectedRequest.request_id)" v-if="selectedRow[0]" class="mr-2 warning-btn"
              v-b-modal.rejectRequestModal>
              <b-icon icon="x-octagon" scale=".85"></b-icon>
              Reject</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy" sort-desc.sync="false" fixed responsive :filter="filter" select-mode="single"
          ref="selectableTable" selectable @row-selected="onRowSelected" @filtered="onFiltered">
          <template #cell(request_id)="row">
            <template v-if="row.item.request_id.toString().length == 1">
              <span>00</span>
            </template>
            <template v-else-if="row.item.request_id.toString().length == 2">
              <span>0</span>
            </template>
            <template v-else></template>
            <span>{{ row.item.request_id }}</span>
          </template>

          <template #cell(name)="row">
            {{ row.item.first_name }} {{ row.item.last_name }} 
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
          <div class="d-flex flex-column mb-4 pt-0">
            <b>Book:</b>
            <i>{{ selectedRequest.title }}</i>

            <b class="mt-3">Borrower:</b>
            <i>{{ selectedRequest.first_name}} {{ selectedRequest.last_name }}</i>
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
import AppModal from "@/components/AppModal.vue";
import { mapGetters, mapState } from "vuex";
import moment from "moment";
import AppSearchbar from "@/components/AppSearchbar.vue";

export default {
  props: [],
  components: {
    AppModal,
    AppSearchbar
},
  data() {
    return {
      sortBy: 'request_id',
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
          formatter: (value) => {
            return moment(value).format("MMM DD, YYYY");
          },
        },
        {
          key: "name",
          label: "borrower",
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
        issue_date: this.dateToday(),
        status: "active",
        book_id: "",
        user_id: ""
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
        this.issuedBook.book_id = this.selectedRequest.book_id;
        this.issuedBook.user_id = this.selectedRequest.user_id;
        this.getSelectedBookData();
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to f iltering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    rerenderModal() {
      this.modalKey += 1;
    },
    getSearchData(data){
      this.filter = data;
    },
    getSelectedBookData() {
      this.selectedBookData = this.books.books.find(
        (b) => b.book_id == this.issuedBook.book_id
      );
    },
    addIssuedBook() {
      this.$store
        .dispatch("addIssuedBook", this.issuedBook)

      this.selectedBookData.copies--;
      this.editBook(this.selectedBookData.book_id, this.selectedBookData);
      this.removeRequest(this.selectedRequest.request_id);
    },
    editBook(book_id, book) {
      this.$store
        .dispatch("editBook", { book_id, book })

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
