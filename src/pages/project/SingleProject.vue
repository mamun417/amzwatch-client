<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section
                class="bg-primary text-white row justify-between items-center"
            >
                <div class="col">
                    <div class="text-h6">{{projectInfo.project_name}}</div>
                    <div class="text-subtitle2">{{projectInfo.domain.url}}</div>
                </div>

                <div class="col text-center">
                    <q-badge :color="!!projectInfo.deactivated_at ? 'warning' : 'positive'">
                        {{ !!projectInfo.deactivated_at ? 'Deactivated' : 'Active' }}
                    </q-badge>
                </div>

                <div class="col text-right">
                    <q-btn icon="edit" @click="handleProjectEditModal" flat dense/>
                </div>
            </q-card-section>
        </q-card>

        <q-card
            v-for="(service, index) in projectInfo.domain_use_for"
            :key="index"
            class="q-mb-xl"
        >
            <q-card-section class="bg-primary row items-center text-white text-subtitle2">
                <div class="col flex items-center">
                    <q-icon :name="servicesInfo[index].icon" class="q-mr-sm"/>
                    <div>{{$_.upperFirst($_.lowerCase(index))}}</div>
                </div>

                <div>
                    <q-badge :color="service.status === 'active' ? 'positive' : 'warning'">
                        {{service.status === 'active' ? 'Active' : 'Service is inactive'}}
                    </q-badge>
                </div>

                <div class="col text-right">
                    <template v-if="service.status === 'active'">
                        <q-btn
                            icon="visibility"
                            :to="servicesInfo[index].to"
                            dense flat
                        />
                        <q-btn
                            icon="edit"
                            @click="modalOpenHandle(index)"
                            dense flat
                        />
                        <q-btn
                            @click="servicesInfo[index].expansionStatus = !servicesInfo[index].expansionStatus"
                            :icon="servicesInfo[index].expansionStatus ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                            dense flat
                        />
                    </template>

                    <q-btn v-else label="Start Service" dense flat no-caps/>
                    <!--call modals-->
                </div>
            </q-card-section>

            <q-card-section v-if="servicesInfo[index].expansionStatus && service.status === 'active'">

                <broken-links-list v-if="index === 'broken_links_check_service'"/>

                <guest-post-list v-if="index === 'guest_posts_check_service'"/>

                <amazon-products-list
                    v-if="index === 'amazon_products_check_service'"
                    :showLinksCountAfterExpand="true"
                />

                <div v-if="index === 'uptime_monitor_check_service'">
                    <q-c-chart class="q-mb-lg"/>

                    <div class="q-px-sm flex justify-between items-center text-bold text-subtitle2">
                        <div>Last Monitored: 20 20 20</div>
                        <q-badge label="running" color="positive"/>
                    </div>
                </div>

                <div v-if="index !== 'uptime_monitor_check_service'" class="q-pa-lg flex flex-center">
                    <q-pagination
                        :value="3"
                        :max="5"
                    >
                    </q-pagination>
                </div>
            </q-card-section>
        </q-card>

        <add-or-edit-project-modal
            :show.sync="showProjectEditModal"
            :edit-data="selectedForEdit"
            @projectUpdated="handleProjectUpdated"
            update-modal
        />

        <uptime-check-activate-deactivate-modal :show.sync="showUptimeMonitorActiveModal" :active="true"/>

    </section>
</template>

<script>
    import QCChart from "components/charts/QCChart";
    import UptimeCheckActivateDeactivateModal from "components/modals/UptimeCheckActivateDeactivateModal";
    import AmazonProductsList from "components/amazon-products/AmazonProductsList";
    import BrokenLinksList from "components/broken-links/BrokenLinksList";
    import GuestPostList from "components/guest-posts/GuestPostList";
    import AddOrEditProjectModal from "components/modals/AddOrEditProjectModal";

    export default {
        components: {
            AddOrEditProjectModal,
            GuestPostList,
            UptimeCheckActivateDeactivateModal,
            QCChart,
            AmazonProductsList,
            BrokenLinksList
        },
        data() {
            return {
                showProjectEditModal        : false,
                selectedForEdit             : {
                    domain: {}
                },
                showUptimeMonitorActiveModal: false,

                projectInfo: {
                    domain: {}
                },

                servicesInfo: {
                    amazon_products_check_service: {
                        icon           : 'local_mall',
                        expansionStatus: true,
                        active         : true,
                        to             : '/projects/' + this.$route.params.project_id + '/amazon-products-check'
                    },
                    guest_posts_check_service    : {
                        icon           : 'record_voice_over',
                        expansionStatus: true,
                        active         : true,
                        to             : '/projects/' + this.$route.params.project_id + '/guest-links-check'
                    },
                    broken_links_check_service   : {
                        icon           : 'link_off',
                        expansionStatus: true,
                        active         : true,
                        to             : '/projects/' + this.$route.params.project_id + '/broken-links-check'
                    },
                    uptime_monitor_check_service : {
                        icon           : 'trending_up',
                        expansionStatus: true,
                        active         : true,
                        to             : '/projects/1/uptime-monitor-check'
                    }
                }
            }
        },

        mounted() {
            this.getProject();
        },

        methods: {
            getProject() {
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
            handleProjectEditModal() {
                this.showProjectEditModal = !this.showProjectEditModal;
                this.selectedForEdit      = this.projectInfo;
            },
            handleProjectUpdated(data) {
                this.$set(this.projectInfo, 'project_name', data.project_name);
                this.$set(this.projectInfo, 'deactivated_at', data.deactivated_at);
            },

            modalOpenHandle(serviceType) {
                if (serviceType === 'uptime_monitor_check') {
                    this.showUptimeMonitorActiveModal = true;
                }
            }
        }
    }
</script>
