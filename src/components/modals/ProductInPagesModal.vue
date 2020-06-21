<template>
    <q-dialog :value="active" @hide="$emit('update:active', false)">
        <q-card style="min-width: 400px">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">Product in pages</div>
            </q-card-section>

            <q-list class="shadow-3 q-pa-md" bordered dense>
                <q-item class="text-primary text-subtitle2 text-bold">
                    <q-item-section>Link</q-item-section>
                    <q-item-section class="text-right">Last checked</q-item-section>
                </q-item>

                <q-item
                    v-for="(link, index) in productInPages"
                    class="q-mb-sm shadow-1 text-weight-medium"
                    :key="index"
                    clickable
                >
                    <q-item-section class="text-sm">{{link.page.url}}</q-item-section>
                    <q-item-section
                        class="text-right text-sm"
                    >{{ $timestampToDate(product.product.updated_at.last_scraped_at, "Do MM YYYY, h:mm:ss a") }}</q-item-section>
                </q-item>
            </q-list>
        </q-card>
    </q-dialog>
</template>

<script>
export default {
    props: {
        active: {
            type: Boolean,
            default: false
        },
        product: {
            type: Object,
            default: () => ({})
        }
    },

    data() {
        return {
            productInPages: []
        };
    },

    mounted() {
        this.getProductInPages();
    },

    methods: {
        getProductInPages() {
            this.productInPages = [];

            this.$store
                .dispatch("amazon_products_links/getAmazonProductInPages", {
                    vm: this,
                    product_id: this.product.product_id, //amazonproduct id
                    affiliate_id: this.product.affiliate_id
                })
                .then(res => {
                    this.productInPages = res.data.productsInPages.data;
                })
                .catch(err => {
                    //handle error
                });
        }
    }
};
</script>
