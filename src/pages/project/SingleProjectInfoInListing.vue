<template>
    <q-card class="q-mb-lg">
        <q-card-section class="bg-primary text-white row justify-between items-center">
            <div class="col">
                <div class="row items-center q-mb-xs">
                    <div class="q-mr-sm text-h6">{{projectInfo.project_name}}</div>
                    <div class="col-auto">
                        <q-badge :color="!!projectInfo.deactivated_at ? 'warning' : 'positive'">
                            {{ !!projectInfo.deactivated_at ? 'Deactivated' : 'Active' }}
                        </q-badge>
                    </div>
                </div>
            </div>

            <div class="col justify-center">
                <div class="text-subtitle2 text-center">Domain: {{projectInfo.domain.url}}</div>
                <div
                    class="text-center text-xs"
                >Created at: {{ $timestampToDate(projectInfo.created_at) }}
                </div>
            </div>

            <div class="col flex justify-end">
                <q-btn flat icon="visibility" :to="'/projects/'+projectInfo.id" dense></q-btn>
                <q-btn flat icon="edit" @click="$emit('projectEdit', projectInfo)" dense></q-btn>
            </div>
        </q-card-section>

        <q-card-section>
            <div class="row justify-between items-center q-py-sm">
                <div class="col text-subtitle2 flex items-center">
                    <q-icon name="link_off" class="q-mr-xs"/>
                    <div>Broken link checker</div>
                </div>

                <div class="col flex items-center justify-center">
                    <q-badge
                        v-if="!projectInfo.domain_use_for.hasOwnProperty('broken_links_check_service') || projectInfo.domain_use_for.broken_links_check_service.status !== 'active'"
                        color="warning"
                    >
                        <q-icon name="error" class="q-mr-xs"/>
                        You are not using this service
                    </q-badge>

                    <template v-else>
                        <q-badge color="positive">
                            <q-icon name="check" class="q-mr-xs"/>
                            You are using this service
                        </q-badge>
                    </template>
                </div>

                <div class="col text-right items-center">
                    <template v-if="projectInfo.domain_use_for.hasOwnProperty('broken_links_check_service') && projectInfo.domain_use_for.broken_links_check_service.status === 'active'">
                        <q-btn color="primary" icon="insert_chart_outlined" flat dense></q-btn>
                        <q-btn color="primary" icon="visibility"
                               :to="'/projects/'+projectInfo.id+'/broken-links-check'" flat dense></q-btn>
                    </template>

                    <q-btn v-else label="Start" color="primary" size="md"
                           @click="showBrokenLinksActivateModal = !showBrokenLinksActivateModal" flat dense/>
                </div>
            </div>

            <div class="row justify-between items-center q-py-sm">
                <div class="col text-subtitle2 flex items-center">
                    <q-icon name="record_voice_over" class="q-mr-xs"/>
                    <div>Guest link checker</div>
                </div>

                <div class="col flex items-center justify-center">
                    <q-badge v-if="!projectInfo.services.includes('guest_link_check')" color="warning">
                        <q-icon name="error" class="q-mr-xs"/>
                        You are not using this service
                    </q-badge>

                    <template v-else>
                        <q-badge color="positive">
                            <q-icon name="check" class="q-mr-xs"/>
                            no issues
                        </q-badge>
                    </template>
                </div>

                <div class="col text-right items-center">
                    <template v-if="projectInfo.services.includes('guest_link_check')">
                        <q-btn color="primary" icon="insert_chart_outlined" flat dense></q-btn>
                        <q-btn color="primary" icon="visibility" :to="'/projects/'+projectInfo._id+'/guest-links-check'"
                               flat dense></q-btn>
                    </template>

                    <q-btn v-else label="Start" color="primary" size="md"
                           @click="showGuestLinkActiveModal = !showGuestLinkActiveModal" flat dense/>
                </div>
            </div>

            <div class="row justify-between items-center q-py-sm">
                <div class="col text-subtitle2 flex items-center q-mr-xs">
                    <q-icon name="local_mall" class="q-mr-xs"/>
                    <div>Amazon product link checker</div>
                </div>

                <div class="col flex items-center justify-center">
                    <q-badge
                        v-if="!projectInfo.domain_use_for.hasOwnProperty('amazon_products_check_service') || projectInfo.domain_use_for.amazon_products_check_service.status !== 'active'"
                        color="warning"
                    >
                        <q-icon name="error" class="q-mr-xs"/>
                        You are not using this service
                    </q-badge>

                    <template v-else>
                        <q-badge color="positive">
                            <q-icon name="check" class="q-mr-xs"/>
                            You are using this service
                        </q-badge>
                    </template>
                </div>

                <div class="col text-right items-center">
                    <template v-if="projectInfo.domain_use_for.hasOwnProperty('amazon_products_check_service') && projectInfo.domain_use_for.amazon_products_check_service.status === 'active'">
                        <q-btn color="primary" icon="insert_chart_outlined" flat dense></q-btn>
                        <q-btn color="primary" icon="visibility"
                               :to="'/projects/'+projectInfo.id+'/amazon-products-check'" flat
                               dense></q-btn>
                    </template>

                    <q-btn v-else label="Start" color="primary" size="md"
                           @click="showAmazonActivateModal = !showAmazonActivateModal" flat dense/>
                </div>
            </div>

            <div class="row justify-between items-center q-py-sm">
                <div class="col text-subtitle2 flex items-center q-mr-xs">
                    <q-icon name="trending_up" class="q-mr-xs"/>
                    <div>Uptime monitor checker</div>
                </div>

                <div class="col flex items-center justify-center">
                    <q-badge v-if="!projectInfo.services.includes('amazon_product_link_check')" color="warning">
                        <q-icon name="error" class="q-mr-xs"/>
                        You are not using this service
                    </q-badge>

                    <template v-else>
                        <q-badge color="warning">
                            <q-icon name="error" class="q-mr-xs"/>
                            Server is down
                        </q-badge>
                    </template>
                </div>

                <div class="col text-right items-center">
                    <template v-if="projectInfo.services.includes('uptime_monitor_check')">
                        <q-btn color="primary" icon="insert_chart_outlined" flat dense></q-btn>
                        <q-btn color="primary" icon="visibility" to="/projects/1/uptime-monitor-check" flat
                               dense></q-btn>
                    </template>

                    <q-btn v-else label="Start" color="primary" size="md"
                           @click="showUptimeMonitorActiveModal = !showUptimeMonitorActiveModal" flat dense/>
                </div>
            </div>
        </q-card-section>

        <broken-links-check-service-activate-deactivate-modal
            :show.sync="showBrokenLinksActivateModal"
            :project-info="projectInfo"
            @serviceUpdated="$emit('serviceUpdated')"
        />

        <amazon-products-check-service-activate-deactivate-modal
            :show.sync="showAmazonActivateModal"
            :project-info="projectInfo"
            @serviceUpdated="$emit('serviceUpdated')"
        />

        <q-dialog v-model="showGuestLinkActiveModal">
            <q-card style="min-width: 400px">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Activate Guest Link Checker Service</div>
                </q-card-section>

                <q-card-section class="text-center q-py-xl">
                    <div class="text-subtitle1 text-bold q-mb-lg">This service is currently: <span
                        class="text-warning">Deactivated</span></div>

                    <q-list>
                        <q-item class="text-caption text-bold">
                            <q-item-section>Guest URL</q-item-section>
                            <q-item-section>Hosted URL</q-item-section>
                        </q-item>

                        <q-item v-for="(gl, key) in guestLinksForActive" :key="key" clickable>
                            <q-input v-model="gl.guestUrl" class="q-mr-md" standout="bg-primary text-white" dense/>
                            <q-input v-model="gl.hostedUrl" dense standout="bg-primary text-white"/>

                            <q-btn v-if="guestLinksForActive.length > 1" @click="$delete(guestLinksForActive, key)"
                                   icon="clear" color="warning" class="q-ml-md" dense/>
                        </q-item>
                    </q-list>

                    <q-btn @click="pushToGuestLinksForActive" color="primary" label="Add another url" no-caps size="sm"
                           class="q-mt-md"
                           :disable="!guestLinksForActive[guestLinksForActive.length - 1].guestUrl || !guestLinksForActive[guestLinksForActive.length - 1].hostedUrl"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Activate" class="q-mr-md" v-close-popup/>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <UptimeCheckActivateDeactivateModal
            :show.sync="showUptimeMonitorActiveModal"
            :active="projectInfo.services.includes('uptime_monitor_check')"
        />
    </q-card>
