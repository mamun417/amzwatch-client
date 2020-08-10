<template>
    <q-card class="col" style="min-width: 250px">
        <q-card-section class="q-py-sm text-subtitle1">Latest Scraped Products</q-card-section>
        <q-separator />

        <q-list v-if="latestScrapedProducts.length" class="q-pa-md" dense>
            <q-item
                v-for="(scrapedProduct, index) in latestScrapedProducts"
                class="q-mb-sm shadow-1 text-weight-medium text-md"
                :key="index"
                clickable
            >
                <q-item-section style="overflow-wrap: anywhere" class="link"  @click.stop="gotoNewTab(scrapedProduct.product.url)">{{ scrapedProduct.product.url }}</q-item-section>
                <q-item-section
                    side
                    no-wrap
                >{{ $fromNowTime(scrapedProduct.product.updated_at.last_scraped_at) }}</q-item-section>
            </q-item>
        </q-list>

        <div v-else class="text-center q-py-md text-weight-bold">No scraped products found</div>

        <q-inner-loading color="primary" :showing="!!singleLoader.latestScrapedProductsLoader" />
    </q-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "latest-scraped-products",

    data() {
        return {
            latestScrapedProducts: []
        };
    },

    computed: {
        ...mapGetters({
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    mounted() {
        this.getLatestScrapedProducts();
    },

    methods: {
        getLatestScrapedProducts() {
            this.$singleLoaderTrue("latestScrapedProductsLoader");

            this.$store
                .dispatch("notifications/getLatestScrapedProducts", {
                    vm: this
                })
                .then(res => {
                    this.latestScrapedProducts =
                        res.data.latestScrapedProducts.data;

                    this.$singleLoaderFalse("latestScrapedProductsLoader");
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
