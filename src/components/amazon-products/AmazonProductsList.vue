<template>
    <div>
        <q-list>
            <q-item v-if="$q.screen.gt.sm" class="q-mb-sm text-subtitle2 text-primary">
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
                ref="productItem"
            >
                <div
                    slot="header"
                    class="row full-width justify-between text-subtitle2 items-center"
                    :class="$q.screen.lt.sm ? 'text-center' : ''"
                >
                    <div class="col-12 col-sm">
                        <q-img
                            v-if="calculateProductStatus(product) !== 'pending' &&
                            (calculateProductStatus(product) !== 'other' && product.product.meta.hasOwnProperty('metas'))"
                            style="width: 82px; height: 82px"
                            :src="product.product.meta.metas.product_image"
                            contain
                        />
                        <q-img
                            v-else
                            style="width: 82px; height: 82px"
                            src="/statics/broken-image.jpg"
                            contain
                        />
                    </div>
                    <div
                        class="col-12 col-sm"
                        v-if="calculateProductStatus(product) !== 'pending' &&
                        (calculateProductStatus(product) !== 'other' && product.product.meta.hasOwnProperty('metas'))"
                    >
                        {{product.product.meta.metas.product_name}}
                    </div>
                    <div
                        class="col-12 col-sm inline-block"
                        :class="$q.screen.gt.sm ? 'text-right':''"
                    >
                        <q-badge
                            :color="calculateProductStatus(product) === 'available' ? 'positive' : 'warning'"
                        >{{calculateProductStatus(product)}}</q-badge>
                    </div>
                </div>

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
                    <q-card-section
                        class="q-pb-xs"
                    >Last checked this product: {{$timestampToDate(product.product.updated_at.last_scraped_at)}}</q-card-section>
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
                                <q-item-section style="overflow-wrap: anywhere">{{link.page.url}}</q-item-section>
                                <q-item-section
                                    side
                                    no-wrap
                                >{{ $timestampToDate(product.product.updated_at.last_scraped_at) }}</q-item-section>
                            </q-item>
                        </q-list>
                    </q-card-section>
                    <div v-if="product.productsInPagesCount > 5" class="text-center">
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

                    <q-inner-loading
                        color="primary"
                        :showing="!!singleLoader.amazonProductInPagesLoader"
                    />
                </q-card>
            </q-expansion-item>

            <product-in-pages-modal
                v-if="showProductsInPagesModal.showModal"
                :active.sync="showProductsInPagesModal.showModal"
                :product="showProductsInPagesModal.product"
            />
        </q-list>

        <q-card-section v-if="!amazonProductsInfo.length" class="text-center q-py-xl">
            <div class="q-mb-lg text-subtitle2">No amazon products link found</div>
        </q-card-section>

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
            },
            expandedItemId: ''
        };
    },

    mounted() {
        this.getAmazonProductsInfo();

        this.interval = setInterval(() => {
            this.getAmazonProductsInfo();
        }, this.$intervalTime);
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

                        if (["4"].includes(status[0])) {
                            return "404"
                        } else if (["2", "3"].includes(status[0])) {
                            return parseInt(productObj.product.meta.metas.in_stock)
                                ? "available" : "unavailable"
                        } else {
                            return "other"
                        }
                    }
                }else {
                    if (!productObj.product.updated_at.hasOwnProperty("last_parsed_at")){
                        return "pending";
                    }
                }
            }
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

                    this.setExpandedItemData();

                    this.$singleLoaderFalse("amazonProductsLoader");
                })
                .catch(err => {
                    //handle error
                });
        },

        showProductLinksInfo(product) {
            this.$singleLoaderTrue("amazonProductInPagesLoader");

            this.$store
                .dispatch("amazon_products_links/getAmazonProductInPages", {
                    vm: this,
                    product_id: product.product_id, //amazonproduct id
                    project_id: this.$route.params.project_id
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

                                this.expandedItemId = product.id
                            }

                            return amazonProduct;
                        }
                    );

                    this.$singleLoaderFalse("amazonProductInPagesLoader");
                })
                .catch(err => {
                    //handle error
                    this.$singleLoaderFalse("amazonProductInPagesLoader");
                });
        },

        showProductInPagesModal(product) {
            this.showProductsInPagesModal.showModal = !this
                .showProductsInPagesModal.showModal;
            this.showProductsInPagesModal.product = product;
        },

        amazonProductsPaginationHandle(page) {
            this.$refs.productItem.forEach(item => {
                item.hide()
            })

            this.$store
                .dispatch(
                    "amazon_products_links/updateAmazonProductsCurrentPage",
                    page
                )
                .then(() => {
                    this.getAmazonProductsInfo();
                });
        },

        setExpandedItemData(){
            if (this.expandedItemId){
                this.amazonProductsInfo.map( amazonProduct => {
                    if (this.expandedItemId === amazonProduct.id){
                        this.showProductLinksInfo(amazonProduct)
                    }
                })
            }
        }
    }
};
</script>

<style scoped>
</style>
