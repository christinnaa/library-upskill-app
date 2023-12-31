<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)" />


      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Book Copies</h4>
          <div class="d-flex">
            <div v-if="selectedRow[0]">
              <b-button class="mr-2 warning-btn" v-b-modal.removeCopyModal>
                <b-icon icon="trash" scale=".95" class="mx-1"></b-icon>
              </b-button>
            </div>
            <b-button v-else class="primary-btn" v-b-modal.addCopyModal>Add Copy</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy"
          sort-desc.sync="false" fixed responsive :filter="filter" select-mode="single" ref="selectableTable" selectable
          @row-selected="onRowSelected" @filtered="onFiltered">
          <template #cell(status)="row">
            <b-badge v-if="row.item.status == 'Inactive'" class="badge inactive py-2 px-3">Unavailable</b-badge>
            <b-badge v-else-if="row.item.status == 'Active'" class="badge active py-2 px-3">Available</b-badge>
          </template>
        </b-table>

        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center">
        </b-pagination>

        <AppModal modalId="addCopyModal" :key="modalKey" hideFooter>
          <template #modal-header> Add Copy </template>

          <template #modal-body>
            <form class="px-2" @submit.prevent="addCopy">
              <b-row class="mb-3 px-2">
                <div class="col-12" :class="{ 'input-group--error': $v.copy.book_id.$error }">
                  <label for="title">Book Title</label>
                  <b-form-select id="title" v-model.trim="copy.book_id">
                    <b-form-select-option value="" disabled>Select ...</b-form-select-option>
                    <b-form-select-option v-for="bookOption in bookOptions" :key="bookOption.value"
                      :value="bookOption.value">{{ bookOption.text }}</b-form-select-option>
                  </b-form-select>
                  <p class="error-message" v-if="submitStatus === 'error' &&
                    !$v.copy.book_id.required
                    ">
                    Title is required.
                  </p>
                </div>
              </b-row>
              <b-row class="mb-3 px-2">
                <div class="col-12" :class="{
                  'input-group--error': $v.copy.status.$error,
                }">
                  <label for="status">Status</label>
                  <b-form-select id="status" v-model="copy.status">
                    <b-form-select-option value="" disabled>Select ...</b-form-select-option>
                    <b-form-select-option value="Active">Active</b-form-select-option>
                    <b-form-select-option value="Inactive">Inactive</b-form-select-option>
                  </b-form-select>
                  <p class="error-message" v-if="submitStatus === 'error' &&
                    !$v.copy.status.required
                    ">
                    Status is required.
                  </p>
                </div>
              </b-row>
              <div class="w-100 mt-4 d-flex justify-content-end">
                <b-button class="mr-2 secondary-btn" @click="rerenderModal">
                  Cancel
                </b-button>
                <b-button type="submit" class="primary-btn"> Add </b-button>
              </div>
            </form>
          </template>
        </AppModal>
      </div>

    </main>

    <AppModal modalId="removeCopyModal" hideFooter :key="modalKey">
      <template #modal-header> Delete Book Copy </template>
      <template #modal-body>
        <div class="pb-2 pt-1">
          Are you sure you want to delete this copy of <b>{{ selectedCopy.title }}</b>?
        </div>

        <div class="w-100 mt-4 d-flex justify-content-end">
          <b-button class="mr-2 secondary-btn text-muted" @click="rerenderModal()">
            Cancel
          </b-button>
          <b-button class="warning-btn text-warning" @click="deleteCopy(selectedCopy.copy_id)">
            Yes
          </b-button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script>
// import AppDropdown from "@/components/AppDropdown.vue";
import AppModal from "@/components/AppModal.vue";
import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import AppSearchbar from '@/components/AppSearchbar.vue';

export default {
  name: "CopiesView",
  props: [],
  components: {
    AppSearchbar,
    AppModal,
  },
  data() {
    return {
      sortBy: 'title',
      fields: [
        {
          key: "copy_id",
          label: "Copy ID",
          thStyle: { textTransform: "uppercase", width: '20%' },
          // sortable: true,
        },
        {
          key: "title",
          label: "Book Title",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
        {
          key: "status",
          label: "Status",
          thStyle: { textTransform: "uppercase", width: '30%' },
        },
      ],
      perPage: 8,
      currentPage: 1,
      totalRows: 1,
      filter: null,
      copy: {
        book_id: "",
        status: ""
      },
      modalKey: 0,
      selectedRow: [],
      selectedCopy: {},
      submitStatus: null,
      selectedStatus: "",
    };
  },
  validations: {
    copy: {
      book_id: {
        required,
      },
      status: {
        required,
      }
    },
  },
  created() {
    this.$store.dispatch("fetchCopies");
    this.$store.dispatch("fetchBooks");
  },
  mounted() {
    this.showToast();
  },
  computed: {
    ...mapState(["copies", "books"]),
    items() {
      // console.log(this.copies.copies)
      return this.copies.copies.map((item) => ({ ...item }));
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
    bookOptions() {
      return this.books.books.map((item) => (
        { value: item.book_id, text: item.title }));
    }
  },
  methods: {
    onRowSelected(items) {
      this.selectedRow = items;
      for (let copy of this.selectedRow) {
        this.selectedCopy = copy;
      }
    },
    addCopy() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        this.performAction('addCopy', this.copy, 'success');
      }
    },
    editCopy(id, copy) {
      this.performAction('editCopy', { id, copy }, 'info');
    },
    deleteCopy(id) {
      // this.$store.dispatch("removeCopy", id);
      this.performAction('removeCopy', id, 'warning');
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
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
    logout() {
      this.$store.dispatch("logout")
    },
    clear() {
      this.copy = {
        book_id: "",
        status: ""
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
        if (toastAction === 'addCopy') {
          message = `Copy Added Successfully!`;
        } else if (toastAction === 'editCopy') {
          message = `Copy Updated Successfully!`;
        } else if (toastAction === 'removeCopy') {
          message = `Copy Deleted Successfully!`;
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
.badge {
  width: 100px !important;
  font-size: 12px;
}

.info {
  background-color: #e9c46a;
  color: #fff;
}

.inactive {
  background-color: #bcb8b1;
}

.active {
  background-color: #81B29A;
}
</style>
