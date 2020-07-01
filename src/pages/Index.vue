<template>
    <div class="q-pa-xl">
        <div class="row items-start q-gutter-xl justify-between">
            <q-card style="min-width: 250px" class="col">
                <q-card-section class="row items-center">
                    <q-icon color="primary" name="settings" size="50px" />
                    <div class="text-subtitle1 text-weight-bold text-right col">
                        <div class="text-grey-7">Total Projects</div>
                        <div class="text-primary">{{ totalProjectsCount }}</div>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="row justify-between q-pa-xs">
                    <q-btn color="positive" class="q-px-xs" no-caps flat dense>
                        {{ projectsCount.active_count }} Active
                    </q-btn>
                    <q-btn color="warning" class="q-px-xs" no-caps flat dense>
                        {{ projectsCount.inactive_count }} Inactive
                    </q-btn>
                </q-card-section>
                <q-inner-loading color="primary" :showing="!!singleLoader.projectsCountLoader" />
            </q-card>

            <q-card style="min-width: 250px" class="col">
                <q-card-section class="row items-center">
                    <q-icon color="primary" name="link_off" size="50px" />
                    <div class="text-subtitle1 text-weight-bold text-right col">
                        <div class="text-grey-7">Total Links Scraped</div>
                        <div class="text-primary">{{ totalPagesCount }}</div>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="row justify-between q-pa-xs">
                    <q-btn color="positive" class="q-px-xs" no-caps flat dense>
                        {{ pagesCount.active_count }} Available
                    </q-btn>
                    <q-btn color="warning" class="q-px-xs" no-caps flat dense>
                        {{ pagesCount.inactive_count }} Unavailable
                    </q-btn>
                </q-card-section>
                <q-inner-loading color="primary" :showing="!!singleLoader.pagesCountLoader" />
            </q-card>

            <q-card style="min-width: 250px" class="col">
                <q-card-section class="row items-center">
                    <q-icon color="primary" name="link_off" size="50px" />
                    <div class="text-subtitle1 text-weight-bold text-right col">
                        <div class="text-grey-7">Total Products Scraped</div>
                        <div class="text-primary">{{ totalProductsCount }}</div>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="row justify-between q-pa-xs">
                    <q-btn color="positive" class="q-px-xs" no-caps flat dense>
                        {{ productsCount.active_count }} Available
                    </q-btn>
                    <q-btn color="warning" class="q-px-xs" no-caps flat dense>
                        {{ productsCount.inactive_count }} Unavailable
                    </q-btn>
                </q-card-section>
                <q-inner-loading color="primary" :showing="!!singleLoader.productsCountLoader" />
            </q-card>
        </div>

        <latest-issues/>

        <div class="row q-gutter-xl q-mt-md">
            <latest-scrapped-pages/>
            <latest-parsed-pages/>
        </div>
        <div class="row q-gutter-xl q-mt-md">
           <latest-scrapped-products/>
            <latest-parsed-products/>
        </div>
    </div>
</template>

<script>
import LatestIssues from "components/issues/LatestIssues";
import LatestScrappedPages from "components/issues/LatestScrappedPages";
import LatestParsedPages from "components/issues/LatestParsedPages";
import LatestScrappedProducts from "components/issues/LatestScrappedProducts";
import LatestParsedProducts from "components/issues/LatestParsedProducts";
import {mapGetters} from "vuex";

export default {
    name: "PageIndex",
    components: {
        LatestParsedProducts,
        LatestScrappedProducts,
        LatestParsedPages,
        LatestScrappedPages,
        LatestIssues
    },

    data() {
        return {
            projectsCount: {},
            pagesCount: {},
            productsCount: {}
        };
    },

    computed: {
        totalProjectsCount() {
            return this.projectsCount.active_count+this.projectsCount.inactive_count;
        },
        totalPagesCount() {
            return this.pagesCount.active_count+this.pagesCount.inactive_count;
        },
        totalProductsCount() {
            return this.productsCount.active_count+this.productsCount.inactive_count;
        },
        ...mapGetters({
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    mounted() {
        this.getProjectsCount();
        this.getPagesCount();
        this.getProductsCount();
    },

    methods: {
        getProjectsCount() {
            this.$singleLoaderTrue("projectsCountLoader");

            this.$store
                .dispatch("counts/getProjectsCount", {
                    vm: this
                })
                .then(res => {
                    this.projectsCount = res.data.projectsCount;

                    this.$singleLoaderFalse("projectsCountLoader");
                })
                .catch(err => {
                    //handle error
                });
        },
        getPagesCount() {
            this.$singleLoaderTrue("pagesCountLoader");

            this.$store
                .dispatch("counts/getPagesCount", {
                    vm: this
                })
                .then(res => {
                    this.pagesCount = res.data.pagesCount;

                    this.$singleLoaderFalse("pagesCountLoader");
                })
                .catch(err => {
                    //handle error
                });
        },
        getProductsCount() {
            this.$singleLoaderTrue("productsCountLoader");

            this.$store
                .dispatch("counts/getProductsCount", {
                    vm: this
                })
                .then(res => {
                    this.productsCount = res.data.productsCount;

                    this.$singleLoaderFalse("productsCountLoader");
                })
                .catch(err => {
                    //handle error
                });
        }
    }
};
</script>
