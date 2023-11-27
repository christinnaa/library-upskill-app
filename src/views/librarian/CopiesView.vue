<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)"/>


      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Book Copies</h4>
          <div>

            <b-button class="primary-btn" v-b-modal.addPublisherModal>
              Add Copy</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy" sort-desc.sync="false" fixed responsive :filter="filter" select-mode="single"
          ref="selectableTable" selectable>
          <template #cell(status)="row">
            <b-badge v-if="row.item.status == 'Overdue'" class="badge bg-danger py-2 px-3">{{ row.item.status }}</b-badge>
            <b-badge v-else-if="row.item.status == 'Active'" class="badge bg-primary py-2 px-3">{{
              row.item.status
            }}</b-badge>
            <b-badge v-else-if="row.item.status == 'Borrowed'" class="badge bg-success py-2 px-3">{{
              row.item.status
            }}</b-badge>
          </template>
        </b-table>

        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>

      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AppSearchbar from '@/components/AppSearchbar.vue';

export default {
  name: "CopiesView",
  props: [],
  components: {
    // AppTable,
    AppSearchbar,
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
      selectedPublisher: {},
      submitStatus: null,
    };
  },
  created() {
    this.$store.dispatch("fetchCopies");
    
    fetch('http://114.29.238.61:3000/api/copies')
      .then(response => response.json())
      .then(data => {
        // Log the data to the console
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data from API:', error);
    });
  },
  computed: {
    ...mapState(["copies"]),
    items() {
      return this.copies.copies.map((item) => ({ ...item }));
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
      for (let publisher of this.selectedRow) {
        this.selectedPublisher = publisher;
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
        title: ""
      };
    },
    logout() {
      this.$store.dispatch("logout")
    },
  },
};
</script>

<style lang="scss">
.badge {
  width: 100px !important;
  font-size: 12px;
}

@media only screen and (max-width: 992px) {


}
</style>
