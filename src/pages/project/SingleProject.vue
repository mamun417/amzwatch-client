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
            class="q-mb-xl">
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
                    <!--call modals-->
                </div>
            </q-card-section>

            <q-card-section v-if="service.expansionStatus && service.active">

                <broken-links-list v-if="index === 'broken_link_check'" />

                <guest-links-list v-if="index === 'guest_post_check'"/>

                <amazon-products-list
                    v-if="index === 'amazon_product_check'"
                    :showLinksCountAfterExpand="true"
                />

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
    import AmazonProductsList from "components/amazon-products/AmazonProductsList";
    import BrokenLinksList from "components/broken-links/BrokenLinksList";
    import GuestLinksList from "components/guest-links/GuestLinksList";

    export default {
        components: {GuestLinksList, UptimeCheckActivateDeactivateModal, QCChart, AmazonProductsList, BrokenLinksList},
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
                            to: '/projects/' + this.$route.params.project_id + '/amazon-products-check'
                        },
                        guest_post_check: {
                            icon: 'record_voice_over',
                            expansionStatus: true,
                            active: true,
                            to: '/projects/' + this.$route.params.project_id + '/guest-links-check'
                        },
                        broken_link_check: {
                            icon: 'link_off',
                            expansionStatus: true,
                            active: true,
                            to: '/projects/' + this.$route.params.project_id + '/broken-links-check'
                        },
                        uptime_monitor_check: {
                            icon: 'trending_up',
                            expansionStatus: true,
                            active: true,
                            to: '/projects/1/uptime-monitor-check'
                        }
                    }
                },
            }
        },

        mounted() {},

        methods: {
            modalOpenHandle(serviceType) {
                if (serviceType === 'uptime_monitor_check') {
                    this.showUptimeMonitorActiveModal = true;
                }
            }
        }
    }
</script>
