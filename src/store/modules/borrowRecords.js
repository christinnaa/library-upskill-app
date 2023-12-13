import service from '@/services/service';
import router from "@/router";

export default {
  state: {
    borrowRecords: [],
  },
  getters: {
    activeBorrowRecords: (state) => {
      return state.borrowRecords.filter((borrowRecord) => borrowRecord.status == 'active');
    },
  },
  mutations: {
    SET_BORROWRECORDS(state, borrowRecords) {
      state.borrowRecords = borrowRecords;
    },
    ADD_BORROWRECORD(state, borrowRecord) {
      state.borrowRecords.push(borrowRecord);
    },
    UPDATE_BORROWRECORD(state, id) {
      let index = state.borrowRecords.findIndex((b) => b.borrow_id == id);
      state.borrowRecords.splice(index, 0);
    },
    REMOVE_BORROWRECORD(state, id) {
      let index = state.borrowRecords.findIndex((b) => b.borrow_id == id);
      state.borrowRecords.splice(index, 0);
    },
  },
  actions: {
    fetchBorrowRecords({ commit }) {
      service
        .getBorrowRecords()
        .then(({ data }) => {
          commit('SET_BORROWRECORDS', data);
        })
        .catch((error) => console.log(error));
    },
    async addBorrowRecord({ commit }, borrowRecord) {
      try {
        await service
          .postBorrowRecord(borrowRecord);
        await commit("ADD_BORROWRECORD", borrowRecord);
        // console.log(borrowRecord);
        router.go(0);
      } catch (error) {
        console.log(error);
      }
    },
    editBorrowRecord({ commit }, { id, borrowRecord }) {
      service
        .updateBorrowRecord(id, borrowRecord)
        .then(async () => {
          // console.log(borrowRecord)
          await commit("UPDATE_BORROWRECORD", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    removeBorrowRecord({ commit }, id) {
      service
        .removeBorrowRecord(id)
        .then(async () => {
          await commit("REMOVE_BORROWRECORD", id);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
