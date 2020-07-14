<template>
    <div>
        <q-list>
            <q-item class="q-mb-sm text-subtitle2 text-primary">
                <q-item-section class="q-ml-md">Link</q-item-section>
                <q-item-section class="text-center">Status</q-item-section>
                <q-item-section class="text-right q-mr-md">Last Checked</q-item-section>
            </q-item>

            <q-expansion-item
                v-for="(link, index) in brokenLinkInfo"
                :key="index"
                group="brokenLink"
                icon
                header-class
                expand-icon-class="hidden"
                class="shadow-3 q-mb-sm"
            >
                <q-item
                    slot="header"
                    class="row full-width justify-between text-subtitle2 items-center"
                >
                    <q-item-section class="col">{{ link.url }}</q-item-section>
                    <q-item-section class="col text-center inline-block">
                        <q-badge
                            :color="calculateLinkStatus(link) !== 'available' ? 'warning' : 'positive'"
                        >{{ calculateLinkStatus(link) }}</q-badge>
                    </q-item-section>
                    <q-item-section class="col text-right">
                        <template
                            v-if="calculateLinkStatus(link) !== 'pending'"
                        >{{$timestampToDate(link.updated_at.last_scraped_at)}}</template>
                    </q-item-section>
                </q-item>
            </q-expansion-item>
        </q-list>

        <q-card-section v-if="!brokenLinkInfo.length" class="text-center q-py-xl">
            <div class="q-mb-lg text-subtitle2">No broken link found</div>
        </q-card-section>

        <div v-if="brokenLinksPaginationMeta.last_page > 1" class="q-pa-lg flex flex-center">
            <pagination
                :current_page="brokenLinksPaginationMeta.current_page"
                :last_page="brokenLinksPaginationMeta.last_page"
                @handlePagination="brokenLinksPaginationHandle"
            />
        </div>
        <q-inner-loading color="primary" :showing="!!singleLoader.brokenLinksListLoader" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "components/pagination/Pagination";

export default {
    name: "BrokenLinksList",
    components: { Pagination },
    data() {
        return {
            brokenLinkInfo: [],
            interval: null
        };
    },

    mounted() {
        this.getBrokenLinkInfo();

        this.interval = setInterval(() => {
            this.getBrokenLinkInfo();
        }, this.$intervalTime);
    },

    beforeDestroy() {
        this.interval && clearInterval(this.interval);
    },

    computed: {
        ...mapGetters({
            brokenLinksPaginationMeta: "broken_links/paginationMeta",
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    methods: {
        calculateLinkStatus(linkObj) {
            if (linkObj.hasOwnProperty("meta")) {
                if (
                    linkObj.meta.hasOwnProperty("page_status") &&
                    linkObj.meta.page_status
                ) {
                    let status = linkObj.meta.page_status.toString();

                    return ["2", "3"].includes(status[0])
                        ? "available"
                        : "unavailable";
                }
            }
            return "pending";
        },
        getBrokenLinkInfo() {
            this.$singleLoaderTrue("brokenLinksListLoader");
            this.$forceUpdate();

            this.$store
                .dispatch("broken_links/getBrokenLinks", {
                    vm: this,
                    project_id: this.$route.params.project_id
                })
                .then(res => {
                    this.brokenLinkInfo = res.data.brokenLinks.data;

                    this.brokenLinkInfo.map(link => {
                        if (!link.hasOwnProperty("meta")) {
                            this.$set(link, "meta", {});
                        }
                    });

                    this.$emit(
                        "linksCountUpdated",
                        res.data.brokenLinks.pagination_meta.total
                    );

                    this.$singleLoaderFalse("brokenLinksListLoader");
                })
                .catch(err => {
                    //handle error
                });
        },

        brokenLinksPaginationHandle(page) {
            this.$store
                .dispatch("broken_links/updateBrokenLinksCurrentPage", page)
                .then(() => {
                    this.getBrokenLinkInfo();
                });
        }
    }
};
</script>

<style scoped>
</style>
