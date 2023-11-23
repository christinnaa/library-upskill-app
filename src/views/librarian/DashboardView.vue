<template>
    <div class="wrapper">
        <main>
            <AppSearchbar @passData="getSearchData($event)" />

            <!-- <b-container fluid class="rounded">
                <b-row>
                    <b-col cols="7" class="book-container">
                        <b-row>
                            <b-col class="col-9 pl-4 py-4">
                                <h4>Percy Jackson and the Lightning Thief</h4>
                                <p class="text-justify"><b>PERCY JACKSON</b> is about to be kicked out of boarding school...
                                    again. And that's the least of his troubles. Lately, mythological monsters and the gods
                                    of Mount Olympus seem to be walking straight out of the pages of Percy's Greek mythology
                                    textbook and into his life. And worse, he's angered a few of them. Zeus's master
                                    lightning bolt has been stolen, and Percy is the prime suspect. <br> <br>
                                    Now Percy and his friends have just ten days to find and return Zeus's stolen property
                                    and bring peace to a warring Mount Olympus. But to succeed in his quest, Percy will have
                                    to
                                    do more than catch the true thief: he must come to terms with the father who abandoned
                                    him. </p>
                                <router-link :to="{ name: 'books' }" exact>
                                    <b-button class="primary-btn">Learn More</b-button>
                                </router-link>
                            </b-col>
                            <b-col class="book-container col-3 py-3 rounded d-flex justify-content-center">
                                <img src="../../assets/percyjackson.jpg" alt="">
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col cols="4">col-4</b-col>
                </b-row>
            </b-container> -->

            <b-container fluid>
                <b-row class="d-flex">
                    <b-col cols="12" lg="6" md="12" class="book-container">
                        <b-row>
                            <b-col cols="12" md="7" sm="12" class="rounded pl-4 py-4">
                                <h4>Percy Jackson and the Lightning Thief</h4>
                                <p class="text-justify"><b>PERCY JACKSON</b> is about to be kicked out of boarding school...
                                    again. And that's the least of his troubles. Lately, mythological monsters and the gods
                                    of Mount Olympus seem to be walking straight out of the pages of Percy's Greek mythology
                                    textbook and into his life. And worse, he's angered a few of them. Zeus's master
                                    lightning bolt has been stolen, and Percy is the prime suspect.
                                    Now Percy and his friends have just ten days to find and return Zeus's stolen property
                                    and bring peace to a warring Mount Olympus. But to succeed in his quest, Percy will have
                                    to
                                    do more than catch the true thief: he must come to terms with the father who abandoned
                                    him. </p>
                                <router-link :to="{ name: 'books' }" exact>
                                    <b-button class="primary-btn">Learn More</b-button>
                                </router-link>
                            </b-col>
                            <b-col cols="12" md="5" sm="12" class="rounded d-flex align-items-center">
                                <div class="py-3 px-5">
                                    <img src="../../assets/percyjackson.jpg" alt="">
                                </div>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-container>
        </main>

        <main>
            <div class="table__container p-4 pt-3 rounded">
                <div class="mt-2 mb-4">
                    <h4>Trending Books</h4>
                </div>

            </div>

        </main>

    </div>
</template>
  
<script>
import AppSearchbar from '@/components/AppSearchbar.vue';

export default {
    name: "SearchBooksView",
    components: {
        AppSearchbar,
    }
}
</script>
  
<style lang="scss" scoped>
@import "vue-multiselect/dist/vue-multiselect.min.css";

.multiselect__option--highlight {
    background: #333;
}

.test {
    border: solid 1px red;

}

.book-title {
    color: #81B29A;
    font-weight: 600;
}

h4 {
    color: #81B29A;
    font-weight: 600;
}

p {
    font-size: 14px;
}

.book-img {
    width: 400px;
    height: 100%;
    border-radius: 16px;
}

.book-container {
    background-color: white;
    border-radius: 0.25rem;

    img {
        width: 100%;
        border-radius: 12px;
    }
}
</style>
  