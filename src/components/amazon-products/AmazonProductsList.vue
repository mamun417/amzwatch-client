<template>
    <q-list v-if="showCondition">
        <q-item class="q-mb-sm text-subtitle2 text-primary">
            <q-item-section class="q-ml-md">Image</q-item-section>
            <q-item-section class="text-center">Product Name</q-item-section>
            <q-item-section class="text-right q-mr-md">In Pages</q-item-section>
        </q-item>

        <q-expansion-item
            v-for="(product, index) in amazonProductsInfo" :key="index"
            group="amzProduct"
            icon=""
            header-class=""
            expand-icon-class="hidden"
            class="shadow-3 q-mb-sm"
            @show="product.status !== '404' ? showProductLinksCount(product):''"
        >
            <q-item
                slot="header"
                class="row full-width justify-between text-subtitle2 items-center"
            >
                <q-item-section class="col">img</q-item-section>
                <q-item-section class="col">{{product.productName}}</q-item-section>
                <q-item-section class="col inline-block text-right">
                    <q-badge
                        :color="product.status === '404' ? 'warning' : 'positive'"
                    >
                        {{product.status}} - {{product.status === '404' ? 'unavailable' : 'available'}}
                    </q-badge>
                </q-item-section>
            </q-item>

            <q-card class="bg-blue-grey-1 q-px-md q-py-sm text-bold text-caption">
                <q-card-section class="flex justify-between items-center">
                    <div>Last updated at: {{product.lastUpdated}}</div>
                    <q-btn v-if="product.status === '200'" color="positive" size="sm" no-caps
                           unelevated @click="showProductInPages(product)">
                        This product has in: {{ product.inPages }} pages
                    </q-btn>
                </q-card-section>
            </q-card>
        </q-expansion-item>

        <product-in-pages-modal
            v-if="showProductsInPagesModal.showModal"
            :active.sync="showProductsInPagesModal.showModal"
            :product="showProductsInPagesModal.product"
        />

    </q-list>
</template>

<script>
    import ProductInPagesModal from "components/modals/ProductInPagesModal";

    export default {
        components: {ProductInPagesModal},
        name: "AmazonProductsList",
        props: {
            showCondition: {
                type: Boolean
            },
        },

        data() {
            return {
                amazonProductsInfo: [],
                showProductsInPagesModal: {
                    showModal: false,
                    product: {},
                },
            }
        },

        mounted() {
            this.getAmazonProductsInfo();
        },

        methods: {
            getAmazonProductsInfo() {
                this.$store.dispatch('amazon_products_links/getAmazonProducts', {
                    vm: this,
                    project_id: this.$route.params.project_id
                })
                    .then(res => {
                        this.amazonProductsInfo = res.data;
                    })
                    .catch(err => {
                        //handle error
                    });
            },

            showProductLinksCount(product) {
                this.$store.dispatch('amazon_products_links/getAmazonProductInPages', {
                    vm: this,
                    id: product.id, //amazonproduct id
                    inputs: {affiliate_id: product.affiliateId, only_total: true}
                })
                    .then(res => {
                        this.amazonProductsInfo = this.amazonProductsInfo.map(amazonProduct => {
                            if (product.id === amazonProduct.id) {
                                amazonProduct['inPages'] = res.data.count;
                            }

                            return amazonProduct;
                        });
                    })
                    .catch(err => {
                        //handle error
                    });
            },

            showProductInPages(product){
                this.showProductsInPagesModal.showModal = !this.showProductsInPagesModal.showModal;
                this.showProductsInPagesModal.product = product;
            },
        }
    }
</script>

<style scoped>

</style>
