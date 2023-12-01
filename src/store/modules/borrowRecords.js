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
    ADD_BORROWRECORDS(state, borrowRecord) {
      state.borrowRecords.push(borrowRecord);
    },
    UPDATE_BORROWRECORDS(state, id) {
      let index = state.copies.findIndex((c) => c.copy_id == id);
      state.copies.splice(index, 0);
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
        await commit("ADD_BORROWRECORDS", borrowRecord);
        router.go(0);
      } catch (error) {
        console.log(error);
      }
    },
    editBorrowRecord({ commit }, { id, borrowRecord }) {
      service
        .updateBorrowRecord(id, borrowRecord)
        .then(async () => {
          console.log(borrowRecord)
          await commit("UPDATE_BORROWRECORDS", borrowRecord);
          router.go(0);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
