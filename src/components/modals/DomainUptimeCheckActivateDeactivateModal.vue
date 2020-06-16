<template>
    <q-dialog
        :value="show"
        @input="$emit('update:show', $event)"
    >
        <q-card style="min-width: 400px">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">Update Uptime Monitor Checker Service</div>
            </q-card-section>

            <q-card-section class="text-center q-py-xl">
                <div class="q-px-md">
                    <q-select
                        filled
                        v-model="uptimeInfo.checkTypes"
                        class="q-mb-xl"
                        :options="['http', 'ping', 'port']"
                        label="Uptime check type"
                        multiple
                        emit-value
                        map-options
                    >
                        <template v-slot:option="scope">
                            <q-item
                                v-bind="scope.itemProps"
                                v-on="scope.itemEvents"
                            >
                                <q-item-section>
                                    <q-item-label>{{scope.opt}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-toggle v-model="uptimeInfo.checkTypes" :val="scope.opt"/>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>

                    <q-slider
                        v-model="uptimeInfo.timeRange"
                        :min="1" :max="Object.keys(timeRangeInfo).length"
                        :label-value="`${uptimeTimeLabelMaker} min`"
                        label-always
                    />
                </div>

                <div class="text-left q-mt-lg">
                    <q-toggle
                        v-model="uptimeInfo.status"
                        true-value="active" false-value="inactive"
                        checked-icon="done" unchecked-icon="clear"
                        :label="uptimeInfo.status"
                        color=""
                    />
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn
                    label="Update" class="q-mr-md"
                    @click="serviceActivateDeactivateHandle"
                    flat
                />
            </q-card-actions>

            <q-inner-loading color="primary" :showing="!!singleLoader.domainUptimeModalLoader"/>

        </q-card>
    </q-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'

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
                timeRangeInfo: {
                    1: 5,
                    2: 10,
                    3: 30,
                    4: 60
                },

                uptimeInfo: {
                    checkTypes: ['http'],
                    timeRange : 1,
                    status    : 'inactive'
                }
            }
        },
        created() {
            // get info using api & update uptimeActiveInfo if active
        },
        computed: {
            uptimeTimeLabelMaker() {
                return this.timeRangeInfo[this.uptimeInfo.timeRange]
            },
            ...mapGetters({
                singleLoader : 'ui/singleLoaderStatus'
            })
        },

        methods: {
            serviceActivateDeactivateHandle() {

                this.$singleLoaderTrue('domainUptimeModalLoader');

                this.$store.dispatch('domain_uptime/updateDomainUptimeCheckService', {
                    vm        : this,
                    project_id: this.projectInfo.id,
                    inputs    : {
                        check_types: this.uptimeInfo.checkTypes,
                        status     : this.uptimeInfo.status,
                        time_range : this.uptimeTimeLabelMaker
                    }
                })
                    .then(res => {
                        this.$singleLoaderFalse('domainUptimeModalLoader');

                        this.$q.notify({
                            color   : 'positive',
                            message : 'Uptime monitor checker service has been updated Successful',
                            position: 'top'
                        });

                        this.$emit('serviceUpdated', res.data.project);
                        this.$emit('update:show', false);
                    })
                    .catch(err => {
                        this.$singleLoaderFalse('domainUptimeModalLoader');
                        //handle error
                    });
            }
        },

        watch: {
            projectInfo: {
                handler() {
                    if (this.projectInfo.id) {
                        if (
                            this.projectInfo.hasOwnProperty('domain_use_for')
                            && this.projectInfo.domain_use_for.hasOwnProperty('domain_uptime_check_service')
                        ) {
                            let checkTypes = this.projectInfo.domain_use_for.domain_uptime_check_service.check_types;
                            let timeRange  = this.projectInfo.domain_use_for.domain_uptime_check_service.time_range;
                            let status     = this.projectInfo.domain_use_for.domain_uptime_check_service.status;

                            this.uptimeInfo.checkTypes = checkTypes || []
                            this.uptimeInfo.timeRange  = parseInt(this.$_.invert(this.timeRangeInfo)[timeRange]) || 1
                            this.uptimeInfo.status     = status || 'inactive'
                        }
                    }
                },
                deep     : true,
                immediate: true
            },
        }
    }
</script>
