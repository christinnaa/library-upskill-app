<template>
  <div class="wrapper">
    <main>
      <AppSearchbar @passData="getSearchData($event)" />

      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Users</h4>

          <div class="d-flex">
            <div v-if="selectedRow[0]">
              <b-button class="mr-2 warning-btn" v-b-modal.removeUserModal>
                <b-icon icon="trash" scale=".95" class="mx-1"></b-icon>
              </b-button>
              <b-button class="mr-2 secondary-btn" v-b-modal.updateUserModal>
                <b-icon icon="pencil-square" scale=".95" class="mx-1"></b-icon>
              </b-button>
            </div>

            <b-button v-else class="primary-btn" v-b-modal.addUserModal>Add User</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" :sort-by.sync="sortBy"
          sort-desc.sync="false" fixed responsive :filter="filter" select-mode="single" ref="selectableTable" selectable
          @row-selected="onRowSelected" @filtered="onFiltered">
        </b-table>

        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>

        <AppModal modalId="addUserModal" modalSize="md" :key="modalKey" hideFooter>
          <template #modal-header> Add User </template>
          <template #modal-body>
            <form class="px-2" @submit.prevent="addUser">
              <b-row class="mb-3 px-2">
                <div class="col-6" :class="{
                  'input-group--error': $v.user.first_name.$error,
                }">
                  <label for="first_name">First Name</label>
                  <b-form-input id="first_name" v-model="user.first_name"></b-form-input>
                  <p class="error-message" v-if="submitStatus === 'error' &&
                    !$v.user.first_name.required
                    ">
                    First name is required.
                  </p>
                </div>
                <div class="col-6" :class="{
                  'input-group--error': $v.user.last_name.$error,
                }">
                  <label for="last_name">Last Name</label>
                  <b-form-input id="last_name" v-model="user.last_name"></b-form-input>
                  <p class="error-message" v-if="submitStatus === 'error' &&
                    !$v.user.last_name.required
                    ">
                    Last name is required.
                  </p>
                </div>
              </b-row>
              <b-row class="mb-3 px-2">
                <div class="col-4" :class="{
                  'input-group--error': $v.user.role.$error,
                }">
                  <label for="role">Role</label>
                  <b-form-select id="role" v-model="user.role">
                    <b-form-select-option value="" disabled>Select ...</b-form-select-option>
                    <b-form-select-option value="admin">Admin</b-form-select-option>
                    <b-form-select-option value="reader">Reader</b-form-select-option>
                  </b-form-select>
                  <p class="error-message" v-if="submitStatus === 'error' &&
                    !$v.user.role.required
                    ">
                    Role is required.
                  </p>
                </div>
                <div class="col-4" :class="{
                  'input-group--error': $v.user.username.$error,
                }">
                  <label for="username">Username</label>
                  <b-form-input id="username" v-model="user.username"></b-form-input>
                  <p class="error-message" v-if="submitStatus === 'error' &&
                    !$v.user.username.required
                    ">
                    Username is required.
                  </p>
                </div>
                <div class="col-4" :class="{
                  'input-group--error': $v.user.password.$error,
                }">
                  <label for="password">Password</label>
                  <b-form-input id="password" v-model="user.password"></b-form-input>
                  <p class="error-message" v-if="submitStatus === 'error' &&
                    !$v.user.password.required
                    ">
                    Password is required.
                  </p>
                </div>
              </b-row>
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

      <AppModal modalId="updateUserModal" hideFooter modalSize="md" :key="modalKey">
        <template #modal-header> Update User </template>
        <template #modal-body>
          <form @submit.prevent="editUser(selectedUser.user_id, selectedUser)">
            <b-row class="mb-3 px-2">
              <div class="col-6">
                <label for="first_name">First Name</label>
                <b-form-input v-model.trim="selectedUser.first_name" id="first_name"></b-form-input>
              </div>
              <div class="col-6">
                <label for="last_name">Last Name</label>
                <b-form-input v-model.trim="selectedUser.last_name" id="last_name"></b-form-input>
              </div>
            </b-row>
            <b-row class="mb-3 px-2">
              <div class="col-4">
                <label for="role">Role</label>
                <b-form-select id="role" v-model="selectedUser.role">
                  <b-form-select-option value="" disabled>Select ...</b-form-select-option>
                  <b-form-select-option value="admin">Admin</b-form-select-option>
                  <b-form-select-option value="reader">Reader</b-form-select-option>
                </b-form-select>
              </div>
              <div class="col-4">
                <label for="username">Username</label>
                <b-form-input v-model.trim="selectedUser.username" id="username"></b-form-input>
              </div>
              <div class="col-4">
                <label for="password">Password</label>
                <b-form-input v-model.trim="selectedUser.password" id="password"></b-form-input>
              </div>
            </b-row>
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

    <AppModal modalId="removeUserModal" hideFooter :key="modalKey">
      <template #modal-header> Mark Selected User as Inactive </template>
      <template #modal-body>
        <div class="pb-2 pt-1">
          Are you sure you want to mark
          <b>{{ selectedUser.first_name }} {{ selectedUser.last_name }}</b> as inactive?
        </div>

        <div class="w-100 mt-4 d-flex justify-content-end">
          <b-button class="mr-2 secondary-btn text-muted" @click="rerenderModal()">
            Cancel
          </b-button>
          <b-button class="warning-btn text-warning" @click="deleteUser(selectedUser.user_id)">
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
import AppSearchbar from "@/components/AppSearchbar.vue";

