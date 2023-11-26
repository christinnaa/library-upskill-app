<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)"/>

      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Categories</h4>
          <div>
            <b-button class="mr-2 warning-btn" v-if="selectedRow[0] && selectedCategory.status == 'active'"
              v-b-modal.removeCategoryModal>
              <b-icon icon="slash-circle" scale=".85"></b-icon>
              Mark as Inactive</b-button>

            <b-button class="mr-2 success-btn" @click="
              editCategory(selectedCategory.category_id, selectedCategory)
            " v-if="selectedRow[0] && selectedCategory.status == 'inactive'">
              <b-icon icon="check2-circle" scale=".85"></b-icon>
              Mark as Active</b-button>
            <b-button class="mr-2 info-btn" v-if="selectedRow[0]" v-b-modal.updateCategoryModal>
              Update</b-button>

            <b-button v-b-modal.addCategoryModal class="primary-btn">Add Category</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy" sort-desc.sync="false" fixed responsive :filter="filter" select-mode="single"
          ref="selectableTable" selectable @row-selected="onRowSelected" @filtered="onFiltered">
          <template #cell(subcategories)="row">
            <span v-for="subcategory of row.item.sub_cat" :key="subcategory.id">
              <b-badge variant="primary" class="mr-1" v-if="subcategory.status == 'active'">{{ subcategory.subcat_name }}</b-badge>
            </span>
          </template>
        </b-table>

        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>

        <AppModal modalId="addCategoryModal" :key="modalKey" hideFooter>
          <template #modal-header> Add Category </template>
          <template #modal-body>
            <form class="px-2" @submit.prevent="addCategory">
              <div class="mb-3 pt-0" :class="{
                'input-group--error': $v.category.cat_name.$error,
              }">
                <label for="category">Category Name</label>
                <b-form-input id="category" v-model="category.cat_name"></b-form-input>
                <p class="error-message" v-if="
                  submitStatus === 'error' &&
                  !$v.category.cat_name.required
                ">
                  Category name is required.
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

      <AppModal modalId="updateCategoryModal" modalSize="md" hideFooter :key="modalKey">
        <template #modal-header> Update Category </template>
        <template #modal-body>
          <form class="px-2" @submit.prevent="
            editCategory(selectedCategory.category_id, selectedCategory)
          ">
            <b-row class="mb-4">
              <div class="col-12 pt-0">
              <label for="category">Category</label>
              <b-form-input id="category" v-model="selectedCategory.cat_name"></b-form-input>
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

    <AppModal modalId="removeCategoryModal" hideFooter :key="modalKey">
      <template #modal-header> Mark Selected Category as Inactive </template>
      <template #modal-body>
        <div class="pb-2 pt-1">
          Are you sure you want to mark
          <b>{{ selectedCategory.cat_name }}</b> as inactive?
        </div>

        <div class="w-100 mt-4 d-flex justify-content-end">
          <b-button class="mr-2 secondary-btn text-muted" @click="rerenderModal()">
            Cancel
          </b-button>
          <b-button class="warning-btn text-warning" @click="deleteCategory(selectedCategory.category_id)">
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
import { mapState } from "vuex";
import AppSearchbar from "@/components/AppSearchbar.vue";

export default {
  props: [],
  components: {
    AppModal,
    AppSearchbar,
},
  validations: {
    category: {
      cat_name: {
        required,
      },
    },
  },
  data() {
    return {
      sortBy: 'cat_name',
      fields: [
        {
          key: "category_name",
          label: "category",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
      ],
      perPage: 5,
      currentPage: 1,
      totalRows: 1,
      filter: null,
      category: this.newCategoryObject(),
      modalKey: 0,
      selectedRow: [],
      selectedCategory: {},
      submitStatus: null,
    };
  },
  created() {
    this.$store.dispatch("fetchCategories");
  },
  computed: {
    ...mapState(["categories"]),
    items() {
      return this.categories.categories;
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
      for (let category of this.selectedRow) {
        this.selectedCategory = category;
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
    newCategoryObject() {
      return {
        cat_name: "",
      };
    },
    rerenderModal() {
      this.modalKey += 1;
    },
    addCategory() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        this.$store
          .dispatch("addCategory", this.category)
      }
    },
    editCategory(id, category) {
      delete category.status;
      this.$store
        .dispatch("editCategory", { id, category })
    },
    deleteCategory(id) {
      this.$store
        .dispatch("removeCategory", id)
    },
    logout() {
      this.$store.dispatch("logout")
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
