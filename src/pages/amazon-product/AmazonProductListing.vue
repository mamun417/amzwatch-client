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

            <amazon-products-list
                :showCondition="showLinks"
                :showLinksCountAfterExpand="false"
            />

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

    </section>
</template>

<script>
    import QCChart from "components/charts/QCChart";
    import ProductInPagesModal from "components/modals/ProductInPagesModal";
    import AmazonProductsList from "components/amazon-products/AmazonProductsList";

    export default {
        components: {QCChart, ProductInPagesModal, AmazonProductsList},
        data() {
            return {
                showChart: true,
                showLinks: true,
                showModal: false,

                amazonProductsInfo: [],
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
        }
    }
</script>
