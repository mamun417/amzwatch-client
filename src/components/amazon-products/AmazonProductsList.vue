<template>
    <div>
        <q-list>
            <q-item class="q-mb-sm text-subtitle2 text-primary">
                <q-item-section class="q-ml-md">Image</q-item-section>
                <q-item-section class="text-center">Product Name</q-item-section>
                <q-item-section class="text-right q-mr-md">In Pages</q-item-section>
            </q-item>

            <q-expansion-item
                v-for="(product, index) in amazonProductsInfo"
                :key="index"
                group="amzProduct"
                icon
                header-class
                expand-icon-class="hidden"
                class="shadow-3 q-mb-sm"
                @show="showProductLinksInfo(product)"
            >
                <q-item
                    slot="header"
                    class="row full-width justify-between text-subtitle2 items-center"
                >
                    <q-item-section class="col">
                        <q-avatar size="64px" square>
                            <img :src="product.product.meta.metas.product_image" />
                        </q-avatar>
                    </q-item-section>
                    <q-item-section class="col">{{product.product.meta.metas.product_name}}</q-item-section>
                    <q-item-section class="col inline-block text-right">
                        <q-badge
                            :color="calculateProductStatus(product) === 'available' ? 'positive' : 'warning'"
                        >{{calculateProductStatus(product) === 'available' ? 'available' : 'unavailable'}}</q-badge>
                    </q-item-section>
                </q-item>

                <q-card
                    v-if="showLinksCountAfterExpand"
                    class="bg-blue-grey-1 q-px-md q-py-sm text-bold text-caption"
                >
                    <q-card-section class="flex justify-between items-center">
                        <div>Last updated at: {{$timestampToDate(product.product.updated_at.last_scraped_at)}}</div>
                        <q-btn
                            color="positive"
                            size="sm"
                            no-caps
                            unelevated
                            @click="showProductInPagesModal(product)"
                        >This product has in: {{ product.productsInPagesCount }} pages</q-btn>
                    </q-card-section>
                </q-card>

                <q-card v-else class="bg-blue-grey-1 q-px-md q-py-sm text-bold text-caption">
                    <q-card-section>Last checked this product: {{$timestampToDate(product.product.updated_at.last_scraped_at)}}</q-card-section>
                    <q-card-section>
                        <div class="flex q-mb-sm">
                            <div class="q-mr-sm">This product has in:</div>
                            <q-badge>{{ product.productsInPagesCount }} Links</q-badge>
                        </div>
                        <q-list dense>
                            <q-item class="text-primary text-subtitle2 text-bold shadow-1">
                                <q-item-section>Link</q-item-section>
                                <q-item-section class="text-right">Last checked</q-item-section>
                            </q-item>
                            <q-item
                                v-for="(link, index) in product.productInPagesLinks"
                                class="shadow-1"
                                :key="index"
                                clickable
                            >
                                <q-item-section>{{link.page.url}}</q-item-section>
                                <q-item-section
                                    class="text-right col-auto"
                                >{{ $timestampToDate(product.product.updated_at.last_scraped_at) }}</q-item-section>
                            </q-item>
                        </q-list>
                    </q-card-section>
                    <div v-if="product.productsInPagesCount > 1" class="text-center">
                        <q-btn
                            color="primary"
                            size="sm"
                            label="Show more"
                            class="q-mr-md"
                            flat
                            no-caps
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

        <div v-if="amazonProductsPaginationMeta.last_page > 1" class="q-pa-lg flex flex-center">
            <pagination
                :current_page="amazonProductsPaginationMeta.current_page"
                :last_page="amazonProductsPaginationMeta.last_page"
                @handlePagination="amazonProductsPaginationHandle"
            />
        </div>

        <q-inner-loading color="primary" :showing="!!singleLoader.amazonProductsLoader" />
    </div>
</template>

<script>
import ProductInPagesModal from "components/modals/ProductInPagesModal";
import { mapGetters } from "vuex";
import Pagination from "components/pagination/Pagination";

export default {
    components: { ProductInPagesModal, Pagination },
    name: "AmazonProductsList",
    props: {
        showLinksCountAfterExpand: {
            type: Boolean
        },
        getAmazonProductsCount: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            amazonProductsInfo: [],
            showProductsInPagesModal: {
                showModal: false,
                product: {}
            }
        };
    },

    mounted() {
        this.getAmazonProductsInfo();

        this.interval = setInterval(() => {
            this.getAmazonProductsInfo();
        }, this.$interValTime);
    },

    beforeDestroy() {
        this.interval && clearInterval(this.interval);
    },

    computed: {
        ...mapGetters({
            amazonProductsPaginationMeta:
                "amazon_products_links/paginationMeta",
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    methods: {
        calculateProductStatus(productObj) {
            if (productObj.hasOwnProperty("product")) {
                if (productObj.product.hasOwnProperty("meta")) {
                    if (
                        productObj.product.meta.hasOwnProperty("page_status") &&
                        productObj.product.meta.page_status
                    ) {
                        let status = productObj.product.meta.page_status.toString();

                        return ["2", "3"].includes(status[0])
                            ? "available"
                            : "unavailable";
                    }
                }
            }
            return "pending";
        },
        getAmazonProductsInfo() {
            this.$singleLoaderTrue("amazonProductsLoader");

            this.$store
                .dispatch("amazon_products_links/getAmazonProducts", {
                    vm: this,
                    project_id: this.$route.params.project_id
                })
                .then(res => {
                    this.amazonProductsInfo = res.data.amazonProducts.data;

                    this.$emit(
                        "getAmazonProductsCount",
                        res.data.amazonProducts.pagination_meta.total
                    );

                    this.$singleLoaderFalse("amazonProductsLoader");
                })
                .catch(err => {
                    //handle error
                });
        },

        showProductLinksInfo(product) {
            this.$store
                .dispatch("amazon_products_links/getAmazonProductInPages", {
                    vm: this,
                    product_id: product.product_id, //amazonproduct id
                    affiliate_id: product.affiliate_id
                })
                .then(res => {
                    this.amazonProductsInfo = this.amazonProductsInfo.map(
                        amazonProduct => {
                            if (product.id === amazonProduct.id) {
                                amazonProduct["productsInPagesCount"] =
                                    res.data.productsInPages.pagination_meta.total;

                                if (!this.showLinksCountAfterExpand) {
                                    amazonProduct["productInPagesLinks"] =
                                        res.data.productsInPages.data;
                                }
                            }

                            return amazonProduct;
                        }
                    );
                })
                .catch(err => {
                    //handle error
                });
        },

        showProductInPagesModal(product) {
            this.showProductsInPagesModal.showModal = !this
                .showProductsInPagesModal.showModal;
            this.showProductsInPagesModal.product = product;
        },

        amazonProductsPaginationHandle(page) {
            this.$store
                .dispatch(
                    "amazon_products_links/updateAmazonProductsCurrentPage",
                    page
                )
                .then(() => {
                    this.getAmazonProductsInfo();
                });
        }
    }
};
</script>

<style scoped>
</style>
