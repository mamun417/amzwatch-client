<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section
                class="bg-primary text-white row justify-between items-center"
            >
                <div class="col">
                    <div class="text-h6">{{projectInfo.name}}</div>
                    <div class="text-subtitle2">{{projectInfo.domain}}</div>
                </div>

                <div class="col text-center">
                    <q-badge color="positive" class="text-subtitle2">
                        Active
                    </q-badge>
                </div>

                <div class="col text-right">
                    <q-btn icon="edit" @click="showModal = !showModal" flat dense/>
                </div>
            </q-card-section>
        </q-card>

        <q-card
            v-for="(service, index) in projectInfo.services"
            :key="index"
            class="q-mb-xl"
        >
            <q-card-section class="bg-primary row items-center text-white text-subtitle2">
                <div class="col flex items-center">
                    <q-icon :name="service.icon" class="q-mr-sm"/>
                    <div>{{index}}</div>
                </div>

                <div>
                    <q-badge :color="service.active ? 'positive' : 'warning'">
                        {{service.active ? 'Active' : 'Service is inactive'}}
                    </q-badge>
                </div>

                <div class="col text-right">
                    <template v-if="service.active">
                        <q-btn
                            icon="visibility"
                            :to="service.to"
                            dense flat
                        />
                        <q-btn
                            icon="edit"
                            @click="modalOpenHandle(index)"
                            dense flat
                        />
                        <q-btn
                            @click="service.expansionStatus = !service.expansionStatus"
                            :icon="service.expansionStatus ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                            dense flat
                        />
                    </template>

                    <q-btn v-else label="Start service" dense flat/>
                    <!--                    call modals-->
                </div>
            </q-card-section>

            <q-card-section v-if="service.expansionStatus && service.active">
                <q-list v-if="index === 'broken_link_check'">
                    <q-item class="q-mb-sm text-subtitle2 text-primary">
                        <q-item-section class="q-ml-md">Link</q-item-section>
                        <q-item-section class="text-center">Status</q-item-section>
                        <q-item-section class="text-right q-mr-md">Last Checked</q-item-section>
                    </q-item>

                    <q-expansion-item
                        v-for="(link, index) in brokenLinkInfo" :key="index"
                        group="brokenLink"
                        icon=""
                        header-class=""
                        expand-icon-class="hidden"
                        class="shadow-3 q-mb-sm"
                    >
                        <q-item
                            slot="header"
                            class="row full-width justify-between text-subtitle2 items-center"
                        >
                            <q-item-section class="col">img</q-item-section>
                            <q-item-section class="col text-center inline-block">
                                <q-badge
                                    :color="link.status === '404' ? 'warning' : 'positive'"
                                >
                                    {{link.status}} - {{link.status === '404' ? 'unavailable' : 'available'}}
                                </q-badge>
                            </q-item-section>
                            <q-item-section class="col text-right">
                                {{link.lastUpdated}}
                            </q-item-section>
                        </q-item>

                        <!--                        <q-card>-->
                        <!--                            <q-card-section>-->
                        <!--                                <div class="text-caption text-bold">Last updated at: 10 10 10</div>-->
                        <!--                            </q-card-section>-->
                        <!--                        </q-card>-->
                    </q-expansion-item>
                </q-list>
                <!--end broken link check-->

                <!--start guest link check-->
                <q-list v-if="index === 'guest_post_check'">
                    <q-item class="q-mb-sm text-subtitle2 text-primary">
                        <q-item-section class="q-ml-md">Link</q-item-section>
                        <q-item-section class="text-center">Hosted Link</q-item-section>
                        <q-item-section class="text-right q-mr-md">Status</q-item-section>
                    </q-item>

                    <q-expansion-item
                        v-for="(guest, index) in guestPostInfo" :key="index"
                        group="guestPost"
                        icon=""
                        header-class=""
                        expand-icon-class="hidden"
                        class="shadow-3 q-mb-sm"
                    >
                        <q-item
                            slot="header"
                            class="row full-width justify-between text-subtitle2 items-center"
                        >
                            <q-item-section class="col">{{guest.url}}</q-item-section>
                            <q-item-section class="col">
                                {{guest.remoteUrl}}
                            </q-item-section>
                            <q-item-section class="col text-center inline-block">
                                <q-badge
                                    :color="guest.status === '404' ? 'warning' : 'positive'"
                                >
                                    {{guest.status}} - {{guest.status === '404' ? 'unavailable' : 'available'}}
                                </q-badge>
                            </q-item-section>
                        </q-item>

                        <q-card>
                            <q-card-section>
                                <div class="text-caption text-bold">Last updated at: {{guest.lastUpdated}}</div>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                </q-list>
                <!--end guest post check-->

                <q-list v-if="index === 'amazon_product_check'">
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
                                       unelevated>
                                    This product has in: {{ product.inPages }} pages
                                </q-btn>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                </q-list>
                <!--                end amz product check link check-->

                <div v-if="index === 'uptime_monitor_check'">
                    <q-c-chart class="q-mb-lg"/>

                    <div class="q-px-sm flex justify-between items-center text-bold text-subtitle2">
                        <div>Last Monitored: 20 20 20</div>
                        <q-badge label="running" color="positive"/>
                    </div>
                </div>

                <div v-if="index !== 'uptime_monitor_check'" class="q-pa-lg flex flex-center">
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
                    <div class="text-h6">Update project info</div>
                </q-card-section>

                <q-card-section class="">
                    <q-input label="Project Name" class="q-mb-md q-mx-sm" autofocus dense/>
                    <q-input label="Domain URL" class="q-mb-md  q-mx-sm" dense/>
                    <q-checkbox keep-color label="Active" class="text-weight-medium" :value="true" color="orange"/>
                </q-card-section>

                <q-card-section>
                    <q-banner class="bg-grey-3" dense>
                        <q-icon name="error" color="warning" slot="avatar" size="xs"/>

                        <div class="text-caption text-weight-medium">
                            If you update domain url your previous domain related data will be lost
                        </div>
                    </q-banner>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup/>
                    <q-btn flat label="Update" v-close-popup/>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <uptime-check-activate-deactivate-modal :show.sync="showUptimeMonitorActiveModal" :active="true"/>
    </section>
