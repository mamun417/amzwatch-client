<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section
                class="bg-primary text-white flex justify-between vertical-middle items-center"
            >
                <div class="text-subtitle1">Projects</div>

                <div v-if="projects.length" class="text-caption">
                    You have total {{ projects.length }} projects
                </div>

                <q-btn color="grey-3" @click="showAddEditProjectModal = true" flat>Add New</q-btn>
            </q-card-section>

            <q-card-section v-if="!projects.length" class="text-center q-py-xl">
                <div class="q-mb-lg text-subtitle2">No projects found</div>
                <q-btn @click="showAddNewProjectModal = true" color="primary">Add One</q-btn>
            </q-card-section>

            <q-card-section v-else class="row">
                <q-input class="col-grow" label="Search Projects" value="" dense/>
                <q-select class="col-grow" label="Filter" value="all" :options="['all', 'active', 'inactive']" dense/>
            </q-card-section>
        </q-card>

        <single-project-info-in-listing
            v-for="(project, index) in projects"
            :key="index"
            :project-info="project"
            @projectEdit="handleEditClick"
        />

        <div class="q-pa-lg flex flex-center">
            <q-pagination
                :value="projectPaginationMeta.current_page"
                :max="projectPaginationMeta.last_page"
                @input="projectPaginationHandle"
            >
            </q-pagination>
        </div>

        <q-dialog v-model="showAddEditProjectModal" @hide="resetAddEditFormData">
            <q-card style="min-width: 400px">
                <q-card-section class="bg-primary text-white">
                    <div v-if="projectUpdateModal" class="text-h6">Edit {{selectedForEdit.projectName}} Project</div>
                    <div v-else class="text-h6">Add New Project</div>
                </q-card-section>

                <q-card-section class="">
                    <q-input v-model="addEditProjectData.project_name" label="Project Name" class="q-mb-md"
                             autofocus dense
                             :error-message="addEditProjectDataErrors.project_name"
                             :error="!!addEditProjectDataErrors.project_name"
                             @input="addEditProjectDataErrors.project_name = ''"
                    />
                    <q-input v-model="addEditProjectData.domain_url" label="Domain URL" dense
                             :error-message="addEditProjectDataErrors.domain_url"
                             :error="!!addEditProjectDataErrors.domain_url"
                             @input="addEditProjectDataErrors.domain_url = ''"
                             :disable="projectUpdateModal"
                             :hint="projectUpdateModal ? 'Domain URL is unchangeable field' : ''"
                    />

                    <q-toggle v-if="projectUpdateModal"
                              v-model="addEditProjectData.active_status"
                              checked-icon="check"
                              color="primary"
                              label="Keep active your project"
                              unchecked-icon="clear"
                    />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup/>
                    <q-btn
                        @click="projectUpdateModal ? updateProjectButtonClicked() : addProjectButtonClicked()"
                        :label="projectUpdateModal ? 'Update' : 'Submit'"
                        flat
                    />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </section>
</template>

<script>

    import SingleProjectInfoInListing from "pages/project/SingleProjectInfoInListing";
    import {mapGetters} from 'vuex'

    export default {
        components: {SingleProjectInfoInListing},
        data() {
            return {
                projects               : [],
                projectUpdateModal     : false,
                showAddEditProjectModal: false,

                selectedForEdit         : {},
                addEditProjectData      : {
                    active_status: true
                },
                addEditProjectDataErrors: {}
            }
        },

        created() {
            // get projects first then assign to projects.
            this.getProjects();
            // dont worry for loading. we will add later
        },

        computed: {
            ...mapGetters({
                projectPaginationMeta: 'projects/paginationMeta'
            })
        },

        methods: {
            handleEditClick(data) {
                this.projectUpdateModal = true;
                this.selectedForEdit    = data;

                this.addEditProjectData.project_name = data.projectName;
                this.addEditProjectData.domain_url   = data.domain.url;

                this.showAddEditProjectModal = true;
            },

            resetAddEditFormData() {
                this.projectUpdateModal       = false;
                this.selectedForEdit          = {};
                this.addEditProjectData       = {
                    active_status: true
                };
                this.addEditProjectDataErrors = {};
            },

            getProjects() {
                this.$store.dispatch('projects/getProjects', {vm: this})
                    .then(res => {
                        this.projects           = res.data.userProject.data;
                        this.amazonProductsInfo = this.projects.map(project => {
                            project['services'] = [
                                'broken_link_check',
                                'guest_link_check'
                            ];
                            return project;
                        });
                    })
                    .catch(err => {
                        //handle error
                    })
            },

            addProjectButtonClicked() {
                this.$store.dispatch('projects/addProject', {
                    vm    : this,
                    inputs: this.addEditProjectData
                })
                    .then(res => {
                        this.$q.notify({
                            color   : 'positive',
                            message : 'Project has been added Successful',
                            position: 'top'
                        });

                        this.getProjects();
                        this.showAddEditProjectModal = false;
                    })
                    .catch(err => {
                        if (!err.response.data.errors) {
                            this.$q.notify({
                                color   : 'negative',
                                message : err.response.data.message,
                                position: 'top'
                            })
                        } else {
                            this.addEditProjectDataErrors = err.response.data.errors;
                        }
                    })
            },

            updateProjectButtonClicked() {
                this.$store.dispatch('projects/updateProject', {
                    vm        : this,
                    inputs    : this.addEditProjectData,
                    project_id: this.selectedForEdit.id
                })
                    .then(res => {
                        this.$q.notify({
                            color   : 'positive',
                            message : 'Project has been updated Successful',
                            position: 'top'
                        });

                        this.getProjects();
                        this.showAddEditProjectModal = false;
                    })
                    .catch(err => {
                        if (!err.response.data.errors) {
                            this.$q.notify({
                                color   : 'negative',
                                message : err.response.data.message,
                                position: 'top'
                            })
                        } else {
                            this.addEditProjectDataErrors = err.response.data.errors;
                        }
                    })
            },

            projectPaginationHandle(page) {
                this.$store.dispatch('projects/updateProjectsCurrentPage', page)
                    .then(() => {
                        this.getProjects()
                    })
            }

            // use start service apis
        }
    }
</script>
