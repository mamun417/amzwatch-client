<template>
    <q-card class="col">
        <q-card-section class="q-py-sm">Latest Parsed Pages</q-card-section>
        <q-separator />

        <q-list v-if="latestParsedPages.length" class="q-py-md q-pa-md" dense>
            <q-item
                v-for="(page, index) in latestParsedPages"
                class="q-mb-sm shadow-1 text-weight-medium"
                :key="index"
                clickable
            >
                <q-item-section class="col">{{ page.url }}</q-item-section>
                <q-item-section class="text-center col">
                    <div>{{ $moment(parseInt(page.updated_at.last_parsed_at)).fromNow() }}</div>
                </q-item-section>
            </q-item>
        </q-list>

        <div v-else class="text-center q-py-md text-weight-bold">No parsed pages found</div>

        <q-inner-loading color="primary" :showing="!!singleLoader.latestParsedPagesLoader" />

    </q-card>
</template>

<script>
import {mapGetters} from "vuex";
import Pagination from "components/pagination/Pagination";

export default {
    name: "latest-parsed-pages",

    data() {
        return {
            latestParsedPages  : [],
        };
    },

    computed: {
        ...mapGetters({
            singleLoader: "ui/singleLoaderStatus",
        })
    },

    mounted() {
        this.getLatestParsedPages();
    },

    methods: {
        getLatestParsedPages() {
            this.$singleLoaderTrue("latestParsedPagesLoader");

            this.$store
                .dispatch("notifications/getLatestParsedPages", {
                    vm: this
                })
                .then(res => {
                    this.latestParsedPages = res.data.latestParsedPages.data;

                    this.$singleLoaderFalse("latestParsedPagesLoader");
                })
                .catch(err => {
                    //handle error
                });
        },
    }
}
</script>

<style scoped>

</style>
