<template>
    <q-card class="col">
        <q-card-section class="q-py-sm">Latest Scrapped Pages</q-card-section>
        <q-separator />

        <q-list v-if="latestScrappedPages.length" class="q-py-md q-pa-md" dense>
            <q-item
                v-for="(page, index) in latestScrappedPages"
                class="q-mb-sm shadow-1 text-weight-medium"
                :key="index"
                clickable
            >
                <q-item-section class="col">{{ page.url }}</q-item-section>
                <q-item-section class="text-center col">
                    <div>{{ $moment(parseInt(page.updated_at.last_scraped_at)).fromNow() }}</div>
                </q-item-section>
            </q-item>
        </q-list>

        <div v-else class="text-center q-py-md text-weight-bold">No scrapped pages found</div>

        <q-inner-loading color="primary" :showing="!!singleLoader.latestScrappedPagesLoader" />

    </q-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "latest-scrapped-pages",

    data() {
        return {
            latestScrappedPages  : [],
        };
    },

    computed: {
        ...mapGetters({
            singleLoader: "ui/singleLoaderStatus",
        })
    },

    mounted() {
        this.getLatestScrappedPages();
    },

    methods: {
        getLatestScrappedPages() {
            this.$singleLoaderTrue("latestScrappedPagesLoader");

            this.$store
                .dispatch("notifications/getLatestScrappedPages", {
                    vm: this
                })
                .then(res => {
                    this.latestScrappedPages = res.data.latestScrappedPages.data;

                    this.$singleLoaderFalse("latestScrappedPagesLoader");
                })
                .catch(err => {
                    //handle error
                });
        }
    }
}
</script>

<style scoped>

</style>
