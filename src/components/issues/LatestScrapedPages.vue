<template>
    <q-card class="col" style="min-width: 250px">
        <q-card-section class="q-py-sm text-subtitle1">Latest Scraped Pages</q-card-section>
        <q-separator />

        <q-list v-if="latestScrapedPages.length" class="q-pa-md" dense>
            <q-item
                v-for="(page, index) in latestScrapedPages"
                class="q-mb-sm shadow-1 text-weight-medium text-md"
                :key="index"
                clickable
            >
                <q-item-section style="overflow-wrap: anywhere" class="link"  @click.stop="gotoNewTab(page.url)">{{ page.url }}</q-item-section>
                <q-item-section side no-wrap>{{ $fromNowTime(page.updated_at.last_scraped_at) }}</q-item-section>
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
