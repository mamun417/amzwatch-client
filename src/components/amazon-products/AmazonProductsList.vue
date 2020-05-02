<template>
    <q-list>
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
            @show="showProductLinksInfo(product)"
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

            <q-card v-if="showLinksCountAfterExpand" class="bg-blue-grey-1 q-px-md q-py-sm text-bold text-caption">
                <q-card-section class="flex justify-between items-center">
                    <div>Last updated at: {{product.lastUpdated}}</div>
                    <q-btn color="positive" size="sm" no-caps
                           unelevated @click="showProductInPagesModal(product)">
                        This product has in: {{ product.inPages }} pages
                    </q-btn>
                </q-card-section>
            </q-card>

            <q-card v-else class="bg-blue-grey-1 q-px-md q-py-sm text-bold text-caption">
                <q-card-section>
                    <div class="">Last checked this product: {{product.lastUpdated}}
                    </div>
                </q-card-section>
                <q-card-section>
                    <div class="flex q-mb-sm">
                        <div class="q-mr-sm">This product has in:</div>
                        <q-badge>{{ product.productInPagesLinks ? product.productInPagesLinks.length : '' }} Links</q-badge>
                    </div>
                    <q-list bordered dense>
                        <q-item class="text-primary text-subtitle2 text-bold">
                            <q-item-section>Link</q-item-section>
                            <q-item-section class="text-right">Last checked</q-item-section>
                        </q-item>
                        <q-item
                            v-for="(link, index) in product.productInPagesLinks ? product.productInPagesLinks.slice(0, 1) : []"
                            class=""
                            clickable
                        >
                            <q-item-section>{{link.pageUrl}}</q-item-section>
                            <q-item-section class="text-right">{{ link.lastUpdated }}</q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
                <div v-if="product.productInPagesLinks ? product.productInPagesLinks.length > 1 : ''" align="right">
                    <q-btn
                        color="primary"
                        size="sm"
                        label="Show more"
                        no-caps
                        class="q-mr-md"
                        @click="showProductInPagesModal(product)"
                    />
                </div>
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
            showLinksCountAfterExpand: {
                type: Boolean
            }
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

            showProductLinksInfo(product) {
                this.$store.dispatch('amazon_products_links/getAmazonProductInPages', {
                    vm: this,
                    id: product.id, //amazonproduct id
                    inputs: {affiliate_id: product.affiliateId, only_total: this.showLinksCountAfterExpand}
                })
                    .then(res => {
                        this.amazonProductsInfo = this.amazonProductsInfo.map(amazonProduct => {
                            if (product.id === amazonProduct.id) {
                                if (this.showLinksCountAfterExpand){
                                    amazonProduct['inPages'] = res.data.count;
                                }else {
                                    amazonProduct['productInPagesLinks'] = res.data;
                                }
                            }

                            return amazonProduct;
                        });
                    })
                    .catch(err => {
                        //handle error
                    });
            },

            showProductInPagesModal(product){
                this.showProductsInPagesModal.showModal = !this.showProductsInPagesModal.showModal;
                this.showProductsInPagesModal.product = product;
            },
        }
    }
</script>

<style scoped>

</style>
