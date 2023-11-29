import service from '@/services/service';
// import router from "@/router";

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
  },
};
