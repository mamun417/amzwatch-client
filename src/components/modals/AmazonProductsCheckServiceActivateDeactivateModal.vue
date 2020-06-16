<template>
    <q-dialog
        :value="show"
        @input="$emit('update:show', $event)"
    >
        <q-card style="min-width: 400px">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">Update Amazon Product Checker Service</div>
            </q-card-section>

            <q-card-section class="q-pa-xl">
                <q-select
                    v-model="updateData.affiliateIds" label="Amazon affiliate ids" class="q-mb-lg"
                    standout="bg-primary text-white"
                    new-value-mode="add-unique"
                    hint="Type and hit enter to add new ids"
                    use-input use-chips multiple
                    hide-dropdown-icon
                />

                <q-toggle
                    v-model="updateData.status"
                    true-value="active" false-value="inactive"
                    checked-icon="done" unchecked-icon="clear"
                    :label="updateData.status"
                    color=""
                />

                <div v-if="!updateData.affiliateIds.length"
                     class="flex items-center justify-start text-caption q-mb-md">
                    <q-icon name="warning" color="warning" class="q-mr-xs"/>
                    <div>Note: Before activate insert your amazon affiliate id</div>
                </div>

                <div class="text-center q-mt-lg">
                    <q-btn color="positive" label="Update" class="q-px-lg" @click="serviceActivateDeactivateHandle"/>
                </div>
            </q-card-section>

            <q-inner-loading color="primary" :showing="!!singleLoader.amazonProductCheckServiceFormLoader"/>

        </q-card>
    </q-dialog>
</template>

<script>
    import {mapGetters} from "vuex";

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
                    status      : 'active',
                    affiliateIds: []
                }
            }
        },
        computed: {
            ...mapGetters({
                singleLoader : 'ui/singleLoaderStatus'
            })
        },
        methods: {
            serviceActivateDeactivateHandle() {

                this.$singleLoaderTrue('amazonProductCheckServiceFormLoader');
                this.$forceUpdate();

                this.$store.dispatch('amazon_products_links/updateAmazonProductCheckService', {
                    vm        : this,
                    project_id: this.projectInfo.id,
                    inputs    : {
                        affiliate_ids: this.updateData.affiliateIds,
                        status       : this.updateData.status
                    }
                })
                    .then(res => {
                        this.$singleLoaderFalse('amazonProductCheckServiceFormLoader');
                        this.$forceUpdate();

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
                        this.$forceUpdate();
                        //handle error
                    });
            }
        },
        watch  : {
            projectInfo: {
                handler() {
                    if (
                        this.projectInfo.hasOwnProperty('domain_use_for')
                        && this.projectInfo.domain_use_for.hasOwnProperty('amazon_products_check_service')
                    ) {
                        let status       = this.projectInfo.domain_use_for.amazon_products_check_service.status;
                        let affiliateIds = this.projectInfo.domain_use_for.amazon_products_check_service.affiliate_ids;

                        this.$set(this.updateData, 'status', status || 'active');
                        this.$set(this.updateData, 'affiliateIds', affiliateIds || []);
                    }
                },
                deep     : true,
                immediate: true
            }
        }
    }
</script>
