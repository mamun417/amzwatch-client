<template>
    <div>
        <q-list>
            <q-item v-if="$q.screen.gt.sm" class="q-mb-sm text-subtitle2 text-primary">
                <q-item-section class="q-ml-md">Link</q-item-section>
                <q-item-section class="text-center">Hosted Link</q-item-section>
                <q-item-section class="text-right q-mr-md">Status</q-item-section>
            </q-item>

            <q-expansion-item
                v-for="(guestPostInfo, index) in guestPostsInfo"
                :key="index"
                group="guestPost"
                icon
                header-class
                expand-icon-class="hidden"
                class="shadow-1 q-mb-sm"
            >
                <div
                    slot="header"
                    class="row full-width justify-between text-subtitle2 items-center"
                    :class="$q.screen.lt.sm ? 'text-center' : ''"
                >
                    <q-item-section class="col-12 col-sm">{{ guestPostInfo.guest_post_url }}</q-item-section>
                    <q-item-section class="col-12 col-sm text-center">{{ guestPostInfo.holding_url }}</q-item-section>
                    <q-item-section class="col-12 col-sm inline-block"
                        :class="$q.screen.gt.sm ? 'text-right':''"
                    >
                        <q-badge
                            :color="calculateLinkExist(guestPostInfo) !== 'exist' ? 'warning' : 'positive'"
                        >{{ calculateLinkExist(guestPostInfo) }}</q-badge>
                    </q-item-section>
                </div>

                <q-card v-if="calculateLinkExist(guestPostInfo) !== 'pending'">
                    <q-card-section>
                        <div
                            class="text-caption text-bold"
                        >Last updated at: {{ $timestampToDate(guestPostInfo.updated_at.link_last_checked_at) }}</div>
                    </q-card-section>
                </q-card>
            </q-expansion-item>
        </q-list>

        <q-card-section v-if="!guestPostsInfo.length" class="text-center q-py-xl">
            <div class="q-mb-lg text-subtitle2">No guest link found</div>
        </q-card-section>

        <div v-if="guestLinksPaginationMeta.last_page > 1" class="q-pa-lg flex flex-center">
            <pagination
                :current_page="guestLinksPaginationMeta.current_page"
                :last_page="guestLinksPaginationMeta.last_page"
                @handlePagination="guestLinksPaginationHandle"
            />
        </div>

        <q-inner-loading color="primary" :showing="!!singleLoader.guestLinksListLoader" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "components/pagination/Pagination";

export default {
    name: "GuestLinksList",
    components: { Pagination },
    props: {
        getGuestPostsCount: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            guestPostsInfo: []
        };
    },

    mounted() {
        this.getGuestLinks();

        this.interval = setInterval(() => {
            this.getGuestLinks();
        }, this.$intervalTime);
    },

    beforeDestroy() {
        this.interval && clearInterval(this.interval);
    },

    computed: {
        ...mapGetters({
            guestLinksPaginationMeta: "guest_links/paginationMeta",
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    methods: {
        calculateLinkExist(guestPostObj) {
            if (guestPostObj.hasOwnProperty("link_infos")) {
                if (guestPostObj.link_infos.hasOwnProperty("exists")) {
                    return guestPostObj.link_infos.exists !== "1"
                        ? "not exist"
                        : "exist";
                }
            }

            return "pending";
        },
        getGuestLinks() {
            this.$singleLoaderTrue("guestLinksListLoader");
            this.$forceUpdate();

            this.$store
                .dispatch("guest_links/getGuestPosts", {
                    vm: this,
                    project_id: this.$route.params.project_id
                })
                .then(res => {
                    this.guestPostsInfo = res.data.linksInGuestPosts.data;

                    this.$emit(
                        "getGuestLinksCount",
                        res.data.linksInGuestPosts.pagination_meta.total
                    );

                    this.$singleLoaderFalse("guestLinksListLoader");
                })
                .catch(err => {
                    //handle error
                });
        },

        guestLinksPaginationHandle(page) {
            this.$store
                .dispatch("guest_links/updateGuestPostsCurrentPage", page)
                .then(() => {
                    this.getGuestLinks();
                });
        }
    }
};
</script>