export default {
  props: [],
  components: {
    AppModal,
    AppSearchbar
  },
  validations: {
    user: {
      first_name: {
        required,
      },
      last_name: {
        required,
      },
      username: {
        required,
      },
      password: {
        required,
      },
      role: {
        required,
      },
    },
  },
  data() {
    return {
      sortBy: 'first_name',
      fields: [
        {
          key: "first_name",
          label: "First Name",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
        {
          key: "last_name",
          label: "Last Name",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
        // {
        //   key: "password",
        //   label: "Password",
        //   thStyle: { textTransform: "uppercase" },
        //   sortable: true,
        // },
        {
          key: "role",
          label: "Role",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
      ],
      perPage: 8,
      currentPage: 1,
      totalRows: 1,
      filter: null,
      user: {
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        role: "",
      },
      modalKey: 0,
      selectedRow: [],
      selectedUser: {},
      submitStatus: null,
    };
  },
  created() {
    this.$store.dispatch("fetchUsers");
  },
  mounted() {
    this.showToast();
  },
  computed: {
    ...mapState(["users"]),
    items() {
      return this.users.users;
    },
    sortOptions() {
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
    rows() {
      return this.items.length;
    },
  },
  methods: {
    onRowSelected(items) {
      this.selectedRow = items;
      for (let user of this.selectedRow) {
        this.selectedUser = user;
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    getSearchData(data) {
      this.filter = data;
    },
    rerenderModal() {
      this.modalKey += 1;
      this.clear();
    },
    addUser() {
      this.user.first_name = this.capitalizeEachWord(this.user.first_name);
      this.user.last_name = this.capitalizeFirstLetter(this.user.last_name);

      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        this.performAction('addUser', this.user, 'success');
      }
    },
    editUser(user_id, user) {
      // delete user.status;
      // this.$store.dispatch("editUser", { user_id, user });
      this.performAction('editUser', { user_id, user }, 'info');
    },
    deleteUser(id) {
      // this.$store.dispatch("removeUser", id);
      this.performAction('removeUser', id, 'warning');
    },
    logout() {
      this.$store.dispatch("logout")
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    capitalizeEachWord(inputString) {
      let words = inputString.split(' ');
      let capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
      let resultString = capitalizedWords.join(' ');

      return resultString;
    },
    clear() {
      this.user = {
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        role: "",
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
        if (toastAction === 'addUser') {
          message = `User Added Successfully!`;
        } else if (toastAction === 'editUser') {
          message = `User Updated Successfully!`;
        } else if (toastAction === 'removeUser') {
          message = `User Deleted Successfully!`;
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
