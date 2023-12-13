<template>
    <div class="wrapper">
        <main>
            <AppSearchbar @passData="getSearchData($event)" />

            <b-container fluid class="">
                <b-row class="">
                    <b-col cols="12" lg="6" md="12" class="reco__left">
                        <b-col class="book-container">
                            <b-row class="pl-4 pt-4">
                                <h4>Woven in Moonlight</h4>
                            </b-row>
                            <b-row>
                                <b-col cols="12" md="8" sm="12" class="rounded-md pl-4 pt-1 pb-4 text-container">
                                    <p class="text-justify">
                                        <b> A lush tapestry of magic, romance, and revolución, drawing inspiration from
                                            Bolivian politics and history. </b> <br> <br>

                                        Ximena is the decoy Condesa, a stand-in for the last remaining Illustrian royal. Her
                                        people lost everything when the usurper, Atoc, used an ancient relic to summon
                                        ghosts and drive the Illustrians from La Ciudad. Now Ximena’s motivated by her
                                        insatiable thirst for revenge, and her rare ability to spin thread from moonlight.
                                        There could be a way to overthrow the usurper without starting another war, but only
                                        if Ximena turns her back on revenge—and her Condesa.
                                    </p>
                                    <router-link :to="{ name: 'books' }" exact>
                                        <b-button class="primary-btn">Learn More</b-button>
                                    </router-link>
                                </b-col>
                                <b-col cols="12" md="4" sm="12" class="rounded d-flex align-items-center img-container">
                                    <div class="px-4 pb-4 d-flex justify-content-center">
                                        <img src="../../assets/woven.jpg" alt="" />
                                    </div>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-col>
                    <b-col cols="12" lg="6" md="12" class="reco__right">
                        <b-col class="book-container">
                            <b-row class="pl-4 pt-4">
                                <h4>Lobizona: A Novel</h4>
                            </b-row>
                            <b-row>
                                <b-col cols="12" md="8" sm="12" class="rounded-md pl-4 pt-1 pb-4 text-container">
                                    <p class="text-justify">
                                        <b>Manuela Azul</b> has been crammed into an existence that feels too small for her.
                                        As an undocumented immigrant who's on the run from her father's Argentine crime-family,
                                        Manu is confined to a small apartment and a small life in Miami, Florida. <br> <br>
                                        A world connected to her dead father and his criminal past. A world straight out of folklore, where the 7th consecutive daughter is born a bruja and the 7th consecutive son is a lobizón, a werewolf. As Manu uncovers her own story and traces her real heritage, she learns it's not just her residency that's illegal ... it's her entire existence.
                                    </p>
                                    <router-link :to="{ name: 'books' }" exact>
                                        <b-button class="primary-btn">Learn More</b-button>
                                    </router-link>
                                </b-col>
                                <b-col cols="12" md="4" sm="12"
                                    class="rounded d-flex justify-content-center align-items-center img-container">
                                    <div class="px-4 pb-4 d-flex justify-content-center">
                                        <img src="../../assets/lobizona.jpg" alt="" />
                                    </div>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-col>
                </b-row>
            </b-container>
        </main>

        <!-- <main>
            <div class="p-2 rounded">
                <b-row>
                    <b-col cols="6" md="3" class="test">
                        <div class="category-container">
                            <h4>Science Fiction</h4>
                        </div>
                    </b-col>
                    <b-col cols="6" md="3" class="test">
                        <div class="category-container">
                            <h4>Young Adult</h4>
                        </div>
                    </b-col>
                    <b-col cols="6" md="3" class="test">
                        <div class="category-container">
                            <h4>Classics</h4>
                        </div>
                    </b-col>
                    <b-col cols="6" md="3" class="test">
                        <div class="category-container">
                            <h4>Thriller</h4>
                        </div>
                    </b-col>
                </b-row>
            </div>
        </main> -->

        <main class="pt-1">
            <div class="table__container px-4 pt-3 rounded">
                <div class="mt-2 d-flex justify-content-between">
                    <h3>Trending Books</h3>
                    <p>Show all</p>
                </div>
                <div class="p-1 rounded">
                    <b-row>
                        <b-col cols="12" lg="2" md="6" class="test">
                            <div class="trending-container d-flex flex-column justify-content-center align-items-center">
                                <img src="../../assets/square/ps.jpg" alt="">
                                <p class="mt-2">Harry Potter and the <br> Philosopher's Stone</p>
                            </div>
                        </b-col>
                        <b-col cols="12" lg="2" md="6" xl="2" class="test">
                            <div class="trending-container d-flex flex-column justify-content-center align-items-center">
                                <img src="../../assets/square/cos.jpg" alt="">
                                <p class="mt-2">Harry Potter and the <br> Chamber of Secrets</p>
                            </div>
                        </b-col>
                        <b-col cols="12" lg="2" md="6" class="test">
                            <div class="trending-container d-flex flex-column justify-content-center align-items-center">
                                <img src="../../assets/square/poa.jpg" alt="">
                                <p class="mt-2">Harry Potter and the <br> Prisoner of Azkaban</p>
                            </div>
                        </b-col>
                        <b-col cols="12" lg="2" md="6" class="test">
                            <div
                                class="trending-container d-flex flex-column justify-content-center align-items-center text-center">
                                <img src="../../assets/square/gof.jpg" alt="">
                                <p class="mt-2">Harry Potter and the <br> Goblet of Fire</p>
                            </div>
                        </b-col>
                        <b-col cols="12" lg="2" md="6" class="test">
                            <div class="trending-container d-flex flex-column justify-content-center align-items-center">
                                <img src="../../assets/square/op.jpg" alt="">
                                <p class="mt-2">Harry Potter and the <br> Order of the Phoenix</p>
                            </div>
                        </b-col>
                        <b-col cols="12" lg="2" md="6" class="test">
                            <div
                                class="trending-container d-flex flex-column justify-content-center align-items-center text-center">
                                <img src="../../assets/square/hbp.jpg" alt="">
                                <p class="mt-2">Harry Potter and the <br> Half-Blood Prince</p>
                            </div>
                        </b-col>
                    </b-row>
                </div>
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
                    thStyle: { textTransform: "uppercase" },
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

/* .test {
    border: solid 1px red;
} */

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

@media only screen and (min-width: 998px) and (max-width: 1720px) {
.trending-container {

    img {
        width: 150px !important;
        border-radius: 12px;
    }
}
}

@media only screen and (min-width: 1720px) {
.trending-container {

    img {
        width: 100%;
        border-radius: 12px;
    }
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

    .trending-container {
        margin-top: 25px;
    }

    .category-container {
        margin-top: 10px;
    }

}

.category-container {
    background-color: #52796f;
    color: #fff;
    border-radius: 8px;
    height: 70px;
    padding: 16px 24px;

    h4 {
        color: #fff;
    }
}

.trending-container {
    /* border: solid 1px red; */

    img {
        width: 225px;
        border-radius: 12px;
    }
}</style>