<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)"/>

      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Borrow Records</h4>
          <div>
            <b-button v-if="selectedRow[0]" v-b-modal.updateIssuedBookModal
              class="mr-2 info-btn">Update</b-button>
            <b-button v-b-modal.addBorrowRecord class="primary-btn">Add Record</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy" sort-desc.sync="false" fixed responsive :filter="filter" select-mode="single" ref="selectableTable" selectable @row-selected="onRowSelected" @filtered="onFiltered">
          <template #cell(status)="row">
            <b-badge v-if="row.item.status == 'Active'" class="active py-2">{{ row.item.status }}</b-badge>
            <b-badge v-else-if="row.item.status == 'Inactive'" class="inactive py-2">{{
              row.item.status
            }}</b-badge>
            <b-badge v-else-if="row.item.status == 'Overdue'" class="overdue py-2">{{
              row.item.status
            }}</b-badge>
          </template>
        </b-table>

        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>
      </div>
    </main>

    <!-- <AppModal modalId="updateIssuedBookModal" hideFooter :key="modalKey">
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
    </AppModal> -->

    <AppModal :key="modalKey" modalId="addBorrowRecord" modalSize="lg" submitMethod="addBorrowRecord" hideFooter>
      <template #modal-header> Add Borrow Record </template>
      <template #modal-body>
        <form>
          <b-row class="mb-3 px-2">
            <div class="col-6">
              <label for="username">Username</label>
                <b-form-select>
                  <b-form-select-option value="" disabled>Select</b-form-select-option>
                  <b-form-select-option v-for="userOption in userOptions" :key="userOption.value"
                      :value="userOption.value">{{ userOption.value }}</b-form-select-option>
                </b-form-select>
                <p class="error-message" v-if="submitStatus === 'error' && !$v.user.username.required">
                  User is required.
                </p>
            </div>
            <!-- <div class="col-6">
                <label for="publisher">Title</label>
                <b-form-select>
                  <b-form-select-option value="" disabled>Select</b-form-select-option>
                  <b-form-select-option v-for="publisher in activePublishers" :key="publisher.publisher_id"
                      :value="publisher.publisher_id">{{ publisher.p_name }}</b-form-select-option>
                  </b-form-select>
            </div> -->
          </b-row>
          <b-row class="mb-3 px-2">
            <!-- <div class="col-4">
              <label for="publisher">Available Copy</label>
                <b-form-select>
                <b-form-select-option value="" disabled>Select</b-form-select-option>
                <b-form-select-option v-for="publisher in activePublishers" :key="publisher.publisher_id"
                  :value="publisher.publisher_id">{{ publisher.publisher_name }}</b-form-select-option>
                </b-form-select>
            </div> -->
            <div class="col-4">
              <label for="date_of_birth">Borrow Date</label>
              <b-form-input type="date" id="date_of_birth"></b-form-input>
            </div>
            <div class="col-4">
              <label for="date_of_birth">Date Returned</label>
              <b-form-input type="date" id="date_of_birth" readonly></b-form-input>
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
      sortBy: 'title',
      fields: [
        {
          key: "title",
          thStyle: { textTransform: "uppercase", width: "350px" },
          sortable: true,
        },
        {
          key: "reader_name",
          thStyle: { textTransform: "uppercase", width: "190px" },
          sortable: true,
        },
        {
          key: "borrowed_date",
          label: "Date Borrowed",
          thStyle: { textTransform: "uppercase", width: "160px" },
          sortable: true,
          formatter: (value) => {
            return moment(value).format("YYYY-MM-DD");
          },
        },
        {
          key: "return_by",
          label: "Return By",
          thStyle: { textTransform: "uppercase", width: "160px" },
          sortable: true,
          formatter: (value) => {
            return moment(value).format("YYYY-MM-DD");
          },
        },
        {
          key: "returned_date",
          thStyle: { textTransform: "uppercase", width: "180px" },
          sortable: true,
          formatter: (value) => {
            if (value) return moment(value).format("YYYY-MM-DD");
          },
        },
        {
          key: "status",
          label: "status",
          thStyle: { textTransform: "uppercase", width: "110px" },
          sortable: true,
        },
      ],
      perPage: 8,
      currentPage: 1,
      totalRows: 1,
      filter: null,
      modalKey: 0,
      selectedRow: [],
      selectedBorrowRecord: {},
      selectedBookData: {},

      selectedIssuedBook: {},
      submitStatus: null,
    };
  },
  validations: {
    user: {
      username: {
        required,
      },
    }
  },
  created() {
    this.$store.dispatch("fetchBorrowRecords");
    this.$store.dispatch("fetchUsers");
    // this.userOptions();
    // this.$store.dispatch("fetchBooks");

    // fetch('http://172.16.4.182:3100/api/borrow-records')
    //   .then(response => response.json())
    //   .then(data => {
    //     // Log the data to the console
    //     console.log(data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching data from API:', error);
    // });
  },
  computed: {
    ...mapState(["borrowRecords", "users"]),
    items() {
      // console.log(this.borrowRecords)
      // return this.borrowRecords.borrowRecords.map((item) => ({ ...item }));
      return this.borrowRecords.borrowRecords;
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
    userOption() {
      return this.users.users.map((item) => ({ value: item.user_id, text: item.username }));
    },
  },
  methods: {
    onRowSelected(items) {
      this.selectedRow = items;
      for (let borrowRecord of this.selectedRow) {
        this.selectedBorrowRecord = borrowRecord;
        // this.getSelectedRecordData();
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
    // getSelectedRecordData() {
    //   this.selectedBookData = this.books.books.find(
    //     (b) => b.book_id == this.selectedIssuedBook.book_id
    //   );
    // },
    // editIssuedBook(id, issuedBook) {
    //   this.$v.$touch();

    //   if (this.$v.$invalid) {
    //     this.submitStatus = "error";
    //   } else {
    //     this.selectedIssuedBook.status = "returned";
        
    //     this.$store
    //       .dispatch("editIssuedBook", { id, issuedBook })

    //     this.selectedBookData.copies++;
    //     this.editBook(this.selectedBookData.book_id, this.selectedBookData);
    //   }
    // },
    // editBook(book_id, book) {
    //   this.$store
    //     .dispatch("editBook", { book_id, book })

    // },
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

.overdue {
  background-color: #e76f51;
  color: #fff;
  width: 80px !important;
}

.available {
  background-color: #2a9d8f;
  color: #fff;
  width: 80px !important;
}

.inactive {
  background-color: #bcb8b1;
  width: 80px !important;
}
</style>
