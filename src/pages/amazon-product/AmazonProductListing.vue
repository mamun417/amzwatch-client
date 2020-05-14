<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section
                class="bg-primary text-white row justify-between items-center"
            >
                <div class="col">
                    <div class="text-h6">Check Amazon Products</div>
                    <div class="text-caption">Project: {{projectInfo.project_name}}</div>
                    <div class="text-caption">Domain: {{projectInfo.domain.url}}</div>
                </div>

                <div class="col text-center">
                    <q-badge :color="serviceIsActive ? 'positive' : 'warning'" class="text-subtitle2">
                        {{serviceIsActive ? 'Active' : 'Inactive'}}
                    </q-badge>
                </div>

                <div class="col text-right">
                    <q-btn
                        icon="settings"
                        @click="showServiceActivateDeactivateModal = !showServiceActivateDeactivateModal"
                        flat dense
                    />
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
                                color="white" label="Choose Month" label-color="white"
                                input-class="white" class="col q-mr-md" bg-color="primary"
                                hide-bottom-space dense
                                value=""
                            />
                            <q-select
                                color="white" label="By Year" label-color="white"
                                input-class="white" class="col" style="max-width: 120px"
                                hide-bottom-space dense
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
                        Total: {{ amazonProductsCount }} Products
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
                v-if="showLinks"
                ref="amazon_products_list_viewer"
                :showLinksCountAfterExpand="false"
                :getAmazonProductsCount="true"
                @getAmazonProductsCount="amazonProductsCount = $event"
            />

        </q-card>

        <amazon-products-check-service-activate-deactivate-modal
            :show.sync="showServiceActivateDeactivateModal"
            :project-info="projectInfo"
            @serviceUpdated="handleAmazonProductsCheckServiceUpdate"
        />

    </section>
</template>

<script>
    import QCChart from "components/charts/QCChart";
    import ProductInPagesModal from "components/modals/ProductInPagesModal";
    import AmazonProductsList from "components/amazon-products/AmazonProductsList";
    import AmazonProductsCheckServiceActivateDeactivateModal
        from "components/modals/AmazonProductsCheckServiceActivateDeactivateModal";

    export default {
        components: {
            AmazonProductsCheckServiceActivateDeactivateModal,
            QCChart,
            ProductInPagesModal,
            AmazonProductsList
        },
        data() {
            return {
                showChart                         : false,
                showLinks                         : true,
                showServiceActivateDeactivateModal: false,
                amazonProductsCount               : '',
                projectInfo                       : {
                    domain        : {},
                    domain_use_for: {}
                }
            }
        },

        mounted() {
            this.checkProject();
        },

        computed: {
            serviceIsActive() {
                if (!this.projectInfo.domain_use_for.hasOwnProperty('amazon_products_check_service')) return false

                return this.projectInfo.domain_use_for.amazon_products_check_service.status === 'active'
            }
        },

        methods: {
            checkProject() {
                // later get it from store n check first for id check then do these cz we need projectInfo
                // for now keep api call
                this.$store.dispatch('projects/getProject', {
                    vm: this,
                    id: this.$route.params.project_id
                })
                    .then(res => {
                        this.projectInfo = res.data.project
                    })
                    .catch(err => {
                        if (err.response.status === 404) {
                            this.$router.push('/projects')
                        }
                    })
            },

            handleAmazonProductsCheckServiceUpdate(project) {
                let updatedService = project.domain_use_for.amazon_products_check_service;

                if (!this.projectInfo.domain_use_for.hasOwnProperty('amazon_products_check_service')) {
                    this.$set(this.projectInfo.domain_use_for, 'amazon_products_check_service', {})
                }

                this.$set(this.projectInfo.domain_use_for.amazon_products_check_service, 'affiliate_ids', updatedService.affiliate_ids)
                this.$set(this.projectInfo.domain_use_for.amazon_products_check_service, 'status', updatedService.status)

                this.$refs.amazon_products_list_viewer.getAmazonProductsInfo();
            }
        }
    }
</script>
