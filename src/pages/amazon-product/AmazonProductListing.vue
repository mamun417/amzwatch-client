<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section
                class="bg-primary text-white row justify-between items-center"
            >
                <div class="col">
                    <div class="text-h6">Check Amazon Products</div>
                    <div class="text-caption">Project: Test project</div>
                    <div class="text-caption">Domain: exonhost.com</div>
                </div>

                <div class="col text-center">
                    <q-badge color="positive" class="text-subtitle2">
                        Active
                    </q-badge>
                </div>

                <div class="col text-right">
                    <q-btn icon="settings" @click="showModal = !showModal" flat dense/>
                </div>
            </q-card-section>
        </q-card>

        <q-card class="q-mb-xl">
            <q-card-section class="bg-primary row items-center text-white text-subtitle2">
                <div class="col flex items-center">
                    <q-icon name="show_chart" class="q-mr-sm"/>
                    <div>This years chart</div>
                </div>

                <div class="col text-right">
                    <div class="row items-center">
                        <div v-if="showChart" class="col row q-mr-md">
                            <q-select
                                color="white"
                                label="Choose Month"
                                label-color="white"
                                input-class="white"
                                class="col q-mr-md"
                                bg-color="primary"
                                hide-bottom-space
                                dense
                                value=""
                            />
                            <q-select
                                color="white"
                                label="By Year"
                                label-color="white"
                                input-class="white"
                                class="col"
                                style="max-width: 120px"
                                hide-bottom-space
                                dense
                                value=""
                            />
                        </div>

                        <div class="text-right q-py-sm" :class="[showChart ? 'col-auto' : 'col']">
                            <q-btn
                                @click="showChart = !showChart"
                                :icon="showChart ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                                dense flat
                            />
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-card-section v-show="showChart">
                <q-c-chart/>
            </q-card-section>
        </q-card>

        <q-card class="q-mb-xl">
            <q-card-section class="bg-primary row items-center text-white text-subtitle2">
                <div class="col flex items-center">
                    <q-icon name="link_off" class="q-mr-sm"/>
                    <div>Products</div>
                </div>

                <div>
                    <q-badge color="positive">
                        Total: {{ amazonProductsInfo.length }} Products
                    </q-badge>
                </div>

                <div class="col text-right">
                    <q-btn
                        @click="showLinks = !showLinks"
                        :icon="showLinks ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                        dense flat
                    />
                </div>
            </q-card-section>

            <q-card-section v-if="showLinks">
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
                        @show="showProductInPages(product)"
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
                            <q-card-section>
                                <div class="">Last checked this product: {{product.lastUpdated}}
                                </div>
                            </q-card-section>
                            <q-card-section>
                                <div class="flex q-mb-sm">
                                    <div class="q-mr-sm">This product has in:</div>
                                    <q-badge>{{ productInPages.length }} Links</q-badge>
                                </div>
                                <q-list bordered dense>
                                    <q-item class="text-primary text-subtitle2 text-bold">
                                        <q-item-section>Link</q-item-section>
                                        <q-item-section class="text-right">Last checked</q-item-section>
                                    </q-item>
                                    <q-item
                                        v-for="(link, index) in productInPages.slice(0, 1)"
                                        class=""
                                        clickable
                                    >
                                        <q-item-section>{{link.pageUrl}}</q-item-section>
                                        <q-item-section class="text-right">{{ link.lastUpdated }}</q-item-section>
                                    </q-item>
                                </q-list>
                            </q-card-section>
                            <div v-if="productInPages.length > 1" align="right">
                                <q-btn
                                    color="primary"
                                    size="sm"
                                    label="Show more"
                                    no-caps
                                    class="q-mr-md"
                                    @click="showMoreProductInPages(product)"
                                />
                            </div>
                        </q-card>
                    </q-expansion-item>
                </q-list>

                <div class="q-pa-lg flex flex-center">
                    <q-pagination
                        :value="3"
                        :max="5"
                    >
                    </q-pagination>
                </div>
            </q-card-section>
        </q-card>

        <q-dialog v-model="showModal">
            <q-card style="min-width: 400px">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Deactivate this service?</div>
                </q-card-section>

                <q-card-section class="text-center q-pa-xl">
                    <div class="text-subtitle1 text-bold q-mb-lg">This service is currently: <span
                        class="text-positive">Active</span></div>

                    <q-btn color="warning" label="Deactivate"/>
                </q-card-section>
            </q-card>
        </q-dialog>

        <product-in-pages-modal
            v-if="showProductsInPagesModal.showModal"
            :active.sync="showProductsInPagesModal.showModal"
            :product="showProductsInPagesModal.product"
        />

    </section>
</template>

<script>
    import QCChart from "components/charts/QCChart";
    import ProductInPagesModal from "components/modals/ProductInPagesModal";

    export default {
        components: {QCChart, ProductInPagesModal},
        data() {
            return {
                showChart: true,
                showLinks: true,
                showModal: false,

                amazonProductsInfo: [],

                productInPages: [],
                showProductsInPagesModal: {
                    showModal: false,
                    product: {},
                },
            }
        },

        mounted() {
            this.getAmazonProducts();
        },

        methods: {

            getAmazonProducts() {
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

            showProductInPages(product) {

                this.productInPages = [];

                this.$store.dispatch('amazon_products_links/getAmazonProductInPages', {
                    vm: this,
                    id: product.id, //amazonproduct id
                    inputs: {affiliate_id: product.affiliateId}
                })
                    .then(res => {
                        this.productInPages = res.data;
                    })
                    .catch(err => {
                        //handle error
                    });
            },

            showMoreProductInPages(product){
                this.showProductsInPagesModal.showModal = !this.showProductsInPagesModal.showModal;
                this.showProductsInPagesModal.product = product;
            }
        }
    }
</script>
