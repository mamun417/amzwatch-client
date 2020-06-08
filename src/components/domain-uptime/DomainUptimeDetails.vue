<template>
    <div
        v-if="Object.keys(details).length"
    >
        <div>
            <span class="text-subtitle2">Currently active uptime checks</span>
            <span class="q-ml-md">
                <q-chip
                    v-for="(type, index) in ['http', 'ping']"
                    class="q-px-sm"
                    :class="[getCheckTypesActiveState(type) ? 'text-white' : '']"
                    :color="getCheckTypesActiveState(type) ? 'primary' : ''"
                    :disable="!getCheckTypesActiveState(type)"
                    dense
                >
                    {{type}}
                </q-chip>
            </span>
        </div>

        <q-card
            v-for="(checkType, index) in ['http', 'ping']"
            class="q-my-md"
        >
            <q-card-section class="bg-primary text-white row items-center">
                <div class="col">
                    {{$_.upperCase(checkType)}}
                </div>

                <div>
                    <q-badge :color="getCheckTypesActiveState(checkType) ? 'positive' : 'warning'">
                        {{getCheckTypesActiveState(checkType) ? 'active' : 'inactive'}}
                    </q-badge>
                </div>

                <div class="col text-right">
                    <template v-if="getCheckTypesHasLastDate(checkType)">
                        <template v-if="getCheckTypesHasLastDate(checkType)">
                            <span>Last checked</span>
                            <span
                                class="q-ml-sm"
                            >{{$timestampToDate(details.uptime_checker[checkType].last_checked_at)}}</span>
                        </template>
                        <div v-else>Pending</div>
                    </template>
                </div>
            </q-card-section>

            <q-card-section v-if="getCheckTypesActiveState(checkType)">
                <template v-if="getCheckTypesActiveState(checkType)">
                    <div
                        class="shadow-1 q-mx-auto q-my-md"
                        style="max-width: 400px"
                    >
                        <q-list class="text-center text-md text-weight-medium" dense separator>
                            <q-item>
                                <q-item-section
                                    class="text-primary text-subtitle2 q-my-sm"
                                >Result
                                </q-item-section>
                            </q-item>

                            <q-item
                                clickable
                            >
                                <q-item-section>Packet Size</q-item-section>
                                <q-item-section>32 byte</q-item-section>
                            </q-item>
                            <q-item
                                clickable
                            >
                                <q-item-section>Checked</q-item-section>
                                <q-item-section>4 times</q-item-section>
                            </q-item>

                            <q-item
                                v-for="(item, index) in pingResultsShow"
                                clickable
                            >
                                <q-item-section>{{item.title}}</q-item-section>
                                <q-item-section>
                                    {{details.meta.uptime_check.ping.result[item.key]}}
                                    {{['min', 'max', 'avg'].includes(item.key) ? ' ms' : ''}}
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                </template>
                <div v-else class="text-subtitle2 text-center">Pending</div>
            </q-card-section>
        </q-card>
    </div>
    <div
        v-else
        class="text-subtitle2 text-center q-pa-lg"
    >
        No Data found
    </div>
</template>

<script>
    export default {
        data() {
            return {
                details        : {},
                pingResultsShow: [
                    {
                        key  : 'alive',
                        title: 'Alive'
                    },
                    {
                        key  : 'packetLoss',
                        title: 'Packet Loss'
                    },
                    {
                        key  : 'times',
                        title: 'Times'
                    },
                    {
                        key  : 'min',
                        title: 'Min time'
                    },
                    {
                        key  : 'max',
                        title: 'Max time'
                    },
                    {
                        key  : 'avg',
                        title: 'Avg time'
                    },
                ]
            }
        },

        mounted() {
            this.getDomainUptimeDetail()
        },

        methods: {
            getCheckTypesActiveState(type) {
                return this.details.user_domain.domain_use_for.domain_uptime_check_service.check_types.includes(type)
            },
            getCheckTypesHasLastDate(type) {
                if (this.details.hasOwnProperty('uptime_checker')) {
                    if (this.details.uptime_checker.hasOwnProperty(type)) {
                        return this.details.uptime_checker[type].hasOwnProperty('last_checked_at')
                            && this.details.uptime_checker[type].last_checked_at
                    }
                }

                return false
            },

            getDomainUptimeDetail() {
                this.$store.dispatch('domain_uptime/getDomainUptimeDetails', {
                    vm        : this,
                    project_id: this.$route.params.project_id
                })
                    .then(res => {
                        this.details = res.data.domainUptimeDetails;
                    })
                    .catch(err => {
                        //handle error
                    });
            }
        }
    }
</script>