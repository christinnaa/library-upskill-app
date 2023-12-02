<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)" />

      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Categories</h4>
          <div>
            <div class="d-flex" v-if="selectedRow[0]">
              <b-button class="mr-2 warning-btn" v-b-modal.removeCategoryModal>
                <b-icon icon="trash" scale=".85"></b-icon>
              </b-button>
              <b-button class="mr-2 secondary-btn" v-b-modal.updateCategoryModal>
                <b-icon icon="pencil-square" scale=".85"></b-icon>
              </b-button>
            </div>

            <b-button v-else class="primary-btn" v-b-modal.addCategoryModal>Add Category</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy"
          sort-desc.sync="false" fixed responsive :filter="filter" select-mode="single" ref="selectableTable" selectable
          @row-selected="onRowSelected" @filtered="onFiltered">
        </b-table>

        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>

        <AppModal modalId="addCategoryModal" :key="modalKey" hideFooter>
          <template #modal-header> Add Category </template>
          <template #modal-body>
            <form class="px-2" @submit.prevent="addCategory">
              <div class="mb-3 pt-0" :class="{
                'input-group--error': $v.category.category_name.$error,
              }">
                <label for="category">Category Name</label>
                <b-form-input id="category" v-model="category.category_name"></b-form-input>
                <p class="error-message" v-if="submitStatus === 'error' &&
                  !$v.category.category_name.required
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
                <b-form-input id="category" v-model="selectedCategory.category_name"></b-form-input>
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
    <!-- <main class="alert-container">
      <div class="test_div">
        <b-alert dismissible class="alert" v-model="alert.showAlert" @dismissed="alert.showAlert = null" :variant="alert.variant">
          <div class="alertborder">
            <b-icon class="mr-2" :icon="alert.variant == 'success' || alert.variant =='info' ? 'check-lg' : 'exclamation-triangle-fill'" fill="black"></b-icon>
              {{ alert.message }}
            </div>
          </b-alert>
      </div>
    </main> -->

    <AppModal modalId="removeCategoryModal" hideFooter :key="modalKey">
      <template #modal-header> Delete Category </template>
      <template #modal-body>
        <div class="pb-2 pt-1">
          Are you sure you want to delete
          <b>{{ selectedCategory.category_name }}</b>?
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
      category_name: {
        required,
      },
    },
  },
  data() {
    return {
      sortBy: 'category_id',
      fields: [
        {
          key: "category_name",
          label: "category",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
      ],
      perPage: 8,
      currentPage: 1,
      totalRows: 1,
      filter: null,
      category: {
        category_name: ""
      },
      modalKey: 0,
      selectedRow: [],
      selectedCategory: {},
      submitStatus: null,
      alert: {
        dismissSecs: 0,
        showAlert: 0,
        variant: "",
        message: ""
      },
    };
  },
  created() {
    this.$store.dispatch("fetchCategories");
  },
  mounted() {
    this.showToast();
  },
  computed: {
    ...mapState(["categories"]),
    items() {
      return this.categories.categories;
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
    getSearchData(data) {
      this.filter = data;
    },
    rerenderModal() {
      this.modalKey += 1;
      this.clear();
    },
    addCategory() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        this.performAction('addCategory', this.category, 'success');
      }
    },
    editCategory(id, category) {
      delete category.status;
      this.performAction('editCategory', { id, category }, 'info');
    },
    deleteCategory(id) {
      this.performAction('removeCategory', id, 'warning');
    },
    logout() {
      this.$store.dispatch("logout")
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    clear() {
      this.category = {
        category_name: ""
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
        if (toastAction === 'addCategory') {
          message = `Category Added Successfully!`;
        } else if (toastAction === 'editCategory') {
          message = `Category Updated Successfully!`;
        } else if (toastAction === 'removeCategory') {
          message = `Category Deleted Successfully!`;
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
.test_div {
  width: 25% !important;
}

.alert_class {
  width: 200px !important;
}

.alert-container {
  display: flex;
  justify-content: flex-end;
}
</style>
