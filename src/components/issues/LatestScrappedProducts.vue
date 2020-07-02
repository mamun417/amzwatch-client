<template>
    <q-card class="col" style="min-width: 250px" >
        <q-card-section class="q-py-sm">Latest Scrapped Products</q-card-section>
        <q-separator />

        <q-list v-if="latestScrappedProducts.length" class="q-py-md q-pa-md" dense>
            <q-item
                v-for="(scrappedProduct, index) in latestScrappedProducts"
                class="q-mb-sm shadow-1 text-weight-medium"
                :key="index"
                clickable
            >
                <div class="row full-width">
                    <div class="col-sm-10" style="word-break: break-all">
                        {{ scrappedProduct.product.url }}
                    </div>
                    <div class="col-sm-2 text-right">
                        {{ $moment(parseInt(scrappedProduct.product.updated_at.last_scraped_at)).fromNow() }}
                    </div>
                </div>
            </q-item>
        </q-list>

        <div v-else class="text-center q-py-md text-weight-bold">No scrapped products found</div>

        <q-inner-loading color="primary" :showing="!!singleLoader.latestScrappedProductsLoader" />

    </q-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "latest-scrapped-products",

    data() {
        return {
            latestScrappedProducts  : [],
        };
    },

    computed: {
        ...mapGetters({
            singleLoader: "ui/singleLoaderStatus",
        })
    },

    mounted() {
        this.getLatestScrappedProducts();
    },

    methods: {
        getLatestScrappedProducts() {
            this.$singleLoaderTrue("latestScrappedProductsLoader");

            this.$store
                .dispatch("notifications/getLatestScrappedProducts", {
                    vm: this
                })
                .then(res => {
                    this.latestScrappedProducts = res.data.latestScrappedProducts.data;

                    this.$singleLoaderFalse("latestScrappedProductsLoader");
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
