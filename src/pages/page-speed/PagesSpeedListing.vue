<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section
                class="bg-primary text-white row justify-between items-center"
            >
                <div class="col">
                    <div class="text-h6">Check Pages Speed</div>
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
                        icon="edit"
                        label="Edit"
                        @click="showServiceActivateDeactivateModal = !showServiceActivateDeactivateModal"
                        flat dense
                    />
                </div>
            </q-card-section>

            <q-card-section class="row">
                <q-input
                    class="col-grow"
                    label="Search Page"
                    :value="pageSpeedPipeline.s"
                    @input="pageSpeedPipelineHandle({s:$event})"
                    dense
                />
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
                <div class="text-center text-subtitle2">Coming soon!!</div>
                <!--                <q-c-chart/>-->
            </q-card-section>
        </q-card>

        <q-card class="q-mb-xl">
            <q-card-section class="bg-primary row items-center text-white text-subtitle2">
                <div class="col flex items-center">
                    <q-icon name="speed" class="q-mr-sm"/>
                    <div>Page speed results</div>
                </div>

                <div>
                    <q-badge color="positive">
                        Total: {{ pagesSpeedCount }} results
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

            <page-speed-list
                v-if="showLinks"
                ref="page_speed_list_viewer"
                @getPagesSpeedCount="pagesSpeedCount = $event"
            />
        </q-card>
    </section>
</template>

<script>
    import QCChart from "components/charts/QCChart";
    import PageSpeedList from "components/page-speed/PageSpeedList";
    import {mapGetters} from "vuex";

    export default {
        components: {
            PageSpeedList,
            QCChart,
        },
        data() {
            return {
                showChart                         : false,
                showLinks                         : true,
                showServiceActivateDeactivateModal: false,
                pagesSpeedCount                   : 0,
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
                if (!this.projectInfo.domain_use_for.hasOwnProperty('pages_speed_check_service')) return false

                return this.projectInfo.domain_use_for.pages_speed_check_service.status === 'active'
            },

            ...mapGetters({
                pageSpeedPipeline: "pages_speed/pipeline"
            })
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

            handlePagesSpeedCheckServiceUpdate(project) {
                let updatedService = project.domain_use_for.amazon_products_check_service;

                if (!this.projectInfo.domain_use_for.hasOwnProperty('pages_speed_check_service')) {
                    this.$set(this.projectInfo.domain_use_for, 'pages_speed_check_service', {})
                }
            },

            pageSpeedPipelineHandle(pipeline) {
                this.$store
                    .dispatch("pages_speed/updatePageSpeedPipeline", {
                        vm: this,
                        pipeline: pipeline
                    })
                    .then(() => {
                        this.$refs.page_speed_list_viewer.getPagesSpeedInfo();
                    });
            }
        }
    }
</script>
