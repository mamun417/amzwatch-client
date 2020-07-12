<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section class="bg-primary text-white row justify-between items-center">
                <div class="col">
                    <div class="text-h6">Check Broken Links</div>
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
                    <q-btn icon="settings" @click="showModal = !showModal" flat dense />
                </div>
            </q-card-section>

            <q-card-section class="row">
                <q-input class="col-grow" label="Search Links" value dense />
                <q-select
                    class="col-grow"
                    label="Filter"
                    value
                    :options="['all', 'available', '404', 'other']"
                    dense
                />
            </q-card-section>
        </q-card>

        <!-- <q-card class="q-mb-xl">
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
        <div class="text-center text-subtitle2">Coming soon!!</div>-->
        <!--                <q-c-chart/>-->
        <!-- </q-card-section>
        </q-card>-->

        <q-card class="q-mb-xl">
            <q-card-section class="bg-primary row items-center text-white text-subtitle2">
                <div class="col flex items-center">
                    <q-icon name="link_off" class="q-mr-sm" />
                    <div>Links</div>
                </div>

                <div>
                    <q-badge color="positive">Total: {{ brokenLinksCount }} links</q-badge>
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

            <q-card-section v-if="showLinks">
                <broken-links-list
                    ref="broken_links_list_viewer"
                    @linksCountUpdated="brokenLinksCount = $event"
                />
            </q-card-section>
        </q-card>

        <broken-links-check-service-activate-deactivate-modal
            :show.sync="showModal"
            :project-info="projectInfo"
            @serviceUpdated="handleBrokenLinksCheckServiceUpdate"
        />
    </section>
</template>

<script>
import QCChart from "components/charts/QCChart";
import BrokenLinksList from "components/broken-links/BrokenLinksList";
import BrokenLinksCheckServiceActivateDeactivateModal from "components/modals/BrokenLinksCheckServiceActivateDeactivateModal";

export default {
    components: {
        BrokenLinksCheckServiceActivateDeactivateModal,
        BrokenLinksList,
        QCChart
    },
    data() {
        return {
            showChart: false,
            showLinks: true,
            showModal: false,
            brokenLinksCount: "",
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
        serviceIsActive() {
            if (
                !this.projectInfo.domain_use_for.hasOwnProperty(
                    "broken_links_check_service"
                )
            )
                return false;

            return (
                this.projectInfo.domain_use_for.broken_links_check_service
                    .status === "active"
            );
        }
    },

    methods: {
        checkProject() {
            // later get it from store n check first for id check then do these cz we need projectInfo
            // for now keep api call
            this.$store
                .dispatch("projects/getProject", {
                    vm: this,
                    id: this.$route.params.project_id
                })
                .then(res => {
                    this.projectInfo = res.data.project;
                })
                .catch(err => {
                    if (err.response.status === 404) {
                        this.$router.push("/projects");
                    }
                });
        },

        handleBrokenLinksCheckServiceUpdate(project) {
            let updatedService =
                project.domain_use_for.broken_links_check_service;

            if (
                !this.projectInfo.domain_use_for.hasOwnProperty(
                    "broken_links_check_service"
                )
            ) {
                this.$set(
                    this.projectInfo.domain_use_for,
                    "broken_links_check_service",
                    {}
                );
            }

            this.$set(
                this.projectInfo.domain_use_for.broken_links_check_service,
                "status",
                updatedService.status
            );

            this.$refs.broken_links_list_viewer.getBrokenLinkInfo();
        }
    }
};
</script>
