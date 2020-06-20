<template>
    <div v-if="Object.keys(details).length">
        <div class="row">
            <div class="col-md-8 q-pa-md">

                <q-card-actions class="q-pt-none">
                    <q-btn flat round icon="bar_chart"/>
                    <div class="text-h6">Uptime</div>
                    <q-btn flat color="green">
                        Last 24 hours
                    </q-btn>
                </q-card-actions>

                <div>
                    <q-linear-progress rounded
                       size="20px"
                       :value="1"
                       color="green"
                    />
                </div>

                <q-separator class="q-mt-sm"/>

                <q-card-actions>
                    <q-btn flat round icon="bar_chart"/>
                    <div class="text-h6">Response Time</div>
                    <q-btn flat color="green">
                        Last 24 hours (788.00ms av.)
                    </q-btn>
                </q-card-actions>

                <span>
                    Shows the "instant" that the monitor started returning a response in ms
                    (and average for the displayed period is 788.00ms).
                </span>

                <q-separator class="q-mt-sm"/>

                <q-c-chart/>
            </div>

            <div class="col-md-4 q-pa-md">

                <q-card class="q-mb-md">
                    <q-card-actions class="q-pa-xs">
                        <q-btn flat round
                           icon="radio_button_checked"
                           size="10px"
                        />
                        <div class="text-bold">Current Status</div>
                    </q-card-actions>

                    <q-separator/>

                    <q-card-actions class="q-pa-none">
                        <q-btn flat round
                               icon="radio_button_checked"
                               color="green"
                        />
                        <div class="text-h6 text-green">Up</div>
                    </q-card-actions>

                    <q-card-actions class="q-pt-none">
                        Since 16 hours, 19 mins (2020-06-13 00:14:12)
                    </q-card-actions>
                </q-card>

                <q-card class="q-mb-md">
                    <q-card-actions class="q-pa-xs">
                        <q-btn flat round
                               icon="bar_chart"
                               size="10px"
                        />
                        <div class="text-bold">Uptime</div>
                    </q-card-actions>
                    <q-separator/>

                    <q-card-actions class="q-pa-none" v-for="n in 3">
                        <q-btn flat round
                               icon="stars"
                               color="green"
                        />
                        <div>
                            <span class="text-bold text-green">99.747%</span> (last 24 hours)
                        </div>
                        <q-separator v-if="n !== 3"/>
                    </q-card-actions>
                </q-card>

                <q-card>
                    <q-card-actions class="q-pa-xs">
                        <q-btn flat round
                           icon="radio_button_checked"
                           size="10px"
                           color="red"
                        />
                        <span class="text-bold text-red">Latest Downtime</span>
                    </q-card-actions>

                    <q-separator/>

                    <q-card-actions>
                        It was recorded on 20-06-13 00:10:29
                        and the downtime lasted for 0 hours, 3 mins.
                    </q-card-actions>
                </q-card>

            </div>
        </div>

        <div class="q-pa-md">
            <div class="q-pb-sm">
                <span class="text-bold">Latest Events</span> (up, down, start, pause)
            </div>

            <q-list class="q-pa-md" bordered dense>

                <q-item class="text-primary text-subtitle2 text-bold">
                    <q-item-section>Event</q-item-section>
                    <q-item-section>Date-Time</q-item-section>
                    <q-item-section>Reason</q-item-section>
                    <q-item-section>Duration</q-item-section>
                </q-item>

                <q-item
                    v-for="(n, index) in 10"
                    class="q-mb-sm shadow-1 text-weight-medium"
                    :key="index"
                    clickable
                >
                    <q-item-section>
                        <q-badge v-if="n%2 === 0" color="red" style="max-width: 70px">
                            <q-icon name="arrow_downward"
                                color="white"
                                class="q-mr-xs text-bold"
                            />
                            <span class="text-bold">Down</span>
                        </q-badge>

                        <q-badge v-else color="green" style="max-width: 70px">
                            <q-icon name="arrow_upward"
                                color="white"
                                class="q-mr-xs text-bold"
                            />
                            <span class="text-bold">Up</span>
                        </q-badge>
                    </q-item-section>

                    <q-item-section>2020-06-13 00:14:12</q-item-section>
                    <q-item-section>
                        <span v-if="n%2 === 0" class="text-green">OK (200)</span>
                        <span v-else class="text-red">Connection Timeout</span>
                    </q-item-section>
                    <q-item-section>16 hours, 19 mins</q-item-section>
                </q-item>
            </q-list>
        </div>
    </div>

    <div v-else class="text-subtitle2 text-center q-pa-lg">
        No Data found
    </div>
</template>

<script>
    import QCChart from "components/charts/QCChart";

    export default {
        components: {
            QCChart
        },
        data() {
            return {
                details: {},
                pingResultsShow: [
                    {
                        key: 'alive',
                        title: 'Alive'
                    },
                    {
                        key: 'packetLoss',
                        title: 'Packet Loss'
                    },
                    {
                        key: 'times',
                        title: 'Times'
                    },
                    {
                        key: 'min',
                        title: 'Min time'
                    },
                    {
                        key: 'max',
                        title: 'Max time'
                    },
                    {
                        key: 'avg',
                        title: 'Avg time'
                    },
                ],
            }
        },

        mounted() {
            this.getDomainUptimeDetail();

            this.interval = setInterval(() => {
                this.getDomainUptimeDetail();
            }, this.$interValTime)
        },

        beforeDestroy() {
            this.interval && clearInterval(this.interval);
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
                    vm: this,
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
