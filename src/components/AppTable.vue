<template>
  <div>
    <div
      class="nav__header container-fluid w-100 px-4 mb-4 d-flex align-items-center justify-content-between rounded bg-white">
      <div class="search__container w-100">
        <b-icon icon="search" class="mr-3"></b-icon>
        <input type="text" placeholder="Search" class="w-75 border-0" id="filter-input" v-model="filter" />
      </div>

      <AppDropdown>
        <template v-slot:text>
          Admin
          <b-icon class="ml-2" font-scale=".75" icon="caret-down-fill"></b-icon>
        </template>
        <template v-slot:links>
          <router-link class="dropdown-item" to="/">Logout </router-link>
        </template>
      </AppDropdown>
    </div>

    <div class="table__container p-4 pt-3 rounded">
      <slot name="header"></slot>
      <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" label-sort-asc=""
        label-sort-desc="" label-sort-clear="" fixed responsive :filter="filter" @filtered="onFiltered">
        <!-- <template #cell(author)="row">
          {{ row.item.author && row.item.author.join(", ") }}
        </template> -->
        <template #cell(reader)="row">
          {{ row.item.u_first_name }} {{ row.item.u_last_name }}
        </template>

        <template #cell(categories)="row">
          <b-badge class="bg-light text-dark mr-1" v-for="(category, index) in row.item.categories" :key="index" pill>
            {{ category }}</b-badge>
        </template>


        <template #cell(actions)>
          <AppDropdown>
            <template v-slot:text>
              <b-icon icon="three-dots-vertical"></b-icon>
            </template>
            <template v-slot:links>
              <slot name="dropdown-list"></slot>
            </template>
          </AppDropdown>
        </template>

        <template #cell(status)="row">
          <b-badge pill v-if="row.item.status == 'Active'" class="bg-info">
            {{ row.item.status }}</b-badge>
          <b-badge pill v-else-if="row.item.status == 'Returned'" class="bg-success">
            {{ row.item.status }}</b-badge>
          <b-badge pill v-else-if="row.item.status == 'Overdue'" class="bg-danger">
            {{ row.item.status }}</b-badge>
        </template>
      </b-table>

      <b-pagination variant="light" v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
        aria-controls="my-table" class="mt-3 mb-0 justify-content-center"></b-pagination>
    </div>
  </div>
</template>

<script>
import AppDropdown from "./AppDropdown.vue";

export default {
  name: "AppTable",
  props: ["fields", "items"],
  data() {
    return {
      perPage: 14,
      currentPage: 1,
      totalRows: 1,
      filter: null,
    };
  },
  components: {
    AppDropdown,
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.table__container {
  background: white;
}

.nav__header {
  height: 70px;
}

input {
  outline: none;
}

a {
  &:active {
    background-color: none;
  }
}
</style>
