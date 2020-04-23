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
                    class="q-mb-sm shadow-3"
                    clickable
                >
                    <q-item-section>{{link.pageUrl}}</q-item-section>
                    <q-item-section class="text-right">{{ link.lastUpdated }}</q-item-section>
                </q-item>
            </q-list>

            <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup/>
            </q-card-actions>
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
            }
        },

        mounted() {
            this.getProductInPages();
        },

        methods: {
            getProductInPages() {

                this.productInPages = [];

                this.$store.dispatch('amazon_products_links/getAmazonProductInPages', {
                    vm: this,
                    id: this.product.id, //amazonproduct id
                    inputs: {affiliate_id: this.product.affiliateId}
                })
                    .then(res => {
                        this.productInPages = res.data;
                    })
                    .catch(err => {
                        //handle error
                    });
            }
        }
    }
</script>
