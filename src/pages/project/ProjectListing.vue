<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section
                class="bg-primary text-white flex justify-between vertical-middle items-center"
            >
                <div class="text-subtitle1">Projects</div>

                <div
                    v-if="projects.length"
                    class="text-caption"
                >{{ projectPaginationMeta.total }} projects found</div>

                <q-btn color="grey-3" @click="handleNewProjectClick" flat>Add New</q-btn>
            </q-card-section>

            <q-card-section class="row">
                <q-input
                    class="col-grow"
                    label="Search Projects"
                    :value="projectsPipeline.s"
                    @input="projectPipelineHandle({s:$event})"
                    dense
                />
                <q-select
                    class="col-grow"
                    label="Filter"
                    :value="projectsPipeline.f"
                    :options="['all', 'active', 'inactive']"
                    @input="projectPipelineHandle({f:$event})"
                    dense
                />
            </q-card-section>

            <q-card-section v-if="!projects.length" class="text-center q-py-xl">
                <div class="q-mb-lg text-subtitle2">No projects found</div>
                <q-btn @click="handleNewProjectClick" color="primary">Add One</q-btn>
            </q-card-section>
        </q-card>

        <single-project-info-in-listing
            v-for="(project, index) in projects"
            :key="index"
            :project-info.sync="project"
            @projectEdit="handleEditProjectClick"
            @serviceUpdated="getProjects()"
        />

        <div v-if="!!projectPaginationMeta.last_page > 1" class="q-pa-lg flex flex-center">
            <q-pagination
                :value="projectPaginationMeta.current_page"
                :max="projectPaginationMeta.last_page"
                @input="projectPaginationHandle"
            ></q-pagination>
        </div>

        <add-or-edit-project-modal
            :show.sync="showAddEditProjectModal"
            :update-modal="projectUpdateModal"
            :edit-data="selectedForEdit"
            @projectAdded="getProjects"
            @projectUpdated="handleProjectUpdated"
            @modalClosed="selectedForEdit = {}"
        />

        <q-inner-loading color="primary" :showing="!!singleLoader.projectListLoader" />
    </section>
</template>

<script>
import SingleProjectInfoInListing from "pages/project/SingleProjectInfoInListing";
import { mapGetters } from "vuex";
import AddOrEditProjectModal from "components/modals/AddOrEditProjectModal";

export default {
    components: {
        AddOrEditProjectModal,
        SingleProjectInfoInListing
    },
    data() {
        return {
            projects: [],

            projectUpdateModal: false,
            showAddEditProjectModal: false,
            selectedForEdit: {},
            interval: null
        };
    },

    mounted() {
        // get projects first then assign to projects.
        this.getProjects();

        this.interval = setInterval(() => {
            this.getProjects();
        }, this.$intervalTime);
    },

    beforeDestroy() {
        this.interval && clearInterval(this.interval);
    },

    computed: {
        ...mapGetters({
            projectPaginationMeta: "projects/paginationMeta",
            projectsPipeline: "projects/pipeline",
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    methods: {
        handleNewProjectClick() {
            this.projectUpdateModal = false;
            this.selectedForEdit = {};
            this.showAddEditProjectModal = true;
        },
        handleEditProjectClick(data) {
            this.projectUpdateModal = true;
            this.selectedForEdit = data;

            this.showAddEditProjectModal = true;
        },

        getProjects() {
            this.$singleLoaderTrue("projectListLoader");

            this.$store
                .dispatch("projects/getProjects", { vm: this })
                .then(res => {
                    this.projects = res.data.userProjects.data.map(project => {
                        let domainUseFor = project.domain_use_for;
                        project["services"] = [];

                        Object.keys(domainUseFor).map(objKey => {
                            if (
                                domainUseFor.hasOwnProperty("status") &&
                                domainUseFor.status === "active"
                            ) {
                                project.services.push(objKey);
                            }
                        });

                        return project;
                    });

                    this.$singleLoaderFalse("projectListLoader");
                })
                .catch(err => {
                    //handle error
                });
        },

        handleProjectUpdated(data) {
            this.projects.map(project => {
                if (project.id === data.id) {
                    project.project_name = data.project_name;
                    project.deactivated_at = data.deactivated_at;
                }
            });
        },

        projectPaginationHandle(page) {
            this.$store
                .dispatch("projects/updateProjectsCurrentPage", page)
                .then(() => {
                    this.getProjects();
                });
        },
        projectPipelineHandle(pipeline) {
            this.$store
                .dispatch("projects/updateProjectsPipeline", {
                    vm: this,
                    pipeline: pipeline
                })
                .then(() => {
                    this.getProjects();
                });
        }

        // use start service apis
    }
};
</script>
