<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section
                class="bg-primary text-white flex justify-between vertical-middle items-center"
            >
                <div class="text-subtitle1">Projects</div>

                <div v-if="projects.length" class="text-caption">
                    You have total {{projects.length}} projects
                </div>

                <q-btn color="grey-3" @click="showAddNewProjectModal = true" flat>Add New</q-btn>
            </q-card-section>

            <q-card-section v-if="!projects.length" class="text-center q-py-xl">
                <div class="q-mb-lg text-subtitle2">No projects found</div>
                <q-btn color="primary">Add One</q-btn>
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
                :value="3"
                :max="5"
            >
            </q-pagination>
        </div>


        <q-dialog v-model="showAddNewProjectModal">
            <q-card style="min-width: 400px">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Add New Project</div>
                </q-card-section>

                <q-card-section class="">
                    <q-input label="Project Name" class="q-mb-md" autofocus dense/>
                    <q-input label="Domain URL" dense/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup/>
                    <q-btn flat label="Submit" v-close-popup/>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="showEditProjectModal" @hide="resetEditData">
            <q-card style="min-width: 400px">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Edit {{selectedForEdit.name}} Project</div>
                </q-card-section>

                <q-card-section class="">
                    <div class="q-px-sm q-mb-md">
                        <q-input v-model="editProjectData.name" label="Project Name" class="q-mb-md" autofocus dense/>
                        <q-input v-model="editProjectData.domain" label="Domain URL" dense/>
                    </div>

                    <q-toggle
                        v-model="editProjectData.state"
                        checked-icon="check"
                        color="primary"
                        label="Keep active your project"
                        unchecked-icon="clear"
                    />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup/>
                    <q-btn flat label="Update" v-close-popup/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </section>
</template>

<script>

    import QCChart from "components/charts/QCChart";

    export default {
        components: {QCChart},
        data() {
            return {
                showChart: true,
                showLinks: true,
                showModal: false,

                projectInfo: [],
            }
        },

        mounted() {
            this.getProjects();
        },

        methods: {
            getProjects() {
                this.$store.dispatch('projects/getProjects', {
                    vm: this,
                    //project_id: this.$route.params.project_id
                })
                    .then(res => {
                        this.projectInfo = res.data;
                    })
                    .catch(err => {
                        //handle error
                    })
            }
        }
    }

// import SingleProjectInfoInListing from "pages/project/SingleProjectInfoInListing";
//
// export default {
//     components: {SingleProjectInfoInListing},
//     created() {
//         // get projects first then assign to projects.
//         // dont worry for loading. we will add later
//     },
//     data() {
//         return {
//             showAddNewProjectModal: false,
//             showEditProjectModal  : false,
//
//             selectedForEdit  : {},
//             addNewProjectData: {},
//             editProjectData  : {
//                 state: true
//             },
//             projects         : [
//                 {
//                     name    : 'Test project for all',
//                     domain  : 'https//exonhost.com',
//                     services: ['broken_link_check', 'guest_link_check']
//                 },
//                 {
//                     name    : 'Test2',
//                     domain  : 'https//exonhost.com',
//                     services: ['amazon_product_link_check', 'uptime_monitor_check']
//                 }
//             ],
//
//         }
//     },
//     methods   : {
//         handleEditClick(data) {
//             this.selectedForEdit = data;
//
//             this.editProjectData.name = data.name;
//             this.editProjectData.domain = data.domain;
//
//             this.showEditProjectModal = true;
//         },
//         resetEditData() {
//             this.selectedForEdit = {};
//             this.editProjectData = {
//                 state: true
//             }
//         }
//
//         // use add project api
//         // use update project api
//         // use start service apis
//     }
// }
</script>
