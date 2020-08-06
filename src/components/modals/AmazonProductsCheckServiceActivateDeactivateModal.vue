<template>
    <q-dialog
        :value="show"
        @input="$emit('update:show', $event)"
    >
        <q-card class="q-dialog-plugin">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{updateData.status === 'inactive' ? 'Deactivate' : 'Activate'}} this service?
                </div>
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

            <q-inner-loading color="primary" :showing="!!singleLoader.amazonProductCheckServiceFormLoader"/>
        </q-card>
    </q-dialog>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        props   : {
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

        computed: {
            ...mapGetters({
                singleLoader: 'ui/singleLoaderStatus'
            })
        },

        methods : {
            serviceActivateDeactivateHandle() {
                this.$singleLoaderTrue('amazonProductCheckServiceFormLoader');

                this.$store.dispatch('amazon_products_links/updateAmazonProductCheckService', {
                    vm        : this,
                    project_id: this.projectInfo.id,
                    inputs    : {
                        status: this.updateData.status
                    }
                })
                    .then(res => {
                        this.$singleLoaderFalse('amazonProductCheckServiceFormLoader');

                        this.$q.notify({
                            color   : 'positive',
                            message : 'Amazon product checker service has been updated Successful',
                            position: 'top'
                        });

                        this.$emit('serviceUpdated', res.data.project);
                        this.$emit('update:show', false);
                    })
                    .catch(err => {
                        this.$singleLoaderFalse('amazonProductCheckServiceFormLoader');
                        //handle error
                    });
            }
        },
        watch   : {
            projectInfo: {
                handler() {
                    if (
                        this.projectInfo.hasOwnProperty('domain_use_for')
                        && this.projectInfo.domain_use_for.hasOwnProperty('amazon_products_check_service')
                    ) {
                        let status = this.projectInfo.domain_use_for.amazon_products_check_service.status;

                        this.$set(this.updateData, 'status', status && status === 'active' ? 'inactive' : 'active');
                    }
                },
                deep     : true,
                immediate: true
            }
        }
    }
</script>
