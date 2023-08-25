<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <label for="category">Subcategories</label>
            <b-button size="sm" class="ml-2 d-flex align-items-center btn primary-btn" pill @click="rerenderModal">
                <small>Add Subcategory</small>
            </b-button>
        </div>
        <b-table thead-class="d-none" :items="items" :fields="fields" fixed responsive select-mode="single"
          ref="selectableTable" selectable @row-selected="onRowSelected" @filtered="onFiltered">
          <template #cell(subcategories)="row">
            <!-- <b-badge pill variant="primary" class="mr-2"> -->
                {{ row.item.subcat_name }}
            <!-- </b-badge> -->
          </template>
        </b-table>

    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    props: ["category_id"],
    data() {
        return {
            fields: [
                {
                    key: "subcategories",
                    label: "",
                    thStyle: { textTransform: "uppercase" },
                },
            ],
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
      return this.categories.categories.find(
        (category) => category.category_id == this.category_id
      ).sub_cat;
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
    newCategoryObject() {
      return {
        cat_name: ""
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
}

</script>