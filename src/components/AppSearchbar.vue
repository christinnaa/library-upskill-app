<template>
  <div
    class="nav__header container-fluid w-100 px-4 mb-4 d-flex align-items-center justify-content-between rounded bg-white">
    <div class="search__container w-100">
      <b-icon icon="search" class="mr-3"></b-icon>
      <input type="text" placeholder="Search" class="w-75 border-0" id="filter-input" v-model.trim="filter" @keydown="searchData" />
    </div>

    <AppDropdown>
        <template v-slot:text>
          <b-icon class="mr-2" font-scale="1.5" icon="person-circle"></b-icon>
          Bada Lee
          <b-icon class="ml-3" font-scale=".75" icon="caret-down-fill"></b-icon>
        </template>
        <template v-slot:links>
          <p class="dropdown-header text-capitalize">Admin</p>
          <a class="dropdown-item" @click="logout">Logout</a>
        </template>
      </AppDropdown>
  </div>
</template>

<script>
import AppDropdown from "./AppDropdown.vue";

export default {
  name: "AppSearchbar",
  components: {
    AppDropdown,
  },
  data() {
    return {
      filter: "",
      userName: "",
    }
  },
  created() {
    this.userName = `${localStorage.getItem("first_name")} ${localStorage.getItem("last_name")}`
  },
  computed: {
    role() {
      return localStorage.getItem("role");
    }
  },
  methods: {
    searchData() {
      this.$emit("passData", this.filter)
    },
    logout() {
      this.$store.dispatch("logout")
    },
  },
}
</script>

<style lang="scss">
.nav__header {
  height: 70px;
}

input {
  outline: none;
}

.dropdown-toggle {
  &::after {
    display: none;
  }

  border: 0;
}

.list-group-item {
  span {
    text-transform: capitalize;
  }
}

.bi-x-lg {
  cursor: pointer;
  transition: 300ms;

  &:hover {
    color: lighten(black, 40%);
  }
}
</style>