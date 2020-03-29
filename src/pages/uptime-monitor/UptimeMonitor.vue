<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section
                class="bg-primary text-white row justify-between items-center"
            >
                <div class="col">
                    <div class="text-h6">Check Uptime Monitor</div>
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
                    <q-icon name="trending_up" class="q-mr-sm"/>
                    <div>Uptime Monitor</div>
                </div>

                <div>
                    <q-badge color="positive">
                        Site is Running
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
        </q-card>

        <uptime-check-activate-deactivate-modal :show.sync="showModal" :active="true"/>
    </section>
</template>

<script>
import QCChart from "components/charts/QCChart";
import UptimeCheckActivateDeactivateModal from "components/modals/UptimeCheckActivateDeactivateModal";

export default {
    components: {UptimeCheckActivateDeactivateModal, QCChart},
    data() {
        return {
            showChart: true,
            showLinks: true,
            showModal: false,

            brokenLinkInfo: [
                {
                    link     : 'exon/123',
                    status   : 200,
                    lastCheck: '30 10 20'
                },
                {
                    link     : 'exon/not-found',
                    status   : 404,
                    lastCheck: '15 10 20'
                }
            ],
        }
    }
}
</script>
