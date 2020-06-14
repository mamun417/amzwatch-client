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
                    <template
                        v-if="projectInfo.domain_use_for.hasOwnProperty('broken_links_check_service') && projectInfo.domain_use_for.broken_links_check_service.status === 'active'">
                        <q-btn color="primary" icon="insert_chart_outlined" flat dense></q-btn>
                        <q-btn color="primary" icon="visibility"
                               :to="'/projects/'+projectInfo.id+'/broken-links-check'" flat dense></q-btn>
                    </template>

                    <q-btn
                        v-else label="Start" color="primary" size="md"
                        @click="showBrokenLinksActivateModal = !showBrokenLinksActivateModal"
                        flat dense
                    />
                </div>
            </div>

            <div class="row justify-between items-center q-py-sm">
                <div class="col text-subtitle2 flex items-center">
                    <q-icon name="record_voice_over" class="q-mr-xs"/>
                    <div>Guest posts checker</div>
                </div>

                <div class="col flex items-center justify-center">
                    <q-badge
                        v-if="!projectInfo.domain_use_for.hasOwnProperty('guest_posts_check_service') || projectInfo.domain_use_for.guest_posts_check_service.status !== 'active'"
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
                    <template
                        v-if="projectInfo.domain_use_for.hasOwnProperty('guest_posts_check_service') && projectInfo.domain_use_for.guest_posts_check_service.status === 'active'">
                        <q-btn color="primary" icon="insert_chart_outlined" flat dense/>
                        <q-btn
                            color="primary" icon="visibility"
                            :to="'/projects/'+projectInfo.id+'/guest-links-check'"
                            flat dense/>
                    </template>

                    <q-btn
                        v-else label="Start" color="primary" size="md"
                        @click="showGuestPostsActiveModal = !showGuestPostsActiveModal"
                        flat dense
                    />
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
                    <template
                        v-if="projectInfo.domain_use_for.hasOwnProperty('amazon_products_check_service') && projectInfo.domain_use_for.amazon_products_check_service.status === 'active'">
                        <q-btn color="primary" icon="insert_chart_outlined" flat dense></q-btn>
                        <q-btn color="primary" icon="visibility"
                               :to="'/projects/'+projectInfo.id+'/amazon-products-check'" flat
                               dense></q-btn>
                    </template>

                    <q-btn
                        v-else label="Start" color="primary" size="md"
                        @click="showAmazonActivateModal = !showAmazonActivateModal"
                        flat dense
                    />
                </div>
            </div>

            <div class="row justify-between items-center q-py-sm">
                <div class="col text-subtitle2 flex items-center q-mr-xs">
                    <q-icon name="speed" class="q-mr-xs"/>
                    <div>Page speed checker</div>
                </div>

                <div class="col flex items-center justify-center">
                    <q-badge
                        v-if="!projectInfo.domain_use_for.hasOwnProperty('pages_speed_check_service') || projectInfo.domain_use_for.pages_speed_check_service.status !== 'active'"
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
                    <template
                        v-if="projectInfo.domain_use_for.hasOwnProperty('pages_speed_check_service') && projectInfo.domain_use_for.pages_speed_check_service.status === 'active'">
                        <q-btn color="primary" icon="insert_chart_outlined" flat dense></q-btn>
                        <q-btn color="primary" icon="visibility" :to="'/projects/'+projectInfo.id+'/pages-speed-check'"
                               flat
                               dense></q-btn>
                    </template>

                    <q-btn
                        v-else label="Start" color="primary" size="md"
                        @click="showPagesSpeedActiveModal = !showPagesSpeedActiveModal"
                        flat dense
                    />
                </div>
            </div>

            <div class="row justify-between items-center q-py-sm">
                <div class="col text-subtitle2 flex items-center q-mr-xs">
                    <q-icon name="network_check" class="q-mr-xs"/>
                    <div>Uptime monitor checker</div>
                </div>

                <div class="col flex items-center justify-center">
                    <q-badge
                        v-if="!projectInfo.domain_use_for.hasOwnProperty('domain_uptime_check_service') || projectInfo.domain_use_for.domain_uptime_check_service.status !== 'active'"
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
                    <template
                        v-if="projectInfo.domain_use_for.hasOwnProperty('domain_uptime_check_service') && projectInfo.domain_use_for.domain_uptime_check_service.status === 'active'">
                        <q-btn color="primary" icon="insert_chart_outlined" flat dense></q-btn>
                        <q-btn color="primary" icon="visibility"
                               :to="'/projects/'+projectInfo.id+'/domain-uptime-check'" flat
                               dense></q-btn>
                    </template>

                    <q-btn
                        v-else label="Start" color="primary" size="md"
                        @click="showUptimeMonitorActiveModal = !showUptimeMonitorActiveModal"
                        flat dense
                    />
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

        <guest-posts-check-service-activate-deactivate-modal
            :show.sync="showGuestPostsActiveModal"
            :project-info="projectInfo"
            @serviceUpdated="$emit('serviceUpdated')"
        />

        <pages-speed-check-service-activate-deactivate-modal
            :show.sync="showPagesSpeedActiveModal"
            :project-info="projectInfo"
            @serviceUpdated="$emit('serviceUpdated')"
        />

        <domain-uptime-check-activate-deactivate-modal
            :show.sync="showUptimeMonitorActiveModal"
            :project-info="projectInfo"
            @serviceUpdated="$emit('serviceUpdated')"
        />
    </q-card>
</template>

<script>
    import AmazonProductsCheckServiceActivateDeactivateModal
        from "components/modals/AmazonProductsCheckServiceActivateDeactivateModal";
    import BrokenLinksCheckServiceActivateDeactivateModal
        from "components/modals/BrokenLinksCheckServiceActivateDeactivateModal";
    import GuestPostsCheckServiceActivateDeactivateModal
        from "components/modals/GuestPostsCheckServiceActivateDeactivateModal";
    import DomainUptimeCheckActivateDeactivateModal from "components/modals/DomainUptimeCheckActivateDeactivateModal";
    import PagesSpeedCheckServiceActivateDeactivateModal
        from "components/modals/PagesSpeedCheckServiceActivateDeactivateModal";

    export default {
        name      : 'SingleProjectInfoInListing',
        components: {
            PagesSpeedCheckServiceActivateDeactivateModal,
            DomainUptimeCheckActivateDeactivateModal,
            GuestPostsCheckServiceActivateDeactivateModal,
            BrokenLinksCheckServiceActivateDeactivateModal,
            AmazonProductsCheckServiceActivateDeactivateModal,
        },
        props     : {
            projectInfo: {
                type   : Object,
                default: () => ({})
            }
        },
        data() {
            return {
                showBrokenLinksActivateModal: false,
                showAmazonActivateModal     : false,
                showGuestPostsActiveModal   : false,
                showPagesSpeedActiveModal   : false,
                showUptimeMonitorActiveModal: false
            }
        }
    }
</script>
