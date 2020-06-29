<template>
    <div class="q-pa-xl">
        <div class="row items-start q-gutter-xl justify-between">
            <q-card style="min-width: 250px" class="col">
                <q-card-section class="row items-center">
                    <q-icon color="primary" name="settings" size="50px" />
                    <div class="text-subtitle1 text-weight-bold text-right col">
                        <div class="text-grey-7">Total Projects</div>
                        <div class="text-primary">5</div>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="row justify-between q-pa-xs">
                    <q-btn color="positive" class="q-px-xs" no-caps flat dense>3 Active</q-btn>
                    <q-btn color="warning" class="q-px-xs" no-caps flat dense>2 Inactive</q-btn>
                </q-card-section>
            </q-card>

            <q-card style="min-width: 250px" class="col">
                <q-card-section class="row items-center">
                    <q-icon color="primary" name="link_off" size="50px" />
                    <div class="text-subtitle1 text-weight-bold text-right col">
                        <div class="text-grey-7">Total Links Scraped</div>
                        <div class="text-primary">500</div>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="row justify-between q-pa-xs">
                    <q-btn color="positive" class="q-px-xs" no-caps flat dense>300 Available</q-btn>
                    <q-btn color="warning" class="q-px-xs" no-caps flat dense>200 Unavailable</q-btn>
                </q-card-section>
            </q-card>

            <q-card style="min-width: 250px" class="col">
                <q-card-section class="row items-center">
                    <q-icon color="primary" name="link_off" size="50px" />
                    <div class="text-subtitle1 text-weight-bold text-right col">
                        <div class="text-grey-7">Total Products Scraped</div>
                        <div class="text-primary">500</div>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="row justify-between q-pa-xs">
                    <q-btn color="positive" class="q-px-xs" no-caps flat dense>300 Available</q-btn>
                    <q-btn color="warning" class="q-px-xs" no-caps flat dense>200 Unavailable</q-btn>
                </q-card-section>
            </q-card>
        </div>

        <div class="row q-gutter-xl q-mt-lg">
            <q-card class="col">
                <q-card-section class="q-py-sm">Latest Issues</q-card-section>
                <q-separator />
                <q-card-section>aaa</q-card-section>
            </q-card>

            <!-- <q-card class="col">
                <q-card-section class="q-py-sm">aaa</q-card-section>
                <q-separator />
                <q-card-section>aaa</q-card-section>
            </q-card>-->
        </div>

        <div class="row q-gutter-xl q-mt-md">
            <q-card class="col">
                <q-card-section class="q-py-sm">Latest Scrapped Pages</q-card-section>
                <q-separator />
                <q-card-section>aaa</q-card-section>
            </q-card>

            <q-card class="col">
                <q-card-section class="q-py-sm">Latest Parsed Pages</q-card-section>
                <q-separator />
                <q-card-section>aaa</q-card-section>
            </q-card>
        </div>
        <div class="row q-gutter-xl q-mt-md">
            <q-card class="col">
                <q-card-section class="q-py-sm">Latest Scrapped Products</q-card-section>
                <q-separator />
                <q-card-section>aaa</q-card-section>
            </q-card>

            <q-card class="col">
                <q-card-section class="q-py-sm">Latest Parsed Products</q-card-section>
                <q-separator />
                <q-card-section>aaa</q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script>
export default {
    name: "PageIndex",

    data() {
        return {
            projectsCount: {},
            pagesCount: {},
            productsCount: {}
        };
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