</template>

<script>
    import UptimeCheckActivateDeactivateModal from "components/modals/UptimeCheckActivateDeactivateModal";
    import AmazonProductsCheckServiceActivateDeactivateModal
        from "components/modals/AmazonProductsCheckServiceActivateDeactivateModal";
    import BrokenLinksCheckServiceActivateDeactivateModal
        from "components/modals/BrokenLinksCheckServiceActivateDeactivateModal";

    export default {
        name      : 'SingleProjectInfoInListing',
        components: {
            BrokenLinksCheckServiceActivateDeactivateModal,
            AmazonProductsCheckServiceActivateDeactivateModal,
            UptimeCheckActivateDeactivateModal},
        props     : {
            projectInfo: {
                type   : Object,
                default: () => ({})
            }
        },
        data() {
            return {
                showBrokenLinksActivateModal  : false,
                showAmazonActivateModal       : false,
                showGuestLinkActiveModal    : false,
                showUptimeMonitorActiveModal: false,

                amazonRefId: '',

                guestLinksForActive: [
                    {
                        guestUrl : '',
                        hostedUrl: ''
                    }
                ]
            }
        },
        methods   : {
            pushToGuestLinksForActive() {
                this.guestLinksForActive.push({
                    guestUrl : '',
                    hostedUrl: ''
                })
            }
        }
    }
</script>
