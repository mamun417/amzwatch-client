<template>
    <div class="q-pa-sm">
        <div class="row q-col-gutter-x-md">
            <div
                v-if="serviceTypes.length && 'ping'.includes(serviceTypes)"
                class="col-12 col-md-8"
            >
                 <q-card-section class="q-pt-none flex items-center">
                    <q-icon size="sm" name="bar_chart" />
                    <span class="text-h6 q-mr-sm">Uptime</span>
                    <span class="text-green text-subtitle1">Last 24 hours</span>
                </q-card-section>

                <q-scroll-area horizontal style="height: 35px">
                    <div class="row no-wrap">
                        <div v-for="n in 100" class="cursor-pointer bg-green"
                            style="margin-right: 2px;
                            height: 20px; width: 3px"
                        >
                            <q-tooltip content-class="bg-black" anchor="top middle" self="bottom middle">
                                Tooltip Text goes here
                            </q-tooltip>
                        </div>
                    </div>
                </q-scroll-area>

                 <q-separator class="q-mt-lg" />

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

                <!--<q-c-chart v-if="uptimeTimeline.length" :data="pingChartData" />-->
                <div>
                    <!--<apex-chart
                        v-if="chartDataReady"
                        width="100%"
                        height="380px"
                        type="area"
                        :options="options"
                        :series="series"
                    />-->
                </div>
            </div>

            <div
                class="col-12"
                :class="[serviceTypes.length && 'ping'.includes(serviceTypes) ? 'col-md-4' : '']"
            >
                <q-card class="q-mb-md">
                    <q-card-section class="flex items-center q-px-sm q-py-sm">
                        <q-btn flat round icon="radio_button_checked" size="10px" />
                        <div class="text-bold">Current Status</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section class="q-py-sm q-px-sm flex items-center">
                        <template v-if="uptimeTimeline.length">
                            <q-btn
                                flat
                                round
                                icon="radio_button_checked"
                                :color="isDomainUp() ? 'green' : 'red'"
                            />
                            <div
                                class="text-h6"
                                :class="[isDomainUp() ? 'text-green' : 'text-red']"
                            >{{isDomainUp() ? 'Up' : 'Down'}}</div>
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
        <latest-logs v-if="serviceTypes.length" :serviceTypes="serviceTypes" />
    </div>

    <!-- <div v-else class="text-subtitle2 text-center q-pa-lg">No Data found</div> -->
</template>

<script>
import QCChart from "components/charts/QCChart";
import { mapGetters } from "vuex";
import Pagination from "components/pagination/Pagination";
import { now } from "moment";
import ApexChart from "vue-apexcharts";
import LatestLogs from "components/domain-uptime/LatestLogs";

export default {
    components: {
        LatestLogs,
        QCChart,
        Pagination,
        ApexChart
    },
    props: {
        serviceTypes: {
            type: Array,
            default: () => []
        }
    },
    data() {
        let tempThis = this;

        return {
            chartDataReady: false,
            options: {
                chart: {
                    type: "area",
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    },
                    id: "vuechart-example"
                },
                annotations: {
                    yaxis: [
                        {
                            y: 30,
                            borderColor: "#999",
                            label: {
                                show: true,
                                style: {
                                    color: "#fff",
                                    background: "#00E396"
                                }
                            }
                        }
                    ],
                    xaxis: [
                        {
                            borderColor: "#999",
                            yAxisIndex: 0,
                            label: {
                                show: true,
                                style: {
                                    color: "#fff",
                                    background: "#775DD0"
                                }
                            }
                        }
                    ]
                },
                dataLabels: {
                    enabled: true
                },
                xaxis: {
                    type: "datetime",
                    // tickAmount: 6,
                    labels: {
                        // format: "DD MMM hh:mm"
                        formatter: function(value) {
                            return tempThis
                                .$moment(value)
                                .format("DD MMM hh:mm a"); // The formatter function overrides format property
                        }
                    }
                },
                yaxis: {
                    labels: {
                        formatter: function(value) {
                            return value + " ms";
                        }
                    }
                    // tickAmount: 6
                },
                tooltip: {
                    x: {
                        format: "dd MMM yyyy hh:mm"
                    }
                },
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 100]
                    }
                }
            },
            series: [
                {
                    name: "avg.(ms)",
                    data: []
                }
            ],

            uptimeTimeline: [],
            uptimeLatestDowntime: {},
            uptimeLogs: [],
            uptimeBarData: [],

            pingResponseTimeAvg: {
                min: 0,
                max: 0,
                avg: 0
            },
            uptimePercent: {
                day1: 0,
                day7: 0,
                day30: 0
            }
        };
    },

    mounted() {
        this.getDomainUptimeTimeline();
        this.getDomainUptimeLatestDowntime();

        // this.interval = setInterval(() => {
        //     this.getDomainUptimeDetail();
        // }, this.$intervalTime);
    },

    beforeDestroy() {
        // this.interval && clearInterval(this.interval);
    },

    computed: {
        ...mapGetters({
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    methods: {
        isDomainUp() {
            if (this.uptimeTimeline.length) {
                return this.uptimeTimeline[0].status === "ok";
            }

            return false;
        },

        getDomainUptimeTimeline() {
            this.$store
                .dispatch("domain_uptime/getDomainUptimeTimeline", {
                    vm: this,
                    project_id: this.$route.params.project_id,
                    log_type: this.serviceTypes[0]
                })
                .then(res => {
                    this.uptimeTimeline = res.data.domainUptimeTimeline.data;

                    this.generateDataFromTimeline(this.uptimeTimeline);
                })
                .catch(err => {
                    //handle error
                });
        },

        generateDataFromTimeline(timelineData, checkType = "ping") {
            this.chartDataReady = false;

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

            let chartData = [];

            this.uptimeTimeline.forEach((timeline, index) => {
                if (timeline.logged_at > nowTime - day1InMilliseconds) {
                    if (timeline.status === "ok") {
                        chartData.push({
                            x: timeline.logged_at,
                            y: timeline.info.avg
                        });
                    } else {
                        chartData.push({
                            x: timeline.logged_at,
                            y: 0
                        });
                    }
                }

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

            this.series[0].data = this.$_.reverse(chartData);
            this.chartDataReady = true;
        },

        getDomainUptimeLatestDowntime() {
            this.$singleLoaderTrue("domainUptimeTimelineLoader");

            this.$store
                .dispatch("domain_uptime/getDomainUptimeLatestDowntime", {
                    vm: this,
                    project_id: this.$route.params.project_id,
                    log_type: this.serviceTypes[0]
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
        }
    }
};
</script>
