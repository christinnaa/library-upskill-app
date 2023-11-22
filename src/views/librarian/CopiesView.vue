<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)"/>


      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Book Copies</h4>
          <div>
            <b-button class="mr-2 warning-btn" v-if="selectedRow[0] && selectedPublisher.status == 'active'"
              v-b-modal.removePublisherModal>
              <b-icon icon="slash-circle" scale=".85"></b-icon>
              Mark as Inactive</b-button>
            <b-button class="mr-2 success-btn" @click="
              editPublisher(selectedPublisher.publisher_id, selectedPublisher)
            " v-if="selectedRow[0] && selectedPublisher.status == 'inactive'">
              <b-icon icon="check2-circle" scale=".85"></b-icon>
              Mark as Active</b-button>
            <b-button v-if="selectedRow[0]" class="mr-2 info-btn" v-b-modal.updatePublisherModal>
              Update
            </b-button>

            <b-button class="primary-btn" v-b-modal.addPublisherModal>
              Add Publisher</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy" sort-desc.sync="false" fixed responsive :filter="filter" select-mode="single"
          ref="selectableTable" selectable @row-selected="onRowSelected" @filtered="onFiltered">
          <template #cell(location)="row">
            <div v-if="row.item.status == 'inactive'" class="inactive">
              <span>{{ row.item.p_location }}</span>
              <b-badge pill variant="light" class="ml-2">{{
                row.item.status
              }}</b-badge>
            </div>
            <template v-else>
              {{ row.item.p_location }}
            </template>
          </template>
        </b-table>

        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>

        <AppModal modalId="addPublisherModal" :key="modalKey" hideFooter>
          <template #modal-header> Add Publisher </template>

          <template #modal-body>
            <form class="px-2" @submit.prevent="addPublisher">
              <div class="mb-3 pt-0" :class="{
                'input-group--error': $v.publisher.p_name.$error,
              }">
                <label for="p_name">Name</label>
                <b-input id="p_name" v-model="publisher.publisher"></b-input>
                <p class="error-message" v-if="
                  submitStatus === 'error' &&
                  !$v.publisher.p_name.required
                ">
                  Name is required.
                </p>
              </div>
              <div class="mb-2" :class="{
                'input-group--error': $v.publisher.p_name.$error,
              }">
                <label for="p_location">Location</label>
                <b-form-input id="p_location" v-model="publisher.p_location"></b-form-input>
                <p class="error-message" v-if="
                  submitStatus === 'error' && !$v.publisher.p_location.required
                ">
                  Location is required.
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

      <AppModal modalId="updatePublisherModal" hideFooter :key="modalKey">
        <template #modal-header> Update Publisher </template>

        <template #modal-body>
          <form class="px-2" @submit.prevent="
            editPublisher(selectedPublisher.publisher_id, selectedPublisher)
          ">
            <div class="mb-3 pt-0">
              <label for="p_name">Title</label>
              <b-input id="p_name" v-model="selectedPublisher.title"></b-input>
            </div>
            <div class="mb-2" :class="{
              'input-group--error': $v.publisher.p_name.$error,
            }">
              <label for="p_location">Copies</label>
              <b-form-input id="p_location" v-model="selectedPublisher.copy"></b-form-input>
            </div>

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

    <AppModal modalId="removePublisherModal" modalSize="md" hideFooter :key="modalKey">
      <template #modal-header> Mark Selected Publisher as Inactive </template>
      <template #modal-body>
        <div class="pb-2">
          Are you sure you want to mark
          <b>{{ selectedPublisher.p_name }}</b> as inactive?
        </div>

        <div class="w-100 mt-4 d-flex justify-content-end">
          <b-button class="mr-2 secondary-btn text-muted" @click="rerenderModal()">
            Cancel
          </b-button>
          <b-button variant="warning" class="warning-btn text-warning"
            @click="deletePublisher(selectedPublisher.publisher_id)">
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
import AppSearchbar from '@/components/AppSearchbar.vue';

export default {
  name: "PublishersView",
  props: [],
  components: {
    // AppTable,
    AppModal,
    AppSearchbar,
  },
  validations: {
    publisher: {
      p_name: {
        required,
      },
      p_location: {
        required,
      },
    },
  },
  data() {
    return {
      sortBy: 'title',
      fields: [
        {
          key: "title",
          label: "Book Title",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
        {
          key: "copy",
          label: "Copies",
          thStyle: { textTransform: "uppercase" },
        },
      ],
      items: [
        {
          title: "Harry Potter and the Philosophers Stone",
          copy: 2,
        },
        {
          title: "The Summer I Turned Pretty",
          copy: 4,
        },
        {
          title: "The Lightning Thief",
          copy: 1,
        },

      ],
      perPage: 12,
      currentPage: 1,
      totalRows: 1,
      filter: null,
      publisher: this.newPublisherObject(),
      modalKey: 0,
      selectedRow: [],
      selectedPublisher: {},
      submitStatus: null,
    };
  },
  created() {
    this.$store.dispatch("fetchPublishers");
  },
  computed: {
    ...mapState(["publishers"]),
    // items() {
    //   return this.publishers.publishers.map((item) => ({ ...item }));
    // },
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
      this.selectedRow = items;
      for (let publisher of this.selectedRow) {
        this.selectedPublisher = publisher;
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    rerenderModal() {
      this.modalKey += 1;
    },
    getSearchData(data){
      this.filter = data;
    },
    newPublisherObject() {
      return {
        p_name: "",
        p_location: "",
      };
    },
    addPublisher() {
      this.$v.$touch();

      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        this.$store
          .dispatch("addPublisher", this.publisher)
      }
    },
    editPublisher(id, publisher) {
      delete publisher.status;
      this.$store
        .dispatch("editPublisher", { id, publisher })

    },
    deletePublisher(isbn) {
      this.$store
        .dispatch("removePublisher", isbn)

    },
    logout() {
      this.$store.dispatch("logout")
    },
  },
};
</script>

<style lang="scss">

</style>