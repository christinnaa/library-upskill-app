<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)" />


      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Publishers</h4>
          <div class="d-flex">
            <div v-if="selectedRow[0]">
              <b-button class="mr-2 warning-btn" v-b-modal.removePublisherModal>
                <b-icon icon="trash" scale=".95" class="mx-1"></b-icon>
              </b-button>
              <b-button class="mr-2 secondary-btn" v-b-modal.updatePublisherModal>
                <b-icon icon="pencil-square" scale=".95" class="mx-1"></b-icon>
              </b-button>
            </div>

            <b-button v-else class="primary-btn" v-b-modal.addPublisherModal>
              Add Publisher</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy"
          sort-desc.sync="false" fixed responsive :filter="filter" select-mode="single" ref="selectableTable" selectable
          @row-selected="onRowSelected" @filtered="onFiltered">
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

        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>

        <AppModal modalId="addPublisherModal" :key="modalKey" hideFooter>
          <template #modal-header> Add Publisher </template>

          <template #modal-body>
            <form class="px-2" @submit.prevent="addPublisher">
              <div class="mb-3 pt-0" :class="{
                'input-group--error': $v.publisher.publisher_name.$error,
              }">
                <label for="p_name">Name</label>
                <b-input id="p_name" v-model="publisher.publisher_name"></b-input>
                <p class="error-message" v-if="submitStatus === 'error' &&
                  !$v.publisher.publisher_name.required
                  ">
                  Publisher Name is required.
                </p>
              </div>
              <div class="mb-2" :class="{
                'input-group--error': $v.publisher.publisher_location.$error,
              }">
                <label for="publisher_location">Location</label>
                <b-form-input id="publisher_location" v-model="publisher.publisher_location"></b-form-input>
                <p class="error-message" v-if="submitStatus === 'error' && !$v.publisher.publisher_location.required
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
              <label for="p_name">Name</label>
              <b-input id="p_name" v-model="selectedPublisher.publisher_name"></b-input>
            </div>
            <div class="mb-2" :class="{
              'input-group--error': $v.publisher.publisher_location.$error,
            }">
              <label for="p_location">Location</label>
              <b-form-input id="p_location" v-model="selectedPublisher.publisher_location"></b-form-input>
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
      <template #modal-header> Delete Publisher </template>
      <template #modal-body>
        <div class="pb-2">
          Are you sure you want to delete
          <b>{{ selectedPublisher.publisher_name }}</b>?
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
      publisher_name: {
        required,
      },
      publisher_location: {
        required,
      },
    },
  },
  data() {
    return {
      sortBy: 'publisher',
      fields: [
        {
          key: "publisher_name",
          label: "Publisher Name",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
        {
          key: "publisher_location",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
      ],
      perPage: 8,
      publisher: {
        publisher_name: "",
        publisher_location: "",
      },
      currentPage: 1,
      totalRows: 1,
      filter: null,
      modalKey: 0,
      selectedRow: [],
      selectedPublisher: {},
      submitStatus: null,
    };
  },
  created() {
    this.$store.dispatch("fetchPublishers");
  },
  mounted() {
    this.showToast();
  },
  computed: {
    ...mapState(["publishers"]),
    items() {
      return this.publishers.publishers.map((item) => ({ ...item }));
    },
    rows() {
      return this.items.length;
    },
    sortOptions() {
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
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
      this.clear();
    },
    getSearchData(data) {
      this.filter = data;
    },
    addPublisher() {
      this.publisher.publisher_name = this.capitalizeEachWord(this.publisher.publisher_name);
      this.publisher.publisher_location = this.capitalizeEachWord(this.publisher.publisher_location);

      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        this.performAction('addPublisher', this.publisher, 'success');
      }
    },
    editPublisher(id, publisher) {
      this.performAction('editPublisher', { id, publisher }, 'info');
    },
    deletePublisher(id) {
      this.performAction('removePublisher', id, 'warning');
    },
    logout() {
      this.$store.dispatch("logout")
    },
    capitalizeEachWord(inputString) {
      let words = inputString.split(' ');
      let capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
      let resultString = capitalizedWords.join(' ');

      return resultString;
    },
    clear() {
      this.publisher = {
        publisher_name: "",
        publisher_location: "",
      };
    },
    performAction(action, data, toastType) {
      this.$store.dispatch(action, data);

      localStorage.setItem('toastAction', action);
      localStorage.setItem('toastData', JSON.stringify(data));
      localStorage.setItem('toastType', toastType);
    },
    showToast() {
      const toastAction = localStorage.getItem('toastAction');
      if (toastAction) {
        // const toastData = JSON.parse(localStorage.getItem('toastData'));
        const toastType = localStorage.getItem('toastType') || 'success'; // Default to 'success' if not set

        let message = 'Default toast message';
        if (toastAction === 'addPublisher') {
          message = `Publisher Added Successfully!`;
        } else if (toastAction === 'editPublisher') {
          message = `Publisher Updated Successfully!`;
        } else if (toastAction === 'removePublisher') {
          message = `Publisher Deleted Successfully!`;
        }

        this.$toast[toastType](message, {
          position: "bottom-right",
          timeout: 5000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: true,
          closeButton: "button",
          icon: true,
          rtl: false
        });

        localStorage.removeItem('toastAction');
        localStorage.removeItem('toastData');
        localStorage.removeItem('toastType');
      }
    }
  },
};
</script>

<style lang="scss"></style>
