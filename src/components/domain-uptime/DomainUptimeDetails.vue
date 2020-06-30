<template>
    <div class="q-pa-sm">
        <div class="row">
            <div class="col-md-8 q-pr-md">
                <!-- <q-card-section class="q-pt-none flex items-center">
                    <q-icon size="sm" name="bar_chart" />
                    <span class="text-h6 q-mr-sm">Uptime</span>
                    <span class="text-green text-subtitle1">Last 24 hours</span>
                </q-card-section>-->

                <!-- <div>
                    <q-linear-progress rounded size="20px" :value="1" color="green" />
                </div>-->

                <!-- <q-separator class="q-mt-lg" /> -->

                <q-card-section class="flex items-center q-pt-none">
                    <q-icon size="sm" name="bar_chart" />
                    <span class="text-h6 q-mr-sm">Response Times(avg.)</span>
                    <span
                        class="text-green text-subtitle1 q-mt-xs"
                    >Last 24 hours ( {{pingResponseTimeAvg.avg.toFixed(2)}}ms )</span>
                </q-card-section>

                <!-- <span>
                    Shows the "instant" that the monitor started returning a response in ms
                    (and average for the displayed period is 788.00ms).
                </span>-->

                <!-- <q-separator class="q-mt-sm" /> -->

                <!--<q-c-chart v-if="uptimePingTimeline.length" :data="pingChartData" />-->
                <div>
                    <apex-chart v-if="chartDataReady"
                        width="100%"
                        height="380px"
                        type="area"
                        :options="options"
                        :series="series"
                    />
                </div>
            </div>

            <div class="col-md-4 q-pl-md">
                <q-card class="q-mb-md">
                    <q-card-section class="flex items-center q-px-sm q-py-sm">
                        <q-btn flat round icon="radio_button_checked" size="10px" />
                        <div class="text-bold">Current Status</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section class="q-py-sm q-px-sm flex items-center">
                        <template v-if="uptimePingTimeline.length">
                            <q-btn flat round icon="radio_button_checked" color="green" />
                            <div
                                class="text-h6"
                                :class="[isDomainUp ? 'text-green' : 'text-red']"
                            >{{isDomainUp ? 'Up' : 'Down'}}</div>
                        </template>
                        <div
                            v-else
                            class="text-center text-weight-bold full-width"
                        >No logs found yet</div>

                        <q-inner-loading
                            color="primary"
                            :showing="!!singleLoader.domainUptimeTimelineLoader"
                        />
                    </q-card-section>
                </q-card>

                <q-card class="q-mb-md">
                    <q-card-section class="flex items-center q-px-sm q-py-sm">
                        <q-btn flat round icon="bar_chart" size="10px" />
                        <div class="text-bold">Uptime</div>
                    </q-card-section>
                    <q-separator />

                    <q-card-actions class="q-pa-none">
                        <q-btn flat round icon="stars" color="green" />
                        <div>
                            <span class="text-bold text-green">{{uptimePercent.day1.toFixed(2)}}%</span> (last 24 hours)
                        </div>
                        <q-separator />
                    </q-card-actions>
                    <q-card-actions class="q-pa-none">
                        <q-btn flat round icon="stars" color="green" />
                        <div>
                            <span class="text-bold text-green">{{uptimePercent.day7.toFixed(2)}}%</span> (last 7 days)
                        </div>
                        <q-separator />
                    </q-card-actions>
                    <q-card-actions class="q-pa-none">
                        <q-btn flat round icon="stars" color="green" />
                        <div>
                            <span class="text-bold text-green">{{uptimePercent.day30.toFixed(2)}}%</span> (last 30 days)
                        </div>
                        <q-separator />
                    </q-card-actions>
                </q-card>

                <q-card>
                    <q-card-section class="flex items-center q-px-sm q-py-sm">
                        <q-btn flat round icon="radio_button_checked" size="10px" color="red" />
                        <span class="text-bold text-red">Latest Downtime</span>
                    </q-card-section>

                    <q-separator />

                    <q-card-section class="q-py-md">
                        <template v-if="uptimeLatestDowntime">
                            It was recorded on
                            <span
                                class="text-bold q-ml-sm"
                            >{{$timestampToDate(uptimeLatestDowntime.logged_at)}}</span>
                        </template>
                        <template v-else>No latest downtime</template>
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <q-separator class="q-mt-lg" />

        <div class="q-mt-md relative-position">
            <div class="text-h6">Latest Logs</div>

            <q-list v-if="uptimeLogs.length" class="q-py-md" dense>
                <q-item class="text-primary text-subtitle2 text-bold">
                    <q-item-section>Event</q-item-section>
                    <q-item-section class="text-center">Reason</q-item-section>
                    <q-item-section class="text-right">Last checked</q-item-section>
                </q-item>

                <q-item
                    v-for="(log, index) in uptimeLogs"
                    class="q-mb-sm shadow-1 text-weight-medium"
                    :key="index"
                    clickable
                >
                    <q-item-section>
                        <q-badge
                            :color="log.status !== 'ok' ? 'red' : 'green'"
                            style="max-width: 70px"
                        >
                            <q-icon name="arrow_downward" color="white" class="q-mr-xs text-bold" />
                            <span class="text-bold">{{log.status !== 'ok' ? 'Down': 'Up'}}</span>
                        </q-badge>
                    </q-item-section>

                    <q-item-section class="text-center">
                        <span
                            :class="[log.status !== 'ok' ? 'text-red' : 'text-green']"
                        >{{log.status !== 'ok' ? 'Connection Timeout' : 'OK (200)'}}</span>
                    </q-item-section>

                    <q-item-section class="text-right">{{$timestampToDate(log.logged_at)}}</q-item-section>
                </q-item>
            </q-list>

            <div v-else class="text-center q-py-md text-weight-bold">No logs found</div>

            <div v-if="uptimeLogsPaginationMeta.last_page > 1" class="q-py-sm flex flex-center">
                <pagination
                    :current_page="uptimeLogsPaginationMeta.current_page"
                    :last_page="uptimeLogsPaginationMeta.last_page"
                    @handlePagination="uptimeLogsPaginationHandle"
                />
            </div>

            <q-inner-loading color="primary" :showing="!!singleLoader.domainUptimeLogsLoader" />
        </div>
    </div>

    <!-- <div v-else class="text-subtitle2 text-center q-pa-lg">No Data found</div> -->
