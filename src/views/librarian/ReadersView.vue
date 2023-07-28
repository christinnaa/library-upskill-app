<template>
    <div class="wrapper">
        <main>
            <AppTable :fields="fields" :items="items">
                <template v-slot:header>
                    {{ readers.readers }}
                    <div class="d-flex justify-content-between mt-2 mb-4">
                        <h4>Readers</h4>
                        <b-button v-b-modal.addReaderModal variant="primary">Add Reader</b-button>
                    </div>
                </template>

                <template v-slot:dropdown-list>
                    <li>
                        <a v-b-modal.updateReaderModal class="dropdown-item d-flex align-items-center py-2" href="#">
                            <b-icon icon="pencil-square" class="mr-2" font-scale=".95"></b-icon>
                            Update
                        </a>
                    </li>
                    <li><a class="dropdown-item d-flex align-items-center py-2" href="#">
                            <b-icon icon="trash" class="mr-2" font-scale=".95"></b-icon>
                            Remove
                        </a>
                    </li>
                </template>
            </AppTable>
        </main>

        <AppModal modalId="addReaderModal" modalSize="lg" hideFooter>
            <template #modal-header>
                Add Reader
            </template>
            <template #modal-body>
                <form @submit.prevent="addReader">
                    <div class="row mb-3">
                        <div class="col-6">
                            <label for="first_name">First Name</label>
                            <b-form-input id="first_name" v-model="reader.u_first_name"></b-form-input>
                        </div>
                        <div class="col-6">
                            <label for="last_name">Last Name</label>
                            <b-form-input id="last_name" v-model="reader.u_last_name"></b-form-input>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-6">
                            <label for="date_of_birth">Date of Birth</label>
                            <b-form-input type="date" id="date_of_birth" v-model="reader.date_of_birth"></b-form-input>
                        </div>
                        <div class="col-6">
                            <label for="city">City</label>
                            <b-form-input id="city" v-model="reader.city"></b-form-input>
                        </div>
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

        <AppModal modalId="createReaderModal" hideFooter>
            <template #modal-header>
                Reader Details
            </template>
            <template #modal-body>
                <b-list-group class="mb-1">
                    <b-list-group-item>Cras justo odio</b-list-group-item>
                    <b-list-group-item>Dapibus ac facilisis in</b-list-group-item>
                    <b-list-group-item>Morbi leo risus</b-list-group-item>
                    <b-list-group-item>Porta ac consectetur ac</b-list-group-item>
                    <b-list-group-item>Vestibulum at eros</b-list-group-item>
                </b-list-group>
            </template>
        </AppModal>

        <AppModal modalId="updateReaderModal" modalSize="lg">
            <template #modal-header>
                Update Reader
            </template>
            <template #modal-body>
                <form>
                    <div class="row mb-3">
                        <div class="col-6">
                            <label for="first_name">First Name</label>
                            <b-form-input id="first_name"></b-form-input>
                        </div>
                        <div class="col-6">
                            <label for="last_name">Last Name</label>
                            <b-form-input id="subcategories"></b-form-input>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-6">
                            <label for="date_of_birth">Date of Birth</label>
                            <b-form-input type="date" id="date_of_birth"></b-form-input>
                        </div>
                        <div class="col-6">
                            <label for="city">City</label>
                            <b-form-input id="city"></b-form-input>
                        </div>
                    </div>
                </form>
            </template>
            <template #modal-btn>
                <b-button variant="primary">
                    Update
                </b-button>
            </template>
        </AppModal>
    </div>
</template>

<script>
import AppTable from '@/components/AppTable.vue';
import AppModal from '@/components/AppModal.vue';
import { mapState } from 'vuex';

export default {
    props: [],
    components: {
        AppTable,
        AppModal
    },
    data() {
        return {
            fields: [
                { key: 'reader_id', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'reader', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'city', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'date_of_birth', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'actions', thStyle: { textTransform: "uppercase" } },
            ],
            reader: this.newReaderObject(),
            modalKey: 0
        }
    },
    created() {
        this.$store.dispatch('fetchReaders')
    },
    computed: {
        ...mapState(['readers']),
        items() {
            return this.readers.readers
        }
    },
    methods: {
        randomPassword() {
            let result = '';
            let length = 8;
            let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        },
        newReaderObject() {
            return {
                u_first_name: '',
                u_last_name: '',
                date_of_birth: '',
                city: '',
                username: 'abc',
                password: this.randomPassword()
            }
        },
        rerenderModal() {
            this.modalKey += 1;
        },
        addReader() {
            this.$store.dispatch('addReader', this.reader)
                .then(() => {
                    this.reader = this.newReaderObject()
                    this.rerenderModal()

                })
                .catch(() => {
                    console.log('There was a problem adding the user.')
                })
        },
    }
}
</script>

<style>

</style>