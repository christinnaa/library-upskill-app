import service from "@/services/service";
// import router from "@/router";

export default {
    state: {
        copies: [],
    },
    getters: {
        activeCopies: (state) => {
            return state.copies.filter(
                (copy) => copy.status == "active"
            );
        },
    },
    mutations: {
        SET_COPIES(state, copies) {
            state.copies = copies;
        }
    },
    actions: {
        fetchCopies({ commit }) {
            service
                .getCopies()
                .then(({ data }) => {
                    commit("SET_COPIES", data);
                })
                .catch((error) => console.log(error));
        }
    },
};
