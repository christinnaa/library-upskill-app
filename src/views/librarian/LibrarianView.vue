<template>
  <div>
    <AppSidebar>
      <li class="sidebar__item">
        <router-link class="sidebar__link" :to="{ name: 'books' }" exact>
          <b-icon icon="bookshelf" font-scale="2"></b-icon>
          <div class="sidebar__text">Books</div>
        </router-link>
      </li>
      <li class="sidebar__item">
        <router-link class="sidebar__link" :to="{ name: 'issued-books' }" exact>
          <b-icon icon="book" font-scale="2"></b-icon>
          <div class="sidebar__text">Issued Books</div>
        </router-link>
      </li>
      <li class="sidebar__item">
        <router-link class="sidebar__link" :to="{ name: 'publishers' }" exact>
          <b-icon icon="building" font-scale="2"></b-icon>
          <div class="sidebar__text">Publishers</div>
        </router-link>
      </li>
      <li class="sidebar__item">
        <router-link class="sidebar__link" :to="{ name: 'categories' }" exact>
          <b-icon icon="grid3x3-gap" font-scale="2"></b-icon>
          <div class="sidebar__text">Categories</div>
        </router-link>
      </li>
      <li class="sidebar__item">
        <router-link class="sidebar__link" :to="{ name: 'requests' }" exact>
          <b-icon icon="bell" font-scale="2"></b-icon>
          <div class="sidebar__text">Requests</div>
        </router-link>
      </li>
    </AppSidebar>
    <router-view />
  </div>
</template>

<script>
import AppSidebar from "@/components/AppSidebar.vue";

export default {
  components: { AppSidebar },
};
</script>

<style>

</style>
