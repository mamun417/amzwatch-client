<template>
    <section class="relative-position">
        <q-card class="q-mb-lg">
            <q-card-section class="bg-primary text-white row justify-between items-center">
                <div class="col">
                    <div class="text-h6">Check Domain Uptime</div>
                    <div class="text-caption">Project: {{projectInfo.project_name}}</div>
                    <div class="text-caption">Domain: {{projectInfo.domain.url}}</div>
                </div>

                <div class="col text-center">
                    <q-badge
                        :color="serviceIsActive ? 'positive' : 'warning'"
                        class="text-subtitle2"
                    >{{serviceIsActive ? 'Active' : 'Inactive'}}</q-badge>
                </div>

                <div class="col text-right">
                    <q-btn
                        icon="settings"
                        @click="showServiceActivateDeactivateModal = !showServiceActivateDeactivateModal"
                        flat
                        dense
                    />
                </div>
            </q-card-section>
        </q-card>

        <q-card class="q-mb-xl">
            <q-card-section class="bg-primary row items-center text-white text-subtitle2">
                <div class="col flex items-center">
                    <q-icon name="trending_up" class="q-mr-sm" />
                    <div>Uptime Monitor</div>
                </div>

                <div>
                    <!--                    <q-badge color="positive">-->
                    <!--                        Site is Running-->
                    <!--                    </q-badge>-->
                </div>

                <div class="col text-right">
                    <q-btn
                        @click="showLinks = !showLinks"
                        :icon="showLinks ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                        dense
                        flat
                    />
                </div>
            </q-card-section>

            <q-card-section>
                <domain-uptime-details
                    v-if="!(!!singleLoader.projectCheckLoader) && serviceIsActive"
                    :serviceTypes="projectInfo.domain_use_for.domain_uptime_check_service.check_types"
                />
                <div
                    v-else
                    class="text-center q-py-md text-subtitle1 text-weight-bold"
                >Service is not active</div>
            </q-card-section>
        </q-card>

        <domain-uptime-check-activate-deactivate-modal
            :show.sync="showServiceActivateDeactivateModal"
            :project-info="projectInfo"
            @serviceUpdated="handleServiceUpdate"
        />

        <q-inner-loading color="primary" :showing="!!singleLoader.projectCheckLoader" />
    </section>
</template>

<script>
import { mapGetters } from "vuex";

import DomainUptimeDetails from "components/domain-uptime/DomainUptimeDetails";
import DomainUptimeCheckActivateDeactivateModal from "components/modals/DomainUptimeCheckActivateDeactivateModal";

export default {
    components: {
        DomainUptimeDetails,
        DomainUptimeCheckActivateDeactivateModal
    },
    data() {
        return {
            showChart: false,
            showLinks: true,
            showServiceActivateDeactivateModal: false,
            amazonProductsCount: "",
            projectInfo: {
                domain: {},
                domain_use_for: {}
            }
        };
    },

    mounted() {
        this.checkProject();
    },

    computed: {
        ...mapGetters({
            singleLoader: "ui/singleLoaderStatus"
        }),

        serviceIsActive() {
            if (
                !this.projectInfo.domain_use_for.hasOwnProperty(
                    "domain_uptime_check_service"
                )
            )
                return false;

            return (
                this.projectInfo.domain_use_for.domain_uptime_check_service
                    .status === "active"
            );
        }
    },

    methods: {
        checkProject() {
            this.$singleLoaderTrue("projectCheckLoader");
            // later get it from store n check first for id check then do these cz we need projectInfo
            // for now keep api call
            this.$store
                .dispatch("projects/getProject", {
                    vm: this,
                    id: this.$route.params.project_id
                })
                .then(res => {
                    this.projectInfo = res.data.project;
                    this.$singleLoaderFalse("projectCheckLoader");
                })
                .catch(err => {
                    if (err.response.status === 404) {
                        this.$router.push("/projects");
                        this.$singleLoaderFalse("projectCheckLoader");
                    }
                });
        },

        handleServiceUpdate(project) {
            let updatedService =
                project.domain_use_for.domain_uptime_check_service;

            if (
                !this.projectInfo.domain_use_for.hasOwnProperty(
                    "domain_uptime_check_service"
                )
            ) {
                this.$set(
                    this.projectInfo.domain_use_for,
                    "domain_uptime_check_service",
                    {}
                );
            }

            this.$set(
                this.projectInfo.domain_use_for.domain_uptime_check_service,
                "check_types",
                updatedService.check_types
            );
            this.$set(
                this.projectInfo.domain_use_for.domain_uptime_check_service,
                "time_range",
                updatedService.time_range
            );
            this.$set(
                this.projectInfo.domain_use_for.domain_uptime_check_service,
                "status",
                updatedService.status
            );
        }
    }
};
</script>
