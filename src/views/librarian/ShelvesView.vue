<template>
    <div class="wrapper">
      <main>
        <AppSearchbar @passData="getSearchData($event)"/>
  
        <div class="table__container p-4 pt-3 rounded">
          <div class="d-flex justify-content-between mt-2 mb-4">
            <h4>Shelves</h4>
            <div>
              <b-button class="mr-2 warning-btn" v-if="selectedRow[0] && selectedShelf.status == 'active'"
                v-b-modal.removeShelfModal>
                <b-icon icon="slash-circle" scale=".85"></b-icon>
                Mark as Inactive</b-button>
  
              <b-button class="mr-2 success-btn" @click="
                editShelf(selectedShelf.shelf_id, selectedShelf)
              " v-if="selectedRow[0] && selectedShelf.status == 'inactive'">
                <b-icon icon="check2-circle" scale=".85"></b-icon>
                Mark as Active</b-button>
              <b-button class="mr-2 info-btn" v-if="selectedRow[0]" v-b-modal.updateShelfModal>
                Update</b-button>
  
              <b-button v-b-modal.addShelfModal class="primary-btn">Add Shelf</b-button>
            </div>
          </div>
  
          <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy" sort-desc.sync="false" fixed responsive :filter="filter" select-mode="single"
            ref="selectableTable" selectable @row-selected="onRowSelected" @filtered="onFiltered">

            <template #cell(categories)="row">
            <div v-if="row.item.status == 'inactive'" class="inactive">
              <span>
                <b-badge variant="primary" class="mr-1" v-for="category of row.item.cat" :key="category.id">{{ category.cat_name }}</b-badge>
              </span>
              <b-badge pill variant="light">{{
                row.item.status
              }}</b-badge>
            </div>
            <template v-else>
              <b-badge variant="primary" class="mr-2" v-for="category of row.item.cat" :key="category.id">{{ category.cat_name }}</b-badge>
            </template>
          </template>
          </b-table>
  
          <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
            class="mt-3 mb-0 justify-content-center"></b-pagination>
  
          <AppModal modalId="addShelfModal" :key="modalKey" hideFooter>
            <template #modal-header> Add Shelf </template>
            <template #modal-body>
              <form class="px-2" @submit.prevent="addShelf">
                <div class="mb-3 pt-0" :class="{
                  'input-group--error': $v.shelf.shelf_name.$error,
                }">
                  <label for="shelf">Shelf Name</label>
                  <b-form-input id="shelf" v-model="shelf.shelf_name"></b-form-input>
                  <p class="error-message" v-if="
                    submitStatus === 'error' &&
                    !$v.shelf.shelf_name.required
                  ">
                    Shelf name is required.
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
  
        <AppModal modalId="updateShelfModal" hideFooter :key="modalKey">
          <template #modal-header> Update Shelf </template>
          <template #modal-body>
            <form class="px-2" @submit.prevent="
              editShelf(selectedShelf.shelf_id, selectedShelf)
            ">
              <b-row class="mb-3 pt-0 px-2">
                <label for="shelf">Shelf Name</label>
                <b-form-input id="shelf" v-model="selectedShelf.shelf_name"></b-form-input>
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
  
      <AppModal modalId="removeShelfModal" hideFooter :key="modalKey">
        <template #modal-header> Mark Selected Shelf as Inactive </template>
        <template #modal-body>
          <div class="pb-2 pt-1">
            Are you sure you want to mark
            <b>{{ selectedShelf.shelf_name }}</b> as inactive?
          </div>
  
          <div class="w-100 mt-4 d-flex justify-content-end">
            <b-button class="mr-2 secondary-btn text-muted" @click="rerenderModal()">
              Cancel
            </b-button>
            <b-button class="warning-btn text-warning" @click="deleteShelf(selectedShelf.shelf_id)">
              Yes
            </b-button>
          </div>
        </template>
      </AppModal>
    </div>
  </template>
  
  <script>
  import AppModal from "@/components/AppModal.vue";
  import { required } from "vuelidate/lib/validators";
  import { mapGetters, mapState } from "vuex";
  import AppSearchbar from "@/components/AppSearchbar.vue";
  
  export default {
    props: [],
    components: {
      AppModal,
      AppSearchbar
  },
    validations: {
      shelf: {
        shelf_name: {
        required,
        },
      },
    },
    data() {
      return {
      sortBy: 'shelf_name',
        fields: [
          {
            key: "shelf_name",
            label: "shelf",
            thStyle: { textTransform: "uppercase" },
            sortable: true,
          },
          {
            key: "categories",
            thStyle: { textTransform: "uppercase" },
            sortable: true,
          },
        ],
        perPage: 12,
        currentPage: 1,
        totalRows: 1,
        filter: null,
        shelf: this.newShelfObject(),
        modalKey: 0,
        selectedRow: [],
        selectedShelf: {},
        submitStatus: null,
      };
    },
    created() {
      this.$store.dispatch("fetchShelves");
      this.$store.dispatch("fetchCategories");
    },
    computed: {
      ...mapState(["shelves"]),
      ...mapGetters(["activeCategories"]),
      items() {
        return this.shelves.shelves;
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
        for (let shelf of this.selectedRow) {
          this.selectedShelf = shelf;
        }
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },
      getSearchData(data){
        this.filter = data;
      },
      newShelfObject() {
        return {
            shelf_name: ""
        };
      },
      rerenderModal() {
        this.modalKey += 1;
      },
      addShelf() {
        this.$v.$touch();
        if (this.$v.$invalid) {
          this.submitStatus = "error";
        } else {
          this.$store
            .dispatch("addShelf", this.shelf)
        }
      },
      editShelf(id, shelf) {
        delete shelf.status;
        this.$store
          .dispatch("editShelf", { id, shelf })
      },
      deleteShelf(id) {
        this.$store
          .dispatch("removeShelf", id)
      },
    },
  };
  </script>
  