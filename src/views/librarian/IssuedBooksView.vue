<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)"/>

      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Issued Books</h4>
          <div>
            <b-button v-if="selectedRow[0] && selectedIssuedBook.status == 'active' || selectedIssuedBook.status == 'overdue'" v-b-modal.updateIssuedBookModal
              class="mr-2 primary-btn">Update</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy" sort-desc.sync="false" fixed responsive :filter="filter" select-mode="single"
          ref="selectableTable" selectable @row-selected="onRowSelected" @filtered="onFiltered">
          <template #cell(borrower_name)="row">
            {{ row.item.first_name }} {{ row.item.last_name }}
          </template>
          <template #cell(status)="row">
            <b-badge v-if="row.item.status == 'overdue'" class="bg-danger">{{ row.item.status }}</b-badge>
            <b-badge v-else-if="row.item.status == 'active'" class="bg-primary">{{
              row.item.status
            }}</b-badge>
            <b-badge v-else-if="row.item.status == 'returned'" class="bg-success">{{
              row.item.status
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
import moment from "moment";
import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import AppSearchbar from '@/components/AppSearchbar.vue';

export default {
  props: [],
  components: {
    AppModal,
    AppSearchbar,
  },
  data() {
    return {
      sortBy: 'status',
      fields: [
        {
          key: "title",
          thStyle: { textTransform: "uppercase", width: "350px" },
          sortable: true,
        },
        {
          key: "borrower_name",
          thStyle: { textTransform: "uppercase", width: "190px" },
          sortable: true,
        },
        {
          key: "issue_date",
          label: "issued on",
          thStyle: { textTransform: "uppercase", width: "160px" },
          sortable: true,
          formatter: (value) => {
            return moment(value).format("MMM DD, YYYY");
          },
        },
        // {
        //   key: "return_date",
        //   label: "return by",
        //   thStyle: { textTransform: "uppercase", width: "160px" },
        //   sortable: true,
        //   formatter: (value) => {
        //     return moment(value).format("MMM DD, YYYY");
        //   },
        // },
        {
          key: "date_returned",
          thStyle: { textTransform: "uppercase", width: "180px" },
          sortable: true,
          formatter: (value) => {
            if (value) return moment(value).format("MMM DD, YYYY");
          },
        },
        {
          key: "status",
          label: "status",
          thStyle: { textTransform: "uppercase", width: "110px" },
          sortable: true,
        },
      ],
      items: [
        {
          title: 'Crazy Rich Asians',
          first_name: 'Bada',
          last_name: 'Lee',
          issue_date: '2023-11-01',
          status: 'active'
        }
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
    // items() {
    //   return this.issuedBooks.issuedBooks;
    // },
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
    getSearchData(data){
      this.filter = data;
    },
    getSelectedBookData() {
      this.selectedBookData = this.books.books.find(
        (b) => b.book_id == this.selectedIssuedBook.book_id
      );
    },
    editIssuedBook(id, issuedBook) {
      this.$v.$touch();

      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        this.selectedIssuedBook.status = "returned";
        
        this.$store
          .dispatch("editIssuedBook", { id, issuedBook })

        this.selectedBookData.copies++;
        this.editBook(this.selectedBookData.book_id, this.selectedBookData);
      }
    },
    editBook(book_id, book) {
      this.$store
        .dispatch("editBook", { book_id, book })

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