</template>

<script>
    import QCChart from "components/charts/QCChart";
    import UptimeCheckActivateDeactivateModal from "components/modals/UptimeCheckActivateDeactivateModal";

    export default {
        components: {UptimeCheckActivateDeactivateModal, QCChart},
        data() {
            return {
                showModal: false,
                showUptimeMonitorActiveModal: false,

                projectInfo: {
                    name: 'Test project for all',
                    domain: 'https//exonhost.com',
                    services: {
                        amazon_product_check: {
                            icon: 'local_mall',
                            expansionStatus: true,
                            active: true,
                            to: '/projects/'+this.$route.params.project_id+'/amazon-products-check'
                        },
                        guest_post_check: {
                            icon: 'record_voice_over',
                            expansionStatus: true,
                            active: true,
                            to: '/projects/'+this.$route.params.project_id+'/guest-links-check'
                        },
                        broken_link_check: {
                            icon: 'link_off',
                            expansionStatus: true,
                            active: true,
                            to: '/projects/'+this.$route.params.project_id+'/broken-links-check'
                        },
                        uptime_monitor_check: {
                            icon: 'trending_up',
                            expansionStatus: true,
                            active: true,
                            to: '/projects/1/uptime-monitor-check'
                        }
                    }
                },
                amazonProductsInfo: [],
                guestPostInfo: [],
                brokenLinkInfo: [],
            }
        },

        mounted() {
            this.getAmazonProductsInfo();
            this.getGuestPostInfo();
            this.getBrokenLinkInfo();
        },

        methods: {
            modalOpenHandle(serviceType) {
                if (serviceType === 'uptime_monitor_check') {
                    this.showUptimeMonitorActiveModal = true;
                }
            },

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

            getGuestPostInfo() {
                this.$store.dispatch('guest_links/getGuestLinks', {
                    vm: this,
                    project_id: this.$route.params.project_id
                })
                    .then(res => {
                        this.guestPostInfo = res.data;
                    })
                    .catch(err => {
                        //handle error
                    });
            },

            getBrokenLinkInfo() {
                this.$store.dispatch('broken_links/getBrokenLinks', {
                    vm: this,
                    project_id: this.$route.params.project_id
                })
                    .then(res => {
                        this.brokenLinkInfo = res.data;
                    })
                    .catch(err => {
                        //handle error
                    })
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
            }
        }
    }
</script>
