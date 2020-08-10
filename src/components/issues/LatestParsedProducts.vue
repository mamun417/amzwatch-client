<template>
    <q-card class="col" style="min-width: 250px">
        <q-card-section class="q-py-sm text-subtitle1">Latest Parsed Products</q-card-section>
        <q-separator />

        <q-list v-if="latestParsedProducts.length" class="q-pa-md" dense>
            <q-item
                v-for="(parsedProduct, index) in latestParsedProducts"
                class="q-mb-sm shadow-1 text-weight-medium text-md"
                :key="index"
                clickable
            >
                <q-item-section style="overflow-wrap: anywhere" class="link"  @click.stop="gotoNewTab(parsedProduct.product.url)">
                    {{ parsedProduct.product.url }}
                </q-item-section>
                <q-item-section
                    side
                    no-wrap
                >{{ $fromNowTime(parsedProduct.product.updated_at.last_parsed_at) }}</q-item-section>
            </q-item>
        </q-list>

        <div v-else class="text-center q-py-md text-weight-bold">No parsed products found</div>

        <q-inner-loading color="primary" :showing="!!singleLoader.latestParsedProductsLoader" />
    </q-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "latest-parsed-products",

    data() {
        return {
            latestParsedProducts: []
        };
    },

    computed: {
        ...mapGetters({
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    mounted() {
        this.getLatestParsedProducts();
    },

    methods: {
        getLatestParsedProducts() {
            this.$singleLoaderTrue("latestParsedProductsLoader");

            this.$store
                .dispatch("notifications/getLatestParsedProducts", {
                    vm: this
                })
                .then(res => {
                    this.latestParsedProducts =
                        res.data.latestParsedProducts.data;

                    this.$singleLoaderFalse("latestParsedProductsLoader");
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
