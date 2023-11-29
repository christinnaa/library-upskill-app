<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)"/>


      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Book Copies</h4>
          <div>
            <b-button v-if="selectedRow[0]" class="mr-2 info-btn" v-b-modal.updateCopyModal>
              Update
            </b-button>
            <b-button class="primary-btn" v-b-modal.addCopyModal>
              Add Copy</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy" sort-desc.sync="false" fixed responsive :filter="filter" select-mode="single" ref="selectableTable" selectable @row-selected="onRowSelected" @filtered="onFiltered">
          <template #cell(status)="row">
            <b-badge v-if="row.item.status == 'Overdue'" class="badge danger py-2 px-3">{{ row.item.status }}</b-badge>
            <b-badge v-else-if="row.item.status == 'Active'" class="badge primary py-2 px-3">{{
              row.item.status
            }}</b-badge>
            <b-badge v-else-if="row.item.status == 'Borrowed'" class="badge info py-2 px-3">{{
              row.item.status
            }}</b-badge>
          </template>
        </b-table>

        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center">
        </b-pagination>

        <AppModal modalId="addCopyModal" :key="modalKey" hideFooter>
          <template #modal-header> Add Copy </template>

          <template #modal-body>
            <form class="px-2" @submit.prevent="addCopy">
              <div class="mb-3 pt-0" :class="{'input-group--error': $v.copy.book_id.$error}">
                <label for="title">Book Title</label>
                <b-form-select>
                  <b-form-select-option value="" disabled>-- Select --</b-form-select-option>
                  <b-form-select-option v-for="bookOption in bookOptions" :key="bookOption.value" :value="bookOption.value">
                    {{ bookOption.text }}
                  </b-form-select-option>
                </b-form-select>
                <p class="error-message" v-if="
                  submitStatus === 'error' &&
                  !$v.copy.book_id.required
                ">
                  Book Title is required.
                </p>
              </div>
              <div class="mb-3 pt-0" :class="{
                'input-group--error': $v.copy.status.$error,
              }">
                <label for="status">Status</label>
                <b-form-select>
                  <b-form-select-option value="" disabled>Select</b-form-select-option>
                  <b-form-select-option value="admin">Admin</b-form-select-option>
                  <b-form-select-option value="reader">Reader</b-form-select-option>
                </b-form-select>
                <p class="error-message" v-if="
                  submitStatus === 'error' &&
                  !$v.copy.status.required
                ">
                  Status is required.
                </p>
              </div>
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

      <AppModal modalId="updateCopyModal" hideFooter :key="modalKey">
        <template #modal-header> Update Copy </template>

        <template #modal-body>
          <form class="px-2" @submit.prevent="editCopy(selectedCopy.copy_id, selectedCopy)">
            <div class="mb-3 pt-0" :class="{'input-group--error': $v.copy.status.$error}">
              <label for="status">Status</label>
              <b-form-select v-model.trim="selectedCopy.status">
                <b-form-select-option value="" disabled>Select</b-form-select-option>
                <b-form-select-option value="admin">Admin</b-form-select-option>
                <b-form-select-option value="reader">Reader</b-form-select-option>
              </b-form-select>
              <p class="error-message" v-if="
                submitStatus === 'error' &&
                !$v.copy.status.required">Status is required.</p>
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
    </main>
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
      sortBy: 'copy_id',
      fields: [
        {
          key: "copy_id",
          label: "Copy ID",
          thStyle: { textTransform: "uppercase", width: '20%'},
          sortable: true,
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
      copy: this.newCopyObject(),
      modalKey: 0,
      selectedRow: [],
      selectedCopy: {},
      submitStatus: null,
      selectedStatus: "",
      // status: [
      //   { value: null, text: '-- Select --', disabled: true },
      //   { value: 'a', text: 'Active' },
      //   { value: 'b', text: 'Borrowed' },
      //   { value: 'd', text: 'Overdue' }
      // ]
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
    
    // fetch('http://114.29.238.61:3000/api/copies')
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
      return this.books.books.map((item) => ({ value: item.book_id, text: item.title }));
    }
  },
  methods: {
    onRowSelected(items) {
      this.selectedRow = items;
      for (let copy of this.selectedRow) {
        this.selectedCopy= copy;
        // console.log(copy)
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
    newCopyObject() {
      return {
        title: "",
        status: ""
      };
    },
    logout() {
      this.$store.dispatch("logout")
    },
  },
};
</script>

<style lang="scss" scoped>
.badge {
  width: 100px !important;
  font-size: 12px;
}

.danger {
  background-color: #e76f51;
  color: #fff;
}

.primary {
  background-color: #2a9d8f;
  color: #fff;
}

.info {
  background-color: #e9c46a;
  color: #fff;
}



</style>
