<template>
  <div>
    <AppSidebar>
      <span class="sidebar__item mt-2">
        <router-link class="sidebar__link" :to="{ name: 'dashboard' }" exact>
          <b-icon icon="grid1x2" font-scale="2"></b-icon>
          <div class="sidebar__text">Dashboard</div>
        </router-link>
      </span>
      <span class="sidebar__item">
        <router-link class="sidebar__link" v-if="isReader" :to="{ name: 'browse' }" exact>
          <b-icon icon="search" font-scale="2"></b-icon>
        </router-link>
      </span>
      <span class="sidebar__item">
        <router-link class="sidebar__link" v-if="isAdmin" :to="{ name: 'books' }" exact>
          <b-icon icon="book" font-scale="2"></b-icon>
        </router-link>
      </span>
      <span class="sidebar__item">
        <router-link class="sidebar__link" v-if="isAdmin" :to="{ name: 'borrow-records' }" exact>
          <b-icon icon="bookmark-check" font-scale="2"></b-icon>
          <div class="sidebar__text">Borrow Records</div>
        </router-link>
      </span>
      <span class="sidebar__item">
        <router-link class="sidebar__link" v-if="isAdmin" :to="{ name: 'copies' }" exact>
          <b-icon icon="bookshelf" font-scale="2"></b-icon>
          <div class="sidebar__text">Copies</div>
        </router-link>
      </span>
      <span class="sidebar__item">
        <router-link class="sidebar__link" v-if="isAdmin" :to="{ name: 'publishers' }" exact>
          <b-icon icon="building" font-scale="2"></b-icon>
          <div class="sidebar__text">Publishers</div>
        </router-link>
      </span>
      <span class="sidebar__item">
        <router-link class="sidebar__link" v-if="isAdmin" :to="{ name: 'categories' }" exact>
          <b-icon icon="grid3x3-gap" font-scale="2"></b-icon>
          <div class="sidebar__text">Categories</div>
        </router-link>
      </span>
      <span class="sidebar__item">
        <router-link class="sidebar__link" v-if="isAdmin" :to="{ name: 'users' }" exact>
          <b-icon icon="people" font-scale="2"></b-icon>
          <div class="sidebar__text">Users</div>
        </router-link>
      </span>
    </AppSidebar>
    <router-view />
  </div>
</template>

<script>
import AppSidebar from "@/components/AppSidebar.vue";

export default {
  components: { AppSidebar },
  computed: {
    isAdmin() {
      return localStorage.getItem('role') === 'admin';
    },

    isReader() {
      return localStorage.getItem('role') === 'reader';
    }
  }
};
</script>

<style>
@media only screen and (max-width: 992px) {

  .b-icon.bi {
    height: 26px;
    margin: 0px;
  }

  .sidebar__link {
    display: flex;
    justify-content: center;
  }

}
</style>