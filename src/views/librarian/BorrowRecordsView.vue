<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)" />

      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Borrow Records</h4>
          <div>
            <div class="d-flex" v-if="selectedRow[0]">
              <b-button class="mr-2 warning-btn" v-b-modal.removeBorrowRecord>
                <b-icon icon="trash" scale=".85"></b-icon>
              </b-button>
              <b-button class="mr-2 secondary-btn" v-b-modal.updateBorrowRecord>
                <b-icon icon="pencil-square" scale=".85"></b-icon>
              </b-button>
            </div>

            <b-button v-else class="primary-btn" v-b-modal.addBorrowRecord>Add Borrow Record</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc" fixed responsive :filter="filter" select-mode="single" ref="selectableTable"
          selectable @row-selected="onRowSelected" @filtered="onFiltered">
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

        <AppModal :key="modalKey" modalId="addBorrowRecord" modalSize="md" hideFooter>
          <template #modal-header> Add Borrow Record </template>
          <template #modal-body>
            <form class="px-3" @submit.prevent="addBorrowRecord">
              <b-row class="mb-3">
                <div class="col-12" :class="{ 'input-group--error': $v.borrowRecord.user_id.$error }">
                  <label for="user">Username</label>
                  <b-form-select id="user" v-model.trim="borrowRecord.user_id">
                    <b-form-select-option value="" disabled>Select ...</b-form-select-option>
                    <b-form-select-option v-for="userOption in userOptions" :key="userOption.value"
                      :value="userOption.value">{{ userOption.text }}</b-form-select-option>
                  </b-form-select>
                  <p class="error-message" v-if="submitStatus === 'error' && !$v.borrowRecord.user_id.required">
                    Username is required.
                  </p>
                </div>
              </b-row>
              <b-row class="mb-3">
                <div class="col-12" :class="{ 'input-group--error': $v.borrowRecord.copy_id.$error }">
                  <label for="copy">Book Copy</label>
                  <b-form-select id="copy" v-model.trim="borrowRecord.copy_id">
                    <b-form-select-option value="" disabled>Select ...</b-form-select-option>
                    <b-form-select-option v-for="copyOption in copyOptions" :key="copyOption.value"
                      :value="copyOption.value">{{ copyOption.text }}</b-form-select-option>
                  </b-form-select>
                  <p class="error-message" v-if="submitStatus === 'error' && !$v.borrowRecord.copy_id.required">
                    Book Copy is required.
                  </p>
                </div>
              </b-row>
              <b-row>
                <div class="col-6">
                  <label for="date_of_birth">Borrow Date</label>
                  <b-form-input type="date" id="date_of_birth" v-model="borrowRecord.borrowed_date"></b-form-input>
                </div>
                <div class="col-6">
                  <label for="date_of_birth">Date to be Returned</label>
                  <b-form-input type="date" id="date_of_birth" v-model="borrowRecord.return_by" readonly></b-form-input>
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
      <AppModal modalId="updateBorrowRecord" hideFooter modalSize="md" :key="modalKey">
        <template #modal-header> Update User </template>
        <template #modal-body>
          <form class="px-3" @submit.prevent="editBorrowRecord(selectedBorrowRecord.borrow_id, selectedBorrowRecord)">
            <b-row class="mb-3">
              <div class="col-12">
                <label for="returnedDate">Borrow Date</label>
                <b-form-input type="date" id="returnedDate" v-model="selectedBorrowRecord.returned_date"></b-form-input>
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
    </main>

    <AppModal modalId="removeBorrowRecord" hideFooter :key="modalKey">
      <template #modal-header> Delete Book Copy </template>
      <template #modal-body>
        <div class="pb-2 pt-1">
          Are you sure you want to delete this?
        </div>

        <div class="w-100 mt-4 d-flex justify-content-end">
          <b-button class="mr-2 secondary-btn text-muted" @click="rerenderModal()">
            Cancel
          </b-button>
          <b-button class="warning-btn text-warning" @click="deleteBorrowRecord(selectedBorrowRecord.borrow_id)">
            Yes
          </b-button>
        </div>
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
      sortBy: 'borrowed_date',
      sortDesc: true,
      fields: [
        {
          key: "copy_id",
          thStyle: { textTransform: "uppercase", width: "130px" },
          sortable: true,
        },
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
      submitStatus: null,
      borrowRecord: {
        copy_id: "",
        user_id: "",
        borrowed_date: "",
        return_by: "",
      }
    };
  },
  validations: {
    borrowRecord: {
      user_id: {
        required,
      },
      copy_id: {
        required
      },
      borrowed_date: {
        required
      },
    }
  },
  created() {
    this.$store.dispatch("fetchBorrowRecords");
    this.$store.dispatch("fetchUsers");
    this.$store.dispatch("fetchCopies");
    this.$store.dispatch("fetchBooks");
  },
  mounted() {
    this.showToast();
  },
  computed: {
    ...mapState(["borrowRecords", "users", "copies", "books"]),
    items() {
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
    userOptions() {
      return this.users.users
        .filter(user => user.role === 'reader')
        .map((user) => (
          console.log(user.user_id, user.username),
          { value: user.user_id, text: user.username }));
    },
    bookOptions() {
      return this.books.books.map((book) => (
        { value: book.book_id, text: book.title }));
    },
    copyOptions() {
      return this.copies.copies
        .filter(copy => copy.status === 'Active')
        .map((copy) => ({ value: copy.copy_id, text: copy.title }));
    },
    returnDate() {
      if (this.borrowRecord.borrowed_date) {
        const borrowedDate = new Date(this.borrowRecord.borrowed_date);
        const returnDate = new Date(borrowedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        console.log(returnDate)
        return returnDate.toISOString().split('T')[0]; // Format to 'yyyy-mm-dd'
      }
      return null;
    },
  },
  watch: {
    returnDate(newValue) {
      this.borrowRecord.return_by = newValue;
      console.log(this.borrowRecord.return_by);
    }
  },
  methods: {
    onRowSelected(items) {
      this.selectedRow = items;
      for (let borrowRecord of this.selectedRow) {
        this.selectedBorrowRecord = borrowRecord;
      }
      console.log(this.selectedBorrowRecord);
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    rerenderModal() {
      this.modalKey += 1;
      this.clear();
    },
    getSearchData(data) {
      this.filter = data;
    },
    addBorrowRecord() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        this.performAction("addBorrowRecord", this.borrowRecord, 'success')
        // console.log(this.borrowRecord);
      }
    },
    editBorrowRecord(id, borrowRecord) {
      this.$store.dispatch("editBorrowRecord", { id, borrowRecord })
    },
    deleteBorrowRecord(id) {
      // this.$store.dispatch("removeCopy", id);
      this.$store.dispatch('removeBorrowRecord', id);
    },
    logout() {
      this.$store.dispatch("logout")
    },
    clear() {
      this.borrowRecord = {
        copy_id: "",
        user_id: "",
        borrowed_date: "",
        return_by: "",
        returned_date: "",
        status: "",
      };
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
        if (toastAction === 'addBorrowRecord') {
          message = `Borrow Record Added Successfully!`;
        } else if (toastAction === 'editBorrowRecord') {
          message = `Borrow Record Updated Successfully!`;
        } else if (toastAction === 'removeBorrowRecord') {
          message = `Borrow Record Deleted Successfully!`;
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

.active {
  background-color: #2a9d8f;
  color: #fff;
  width: 80px !important;
}

.inactive {
  background-color: #bcb8b1;
  width: 80px !important;
}
</style>
