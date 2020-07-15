<template>
    <div class="q-mt-md relative-position">
        <div class="text-h6">Latest Logs</div>
        <q-card-section class="row">
            <q-select
                class="col-grow"
                label="Filter"
                :value="domainUptimeLogsPipeline.f"
                :options="['all', 'ok', 'error']"
                @input="domainUptimeLogsPipelineHandle({f:$event})"
                dense
            />
        </q-card-section>
        <q-list v-if="uptimeLogs.length" class="q-py-md" dense>
            <q-item class="text-primary text-subtitle2 text-bold">
                <q-item-section>Event</q-item-section>
                <q-item-section class="text-center">Reason</q-item-section>
                <q-item-section class="text-right">Last checked</q-item-section>
            </q-item>

            <q-item
                v-for="(log, index) in uptimeLogs"
                class="q-mb-sm shadow-1 text-weight-medium"
                :key="index"
                clickable
            >
                <q-item-section>
                    <q-badge :color="log.status !== 'ok' ? 'red' : 'green'" style="max-width: 70px">
                        <q-icon name="arrow_downward" color="white" class="q-mr-xs text-bold" />
                        <span class="text-bold">{{log.status !== 'ok' ? 'Down': 'Up'}}</span>
                    </q-badge>
                </q-item-section>

                <q-item-section class="text-center">
                    <span
                        :class="[log.status !== 'ok' ? 'text-red' : 'text-green']"
                    >{{log.status !== 'ok' ? 'Connection Timeout' : 'OK (200)'}}</span>
                </q-item-section>

                <q-item-section class="text-right">{{$timestampToDate(log.logged_at)}}</q-item-section>
            </q-item>
        </q-list>

        <div v-else class="text-center q-py-md text-weight-bold">No logs found</div>

        <div v-if="uptimeLogsPaginationMeta.last_page > 1" class="q-py-sm flex flex-center">
            <pagination
                :current_page="uptimeLogsPaginationMeta.current_page"
                :last_page="uptimeLogsPaginationMeta.last_page"
                @handlePagination="uptimeLogsPaginationHandle"
            />
        </div>

        <q-inner-loading color="primary" :showing="!!singleLoader.domainUptimeLogsLoader" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "components/pagination/Pagination";

export default {
    components: {
        Pagination
    },
    props: {
        serviceTypes: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            uptimeLogs: []
        };
    },

    mounted() {
        this.getDomainUptimeLogs();

        this.interval = setInterval(() => {
            this.getDomainUptimeLogs();
        }, this.$intervalTime);
    },

    beforeDestroy() {
        this.interval && clearInterval(this.interval);
    },

    computed: {
        ...mapGetters({
            uptimeLogsPaginationMeta: "domain_uptime/paginationMeta",
            singleLoader: "ui/singleLoaderStatus",
            domainUptimeLogsPipeline: "domain_uptime/pipeline"
        })
    },

    methods: {
        getDomainUptimeLogs() {
            this.$singleLoaderTrue("domainUptimeLogsLoader");

            this.$store
                .dispatch("domain_uptime/getDomainUptimeLogs", {
                    vm: this,
                    project_id: this.$route.params.project_id,
                    log_type: this.serviceTypes[0]
                })
                .then(res => {
                    this.uptimeLogs = res.data.domainUptimeLogs.data;
                    this.$singleLoaderFalse("domainUptimeLogsLoader");
                })
                .catch(err => {
                    //handle error
                    this.$singleLoaderFalse("domainUptimeLogsLoader");
                });
        },

        uptimeLogsPaginationHandle(page) {
            this.$store
                .dispatch("domain_uptime/updateUptimeLogsCurrentPage", page)
                .then(() => {
                    this.getDomainUptimeLogs();
                });
        },

        domainUptimeLogsPipelineHandle(pipeline) {
            this.$store
                .dispatch("domain_uptime/updateDomainUptimeLogsPipeline", {
                    vm: this,
                    pipeline: pipeline
                })
                .then(() => {
                    this.getDomainUptimeLogs();
                });
        }
    }
};
</script>
