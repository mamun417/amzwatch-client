<template>
    <q-card class="col" style="min-width: 250px">
        <q-card-section class="q-py-sm">Latest Scraped Pages</q-card-section>
        <q-separator />

        <q-list v-if="latestScrapedPages.length" class="q-py-md q-pa-md" dense>
            <q-item
                v-for="(page, index) in latestScrapedPages"
                class="q-mb-sm shadow-1 text-weight-medium"
                :key="index"
                clickable
            >
                <div class="row full-width">
                    <div class="col-sm-10" style="word-break: break-all">{{ page.url }}</div>
                    <div
                        class="col-sm-2 text-right"
                    >{{ $moment(parseInt(page.updated_at.last_scraped_at)).fromNow() }}</div>
                </div>
            </q-item>
        </q-list>

        <div v-else class="text-center q-py-md text-weight-bold">No scraped pages found</div>

        <q-inner-loading color="primary" :showing="!!singleLoader.latestScrapedPagesLoader" />
    </q-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "latest-scraped-pages",

    data() {
        return {
            latestScrapedPages: []
        };
    },

    computed: {
        ...mapGetters({
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    mounted() {
        this.getLatestScrapedPages();
    },

    methods: {
        getLatestScrapedPages() {
            this.$singleLoaderTrue("latestScrapedPagesLoader");

            this.$store
                .dispatch("notifications/getLatestScrapedPages", {
                    vm: this
                })
                .then(res => {
                    this.latestScrapedPages = res.data.latestScrapedPages.data;

                    this.$singleLoaderFalse("latestScrapedPagesLoader");
                })
                .catch(err => {
                    //handle error
                });
        }
    }
};
</script>

<style scoped>
</style>
