<template>
    <q-dialog
        :value="show"
        @input="$emit('update:show', $event)"
        @hide="modalCloseHandle"
    >
        <q-card style="min-width: 400px">
            <q-card-section class="bg-primary text-white">
                <div v-if="updateModal" class="text-h6">Edit {{addEditProjectData.project_name}} Project</div>
                <div v-else class="text-h6">Add New Project</div>
            </q-card-section>

            <q-card-section class="">
                <q-input
                    v-model="addEditProjectData.project_name"
                    label="Project Name" class="q-mb-md"
                    :error-message="addEditProjectDataErrors.project_name"
                    :error="!!addEditProjectDataErrors.project_name"
                    @input="addEditProjectDataErrors.project_name = ''"
                    autofocus dense
                />
                <q-input
                    v-model="addEditProjectData.domain_url"
                    :error-message="addEditProjectDataErrors.domain_url"
                    :error="!!addEditProjectDataErrors.domain_url"
                    :disable="updateModal"
                    :hint="updateModal ? 'Domain URL is unchangeable field' : ''"
                    @input="addEditProjectDataErrors.domain_url = ''"
                    label="Domain URL" dense
                />

                <q-toggle
                    v-if="updateModal"
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
                    @click="updateModal ? updateProjectButtonClicked() : addProjectButtonClicked()"
                    :label="updateModal ? 'Update' : 'Submit'"
                    flat
                />
            </q-card-actions>

            <q-inner-loading color="primary" :showing="!!singleLoader.addOrEditProjectLoader"/>

        </q-card>
    </q-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        components: {},
        props     : {
            editData   : {
                type   : Object,
                default: () => ({})
            },
            show       : {
                type   : Boolean,
                default: false
            },
            updateModal: {
                type   : Boolean,
                default: false
            }
        },
        data() {
            return {
                addEditProjectData      : {},
                addEditProjectDataErrors: {}
            }
        },

        computed: {
            ...mapGetters({
                singleLoader : 'ui/singleLoaderStatus'
            })
        },

        methods: {
            modalCloseHandle() {
                this.resetAddEditFormData();
                this.$emit('modalClosed');
            },

            resetAddEditFormData() {
                this.addEditProjectData       = {};
                this.addEditProjectDataErrors = {};
            },

            addProjectButtonClicked() {

                this.$singleLoaderTrue('addOrEditProjectLoader');

                this.$store.dispatch('projects/addProject', {
                    vm    : this,
                    inputs: this.addEditProjectData
                })
                    .then(res => {
                        this.$singleLoaderFalse('addOrEditProjectLoader');

                        this.$q.notify({
                            color   : 'positive',
                            message : 'Project has been added Successful',
                            position: 'top'
                        });

                        this.$emit('projectAdded', res.data.project);
                        this.$emit('update:show', false);
                    })
                    .catch(err => {
                        this.$singleLoaderFalse('addOrEditProjectLoader');

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

                this.$singleLoaderTrue('addOrEditProjectLoader');

                this.$store.dispatch('projects/updateProject', {
                    vm        : this,
                    inputs    : this.addEditProjectData,
                    project_id: this.addEditProjectData.id
                })
                    .then(res => {
                        this.$singleLoaderFalse('addOrEditProjectLoader');

                        this.$q.notify({
                            color   : 'positive',
                            message : 'Project has been updated Successful',
                            position: 'top'
                        });

                        this.$emit('projectUpdated', res.data.project)
                        this.$emit('update:show', false);
                    })
                    .catch(err => {
                        this.$singleLoaderFalse('addOrEditProjectLoader');

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
            }
        },
        watch  : {
            editData: {
                handler() {

                    if (Object.keys(this.editData).length === 0) return;

                    this.tempAddEditProjectData = this.$_.cloneDeep(this.editData);

                    if (this.updateModal) {
                        this.$set(this.addEditProjectData, 'id', this.tempAddEditProjectData.id);
                        this.$set(this.addEditProjectData, 'project_name', this.tempAddEditProjectData.project_name);
                        this.$set(this.addEditProjectData, 'domain_url', this.tempAddEditProjectData.domain.url);

                        this.$set(this.addEditProjectData, 'active_status', !(!!this.tempAddEditProjectData.deactivated_at));
                    } else {
                        this.$set(this.addEditProjectData, 'active_status', true);
                    }
                },
                deep     : true,
                immediate: true
            }
        }
    }
</script>
