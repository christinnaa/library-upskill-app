<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <label for="subcategory">Subcategories</label>

            <div class="d-flex">
              <b-button v-if="selectedRow[0] && selectedSubcategory.status == 'active'" size="sm" class="ml-1 d-flex align-items-center btn warning-btn" @click="deleteSubcategory(selectedSubcategory.sub_category_id); $store.dispatch('fetchCategories')
">
                <small>Delete</small>
              </b-button>
              <b-button v-if="selectedRow[0]" size="sm" class="ml-1 d-flex align-items-center btn info-btn" @click="toggleUpdateModal">
                <small>Update</small>
              </b-button>
              <b-button size="sm" class="ml-1 d-flex align-items-center btn primary-btn" @click="toggleAddModal">
                  <small>Add Subcategory</small>
              </b-button>

            </div>
        </div>
        <b-table thead-class="d-none" :items="items" :fields="fields" fixed responsive select-mode="single"
          ref="selectableTable" selectable @row-selected="onRowSelected">
          <template #cell(subcategories)="row">
            {{ row.item.subcat_name }}
          </template>
        </b-table>

        <SubcategoryModal title="Add Subcategory" :visible="isAddModalVisible" @close="toggleAddModal">
          <form class="px-2" @submit.prevent="addSubcategory">
              <div class="mt-2 mb-3 pt-0" :class="{
                'input-group--error': $v.subcategory.subcat_name.$error,
              }">
                <b-input id="subcat_name" v-model="subcategory.subcat_name"></b-input>
                <p class="error-message" v-if="
                  submitStatus === 'error' &&
                  !$v.subcategory.subcat_name.required
                ">
                  Subcategory name is required.
                </p>
              </div>
              <div class="w-100 mt-4 d-flex justify-content-end">
                <b-button class="mr-2 secondary-btn" @click="toggleAddModal">
                  Cancel
                </b-button>
                <b-button type="submit" class="primary-btn"> Add </b-button>
              </div>
            </form>
        </SubcategoryModal>

        <SubcategoryModal title="Update Subcategory" :visible="isUpdateModalVisible" @close="toggleUpdateModal">
          <form class="px-2" @submit.prevent="
            editSubcategory(selectedSubcategory.sub_category_id, selectedSubcategory)
          ">
              <div class="mt-2 mb-3 pt-0">
              <label for="subcategory">Subcategory</label>
              <b-form-input id="subcategory" v-model="selectedSubcategory.subcat_name"></b-form-input>
            </div>
            <div class="w-100 mt-4 d-flex justify-content-end">
              <b-button class="mr-2 secondary-btn" @click="toggleUpdateModal">
                Cancel
              </b-button>
              <b-button type="submit" class="primary-btn"> Update </b-button>
            </div>
          </form>
        </SubcategoryModal>

    </div>
</template>

<script>


import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import SubcategoryModal from "./SubcategoryModal.vue";


export default {
    components: {
        SubcategoryModal,
    },
    props: ["category_id"],
    validations: {
      subcategory: {
        subcat_name: {
          required,
        },
      },
  },
    data() {
        return {
            fields: [
                {
                    key: "subcategories",
                    label: "",
                },
            ],
            filter: null,
            subcategory: this.newSubcategoryObject(),
            modalKey: 0,
            selectedRow: [],
            selectedSubcategory: {},
            submitStatus: null,
            isAddModalVisible: false,
            isUpdateModalVisible: false,
        };
  },
  created() {
    this.$store.dispatch("fetchCategories");
  },
  computed: {
    ...mapState(["categories"]),
    items() {
      return this.categories.categories.find(
        (subcategory) => subcategory.category_id == this.category_id
      ).sub_cat.filter((subcat) => subcat.status == "active");
    },
  },
  mounted() {
    this.totalRows = this.items.length;
  },
  methods: {
    toggleAddModal() {
      this.isAddModalVisible = !this.isAddModalVisible;
    },
    toggleUpdateModal() {
      this.isUpdateModalVisible = !this.isUpdateModalVisible;
    },
    onRowSelected(items) {
      this.selectedRow = items;
      for (let subcategory of this.selectedRow) {
        this.selectedSubcategory = subcategory;
      }
    },
    newSubcategoryObject() {
      return {
        subcat_name: "",
        category_id: this.category_id,
      };
    },
    rerenderModal() {
      this.modalKey += 1;
    },
    async addSubcategory() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        await this.$store
          .dispatch("addSubcategory", this.subcategory).then(() => {
            this.$store.dispatch("fetchCategories");
            this.toggleAddModal();
          });
        this.$store.dispatch("fetchCategories");
      }
    },
    async editSubcategory(id, subcategory) {
      delete subcategory.status;
      await this.$store
        .dispatch("editSubcategory", { id, subcategory }).then(() => {
            this.$store.dispatch("fetchCategories");
            this.toggleUpdateModal();
          });
        this.$store.dispatch("fetchCategories");

    },
    async deleteSubcategory(id) {
      await this.$store
        .dispatch("removeSubcategory", id).then(() => {
          this.$store.dispatch("fetchCategories");
        });
        this.$store.dispatch("fetchCategories");
    },
  },
}

</script>