</template>

<script>
import QCChart from "components/charts/QCChart";
import { mapGetters } from "vuex";
import Pagination from "components/pagination/Pagination";
import { now } from "moment";
import ApexChart from 'vue-apexcharts'

export default {
    components: {
        QCChart,
        Pagination,
        ApexChart
    },
    data() {
        return {
            chartDataReady: false,
            options: {
                chart: {
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    },
                    id: 'vuechart-example',
                },
                xaxis: {
                    type: "datetime"
                }
            },
            series: [
                {
                    name: "Series 1",
                    data: [],
                }
            ],

            uptimePingTimeline: [],
            uptimeLatestDowntime: {},
            uptimeLogs: [],

            pingResponseTimeAvg: {
                min: 0,
                max: 0,
                avg: 0
            },
            uptimePercent: {
                day1: 0,
                day7: 0,
                day30: 0
            },

            pingChartData: {
                labels: [],
                datasets: [
                    {
                        label: "Uptime chart",
                        data: [],
                        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                        borderColor: ["rgba(255, 99, 132, 1)"],
                        borderWidth: 1
                    }
                ]
            },

            pingResultsShow: [
                {
                    key: "alive",
                    title: "Alive"
                },
                {
                    key: "packetLoss",
                    title: "Packet Loss"
                },
                {
                    key: "times",
                    title: "Times"
                },
                {
                    key: "min",
                    title: "Min time"
                },
                {
                    key: "max",
                    title: "Max time"
                },
                {
                    key: "avg",
                    title: "Avg time"
                }
            ]
        };
    },

    mounted() {
        this.getDomainUptimePingTimeline();
        this.getDomainUptimeLogs();
        this.getDomainUptimeLatestDowntime();

        // this.interval = setInterval(() => {
        //     this.getDomainUptimeDetail();
        // }, this.$interValTime);
    },

    beforeDestroy() {
        // this.interval && clearInterval(this.interval);
    },

    computed: {
        ...mapGetters({
            uptimeLogsPaginationMeta: "domain_uptime/paginationMeta",
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    methods: {
        isDomainUp() {
            if (this.uptimePingTimeline.length) {
                return this.uptimePingTimeline[0].status === "ok";
            }

            return false;
        },

        getDomainUptimePingTimeline() {
            this.$store
                .dispatch("domain_uptime/getDomainUptimePingTimeline", {
                    vm: this,
                    project_id: this.$route.params.project_id,
                    time_upto: 1,
                    interval: "min"
                })
                .then(res => {
                    this.uptimePingTimeline =
                        res.data.domainUptimePingTimeline.data;

                    this.generatePingDataFromTimeline(this.uptimePingTimeline);

                    // push chart data
                    this.uptimePingTimeline.forEach((timeline, index) => {
                        let currentTimelineDay = this.$moment(timeline.logged_at).format("DD hh:mm")

                        this.series[0].data.push(
                            {
                                x: currentTimelineDay,
                                y: timeline.info.avg
                            }
                        );
                    });

                    this.chartDataReady = true;
                })
                .catch(err => {
                    //handle error
                });
        },

        generatePingDataFromTimeline(timelineData, checkType = "ping") {
            let day1InMinutes = 60 * 24;
            let day7InMinutes = day1InMinutes * 7;
            let day30InMinutes = day1InMinutes * 30;

            let day1InMilliseconds = day1InMinutes * 60 * 1000;

            let validCount = 0;
            let totalMin = 0;
            let totalMax = 0;
            let totalAvg = 0;

            let day1DownFor = 0;
            let day7DownFor = 0;
            let day30DownFor = 0;

            let totalTimelineDayCalculated = 0;
            let lastTimelineDayCalculated = 0;

            let nowTime = new Date().getTime();
            let chartLabels = [];
            let chartData = [];

            this.uptimePingTimeline.forEach((timeline, index) => {
                // if (timeline.logged_at < nowTime - day1InMilliseconds) {
                //     let hr = this.$moment(timeline.logged_at).format(
                //         "MM-DD hh a"
                //     );

                //     if (!chartLabels.includes(hr)) {
                //         chartLabels.push(hr);
                //     }
                // }

                let currentTimelineDay = parseInt(
                    this.$moment(timeline.logged_at).format("DD")
                );

                if (timeline.status === "ok" && checkType === "ping") {
                    totalMin += parseFloat(timeline.info.min);
                    totalMax += parseFloat(timeline.info.max);
                    totalAvg += parseFloat(timeline.info.avg);

                    validCount++;
                }

                if (totalTimelineDayCalculated <= 30) {
                    if (timeline.status !== "ok") {
                        if (totalTimelineDayCalculated <= 1) {
                            day1DownFor++;
                        }
                        if (totalTimelineDayCalculated <= 7) {
                            day7DownFor++;
                        }
                        if (totalTimelineDayCalculated <= 30) {
                            day30DownFor++;
                        }
                    }

                    if (currentTimelineDay !== lastTimelineDayCalculated) {
                        lastTimelineDayCalculated = currentTimelineDay;
                        totalTimelineDayCalculated++;
                    }
                }
            });

            this.pingResponseTimeAvg.avg = totalAvg / validCount;

            this.uptimePercent.day1 =
                ((day1InMinutes - day1DownFor) / day1InMinutes) * 100;
            this.uptimePercent.day7 =
                ((day7InMinutes - day7DownFor) / day7InMinutes) * 100;
            this.uptimePercent.day30 =
                ((day30InMinutes - day30DownFor) / day30InMinutes) * 100;

            // this.pingChartData.labels = chartLabels;
        },

        getDomainUptimeLatestDowntime() {
            this.$singleLoaderTrue("domainUptimeTimelineLoader");

            this.$store
                .dispatch("domain_uptime/getDomainUptimeLatestDowntime", {
                    vm: this,
                    project_id: this.$route.params.project_id,
                    log_type: "ping"
                })
                .then(res => {
                    this.uptimeLatestDowntime =
                        res.data.domainUptimeLatestDowntime;
                    this.$singleLoaderFalse("domainUptimeTimelineLoader");
                })
                .catch(err => {
                    //handle error
                    this.$singleLoaderFalse("domainUptimeTimelineLoader");
                });
        },

        getDomainUptimeLogs() {
            this.$singleLoaderTrue("domainUptimeLogsLoader");

            this.$store
                .dispatch("domain_uptime/getDomainUptimeLogs", {
                    vm: this,
                    project_id: this.$route.params.project_id,
                    log_type: "ping"
                })
                .then(res => {
                    this.uptimeLogs = res.data.domainUptimeLogs.data;
                    this.$singleLoaderFalse("domainUptimeLogsLoader");
                })
                .catch(err => {
                    //handle error
                    this.$singleLoaderFalse("domainUptimeLogsLoader");
                });
        },

        uptimeLogsPaginationHandle(page) {
            this.$store
                .dispatch("domain_uptime/updateUptimeLogsCurrentPage", page)
                .then(() => {
                    this.getDomainUptimeLogs();
                });
        }
    }
};
</script>
