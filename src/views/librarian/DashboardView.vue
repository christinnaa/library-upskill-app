<template>
    <div class="wrapper">
        <main>
            <AppSearchbar @passData="getSearchData($event)" />

            <b-container fluid class="">
                <b-row class="">
                    <b-col cols="12" lg="6" md="12" class="reco__left">
                        <b-col class="book-container">
                            <b-row class="pl-4 pt-4">
                                <h4>Harry Potter and the Philosopher's Stone</h4>
                            </b-row>
                            <b-row>
                                <b-col cols="12" md="8" sm="12" class="rounded-md pl-4 pt-2 pb-4 text-container">
                                    <!-- <h4>Percy Jackson and the Lightning Thief</h4> -->
                                    <p class="text-justify">
                                        Turning the envelope over, his hand trembling, Harry saw a purple wax seal bearing a coat of arms; 
                                        a lion, an eagle, a badger and a snake surrounding a large letter 'H'. <br> <br>
                                        <b>HARRY POTTER </b>has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive.
                                        Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called 'Rubeus Hagrid' bursts in with some astonishing news:
                                        Harry Potter is a wizard, and he has a place at <b>HOGWARTS SCHOOL OF WITCHCRAFT AND WIZARDRY</b>. An incredible adventure is about to begin!
                                    </p>
                                    <router-link :to="{ name: 'books' }" exact>
                                        <b-button class="primary-btn">Learn More</b-button>
                                    </router-link>
                                </b-col>
                                <b-col cols="12" md="4" sm="12" class="rounded d-flex align-items-center img-container">
                                    <div class="px-4 pb-4 d-flex justify-content-center">
                                        <img src="../../assets/harrypotter.jpg" alt="" />
                                    </div>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-col>
                    <b-col cols="12" lg="6" md="12" class="reco__right">
                        <b-col class="book-container">
                            <b-row class="pl-4 pt-4">
                                <h4>Percy Jackson and the Lightning Thief</h4>
                            </b-row>
                            <b-row>
                                <b-col cols="12" md="8" sm="12" class="rounded-md pl-4 pt-2 pb-4 text-container">
                                    <!-- <h4>Percy Jackson and the Lightning Thief</h4> -->
                                    <p class="text-justify">
                                        <b>PERCY JACKSON</b> is about to be kicked out of boarding
                                        school... again. Lately, mythological monsters and the gods
                                        of Mount Olympus seem to be walking straight out of the
                                        pages of Percy's Greek mythology textbook and into his life.
                                        Zeus's master lightning bolt has been stolen, and Percy is
                                        the prime suspect. <br /> <br />
                                        Now Percy and his friends have just ten days to find and return Zeus's stolen property
                                        and bring peace to a warring Mount Olympus. But to succeed in his quest, Percy will have
                                        to do more than catch the true thief: he must come to terms with the father who abandoned him.
                                    </p>
                                    <router-link :to="{ name: 'books' }" exact>
                                        <b-button class="primary-btn">Learn More</b-button>
                                    </router-link>
                                </b-col>
                                <b-col cols="12" md="4" sm="12"
                                    class="rounded d-flex justify-content-center align-items-center img-container">
                                    <div class="px-4 pb-4 d-flex justify-content-center">
                                        <img src="../../assets/percyjackson.jpg" alt="" />
                                    </div>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-col>
                </b-row>
            </b-container>
        </main>

        <main>
            <div class="table__container p-4 pt-3 rounded">
                <div class="mt-2 mb-4">
                    <h3>Trending Books</h3>
                </div>

                <b-table :items="items" :fields="fields" label-sort-asc="" label-sort-desc="" label-sort-clear="" responsive>
                </b-table>
            </div>
        </main>
    </div>
</template>
  
<script>
import AppSearchbar from "@/components/AppSearchbar.vue";

export default {
    name: "SearchBooksView",
    components: {
        AppSearchbar,
    },
    data() {
        return {
            fields: [
                { key: "isbn", thStyle: { textTransform: "uppercase" } },
                {
                    key: "title",
                    thStyle: { textTransform: "uppercase"},
                    sortable: true,
                },
                {
                    key: "author",
                    thStyle: { textTransform: "uppercase" },
                    sortable: true,
                },
                {
                    key: "cat_name",
                    label: 'Category',
                    thStyle: { textTransform: "uppercase" },
                    sortable: true,
                },
            ],
            items: [
                {
                    copies: 2,
                    isbn: "978-0-7475-3269-9",
                    title: "Harry Potter and the Philosophers Stone",
                    author: "J.K. Rowling",
                    p_name: "Bloomsbury",
                    publication_year: 1997,
                    cat_name: "Fantasy",
                    pages: 223,
                    status: "active",
                },
                {
                    copies: 4,
                    isbn: "978-1-4169-6829-0",
                    title: "The Summer I Turned Pretty",
                    author: "Jenny Han",
                    p_name: "Simon & Schuster",
                    publication_year: 2010,
                    cat_name: "Romance",
                    pages: 276,
                    status: "active",
                },
                {
                    copies: 1,
                    isbn: "0-7868-5629-7",
                    title: "The Lightning Thief",
                    author: "Rick Riordan",
                    p_name: "Simon & Schuster",
                    publication_year: 2010,
                    cat_name: "Fantasy",
                    pages: 377,
                    status: "active",
                },
            ],
        };
    },
};
</script>
  
<style lang="scss" scoped>
@import "vue-multiselect/dist/vue-multiselect.min.css";

.test {
    border: solid 1px red;
}

h4 {
    color: #81b29a;
    font-weight: 600;
}

p {
    font-size: 14px;
}

.book-container {
    background-color: white;
    border-radius: 0.25rem;

    img {
        width: 100%;
        border-radius: 12px;
    }
}

.reco {
    &__left {
        padding: 0px 8px 0px 0px;
    }

    &__right {
        padding: 0px 0px 0px 8px;
    }
}

@media only screen and (max-width: 992px) {

    .reco {
        &__right {
            margin-top: 30px;
            padding: 0px 0px 0px 0px;
        }

        &__left {
            padding: 0px 0px 0px 0px;
        }
    }


    .img-container {
        margin-top: 20px;
    }

    .text-container {
        padding: 8px 24px 24px 24px;
    }
    
}
</style>