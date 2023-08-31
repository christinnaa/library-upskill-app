<template>
    <div>
        <AppSidebar>
            <li class="sidebar__item">
                <router-link class="sidebar__link" to="/reader/search" exact>
                    <b-icon icon="search" font-scale="2"></b-icon>
                    <div class="sidebar__text">Search</div>
                </router-link>
            </li>
        </AppSidebar>
        <router-view />
    </div>
</template>

<script>
import AppSidebar from '@/components/AppSidebar.vue';

export default {
    components: { AppSidebar }
}
</script>

<style>

</style>