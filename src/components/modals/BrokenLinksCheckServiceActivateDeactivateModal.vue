<template>
    <q-dialog
        :value="show"
        @input="$emit('update:show', $event)"
    >
        <q-card style="min-width: 400px">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{updateData.status === 'inactive' ? 'Deactivate' : 'Activate'}} this service?</div>
            </q-card-section>

            <q-card-section class="text-center q-pa-xl">
                <div class="text-subtitle1 text-bold q-mb-lg">
                    <span>This service is currently: </span>
                    <span :class="[updateData.status === 'inactive' ? 'text-positive' : 'text-warning']">
                        {{updateData.status === 'inactive' ? 'Active' : 'Inactive'}}
                    </span>
                </div>

                <q-btn
                    :color="updateData.status === 'inactive' ? 'warning' : 'positive'"
                    :label="updateData.status === 'inactive' ? 'Deactivate': 'Activate'"
                    @click="serviceActivateDeactivateHandle"
                />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
    export default {
        props  : {
            show       : {
                type   : Boolean,
                default: false
            },
            projectInfo: {
                type   : Object,
                default: () => ({})
            }
        },
        data() {
            return {
                updateData: {
                    status: 'active'
                }
            }
        },
        methods: {
            serviceActivateDeactivateHandle() {
                this.$store.dispatch('broken_links/updateBrokenLinksCheckService', {
                    vm        : this,
                    project_id: this.projectInfo.id,
                    inputs    : {
                        status: this.updateData.status
                    }
                })
                    .then(res => {
                        this.$emit('serviceUpdated', res.data.project);
                        this.$emit('update:show', false);
                    })
                    .catch(err => {
                        //handle error
                    });
            }
        },
        watch  : {
            projectInfo: {
                handler() {
                    if (
                        this.projectInfo.hasOwnProperty('domain_use_for')
                        && this.projectInfo.domain_use_for.hasOwnProperty('broken_links_check_service')
                    ) {
                        let status = this.projectInfo.domain_use_for.broken_links_check_service.status;

                        this.$set(this.updateData, 'status', status && status === 'active' ? 'inactive' : 'active');
                    }
                },
                deep     : true,
                immediate: true
            }
        }
    }
</script>