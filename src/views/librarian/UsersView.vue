<template>
    <div class="wrapper">
        <main>
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
                <div class="d-flex justify-content-between mt-2 mb-4">
                    <h4>Users</h4>
                    <div>
                        <b-button v-if="selectedRow[0]" class="mr-2" v-b-modal.updatePublisherModal
                            variant="info">Update</b-button>
                        <b-button class="mr-2 text-white"
                            v-if="selectedRow[0] && selectedPublisher.p_status == 'active'"
                            v-b-modal.removePublisherModal variant="warning">Mark as inactive</b-button>
                        <b-button class="mr-2 text-white"
                            @click="editPublisher(selectedPublisher.publisher_id, selectedPublisher)"
                            v-if="selectedRow[0] && selectedPublisher.p_status == 'inactive'" variant="success">
                            Mark as active</b-button>
                        <b-button v-b-modal.addPublisherModal variant="primary">Add Publisher</b-button>

                    </div>
                </div>

                <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage"
                    label-sort-asc="" label-sort-desc="" label-sort-clear="" fixed responsive :filter="filter"
                    select-mode="single" ref="selectableTable" selectable @row-selected="onRowSelected"
                    @filtered="onFiltered">
                </b-table>

                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
                    class="mt-3 mb-0 justify-content-center"></b-pagination>

                <AppModal modalId="addPublisherModal" :key="modalKey" hideFooter>
                    <template #modal-header>
                        Add Publisher
                    </template>

                    <template #modal-body>
                        <form class="px-2" @submit.prevent="addPublisher">
                            <div class="row  mb-3 pt-0">
                                <label for="publisher_name">Name</label>
                                <b-input id="publisher_name" v-model="publisher.publisher_name"></b-input>
                                {{ publisher.publisher_name }}
                            </div>
                            <div class="row mb-2">
                                <label for="publisher_location">Location</label>
                                <b-form-input id="publisher_location" v-model="publisher.location"></b-form-input>
                            </div>
                            <div class="w-100 mt-4 d-flex justify-content-end">
                                <b-button variant="outline-secondary" class="mr-2" @click="rerenderModal">
                                    Cancel
                                </b-button>
                                <b-button type="submit" variant="primary">
                                    Add
                                </b-button>
                            </div>
                        </form>
                    </template>

                </AppModal>
            </div>


            <AppModal modalId="updatePublisherModal" hideFooter :key="modalKey">
                <template #modal-header>
                    Update Publisher
                </template>

                <template #modal-body>
                    <form class="px-2"
                        @submit.prevent="editPublisher(selectedPublisher.publisher_id, selectedPublisher)">
                        <div class="row  mb-3 pt-0">
                            <label for="publisher_name">Name</label>
                            <b-input id="publisher_name" v-model="selectedPublisher.publisher_name"></b-input>
                        </div>
                        <div class="row mb-2">
                            <label for="publisher_location">Location</label>
                            <b-form-input id="publisher_location" v-model="selectedPublisher.location"></b-form-input>
                        </div>

                        <div class="w-100 mt-4 d-flex justify-content-end">
                            <b-button variant="outline-secondary" class="mr-2" @click="rerenderModal()">
                                Cancel
                            </b-button>
                            <b-button type="submit" variant="primary">
                                Update
                            </b-button>
                        </div>
                    </form>
                </template>

            </AppModal>

            {{ selectedPublisher }}
        </main>

        <AppModal modalId="removePublisherModal" modalSize="lg" hideFooter :key="modalKey">
            <template #modal-header>
                Mark Publisher as Inactive
            </template>
            <template #modal-body>
                <div class="row mb-3 text-center">
                    Are you sure you want to mark <b>{{ selectedPublisher.publisher_name }}</b> as inactive?
                </div>
                <b-button @click="deletePublisher(selectedPublisher.publisher_id)">yes</b-button>
            </template>
        </AppModal>

    </div>
</template>

<script>
// import AppTable from '@/components/AppTable.vue';
import AppModal from '@/components/AppModal.vue';
import AppDropdown from "@/components/AppDropdown.vue";

import { mapState } from 'vuex';

export default {
    name: 'PublishersView',
    props: [],
    components: {
        // AppTable,
        AppModal,
        AppDropdown
    },
    data() {
        return {
            fields: [
                { key: 'publisher_name', label: 'publisher', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'location', thStyle: { textTransform: "uppercase" }, sortable: true },
                // { key: 'actions', thStyle: { textTransform: "uppercase" } },
            ],
            perPage: 12,
            currentPage: 1,
            totalRows: 1,
            filter: null,
            publisher: this.newPublisherObject(),
            modalKey: 0,
            selectedRow: [],
            selectedPublisher: {}

        }
    },
    created() {
        this.$store.dispatch('fetchPublishers')
    },
    computed: {
        ...mapState(['publishers']),
        items() {
            return this.publishers.publishers.map(item => ({ ...item }));
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
            this.selectedRow = items
            for (let publisher of this.selectedRow) { this.selectedPublisher = publisher }
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        rerenderModal() {
            this.modalKey += 1;
        },
        newPublisherObject() {
            return {
                publisher_name: '',
                location: ''
            }
        },
        addPublisher() {
            this.$store.dispatch('addPublisher', this.publisher)
                .then(() => {
                    this.publisher = this.newPublisherObject();
                    this.rerenderModal();
                })
                .catch(() => {
                    console.log('There was a problem adding the publisher.')
                })
        },
        editPublisher(id, publisher) {
            this.$store.dispatch('editPublisher', { id, publisher })
                .then(() => {
                    this.rerenderModal();
                    this.$router.go(0)
                })
                .catch(() => {
                    console.log('There was a problem adding the publisher.')
                })
        },
        deletePublisher(isbn) {
            this.$store.dispatch('removePublisher', isbn)
                .then(() => {
                    // this.book = this.newPublisherObject();
                    this.rerenderModal();
                    this.$router.go(0)
                })
                .catch(() => {
                    console.log('There was a problem marking the publisher as inactive.')
                })
        },

    }
}
</script>

<style lang="scss">

</style>