<template>
    <div>
        <q-list>
            <q-item class="q-mb-sm text-subtitle2 text-primary">
                <q-item-section class="q-ml-md">Page Url</q-item-section>
                <q-item-section class="text-center">Overall result</q-item-section>
                <q-item-section class="text-right q-mr-md"></q-item-section>
            </q-item>

            <q-expansion-item
                v-for="(page, index) in pagesSpeedInfo"
                :key="index"
                group="amzProduct"
                icon
                header-class
                expand-icon-class="hidden"
                class="shadow-3 q-mb-sm"
                ref="pagesItem"
            >
                <q-item
                    slot="header"
                    class="row full-width justify-between text-subtitle2 items-center"
                >
                    <!--                {{page}}-->
                    <q-item-section class="col">{{page.url}}</q-item-section>

                    <q-item-section class="col text-center">
                        <div v-if="!page.hasOwnProperty('meta')">Page is in pending state</div>
                        <div v-else class="row items-center justify-center">
                            <div
                                v-for="(device, index) in ['lhr_desktop_result', 'lhr_mobile_result']"
                                class="q-mx-md"
                            >
                                <q-icon
                                    :name="device === 'lhr_desktop_result' ? 'desktop_mac' : 'phone_android'"
                                    size="20px"
                                    color="primary"
                                />
                                <q-circular-progress
                                    v-if="page.meta.hasOwnProperty(device) && page.meta[device]"
                                    class="q-mx-xs"
                                    :class="[`text-${calculateScoreType(calculateOverallScore(page.meta[device].categories)).color}`]"
                                    :value="calculateOverallScore(page.meta[device].categories)"
                                    size="60px"
                                    font-size="10px"
                                    :color="calculateScoreType(calculateOverallScore(page.meta[device].categories)).color"
                                    track-color="grey-3"
                                    show-value
                                />
                                <span v-else class="q-ml-xs text-warning">Pending</span>
                            </div>
                        </div>
                    </q-item-section>

                    <q-item-section class="col inline-block text-right text-md"></q-item-section>
                </q-item>

                <q-card class="bg-blue-grey-1 q-px-md q-py-sm text-bold text-caption">
                    <q-card-section class>
                        <div>Last page speed checked:</div>
                        <div class="q-my-xs">
                            <q-icon name="desktop_mac" size="20px" color="primary" class="q-mr-sm" />
                            <span>
                                {{
                                page.updated_at.hasOwnProperty('last_page_speed_desktop_checked_at')
                                ? $timestampToDate(page.updated_at.last_page_speed_desktop_checked_at)
                                : 'Pending'
                                }}
                            </span>
                        </div>
                        <div class="q-my-xs">
                            <q-icon
                                name="phone_android"
                                size="20px"
                                color="primary"
                                class="q-mr-sm"
                            />
                            <span>
                                {{
                                page.updated_at.hasOwnProperty('last_page_speed_mobile_checked_at')
                                ? $timestampToDate(page.updated_at.last_page_speed_mobile_checked_at)
                                : 'Pending'
                                }}
                            </span>
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <div
                            class="text-center text-primary text-subtitle1 text-weight-bold q-mb-sm"
                        >Default Results</div>

                        <q-list>
                            <q-item
                                v-for="(key, index) in Object.keys(auditsNaming)"
                                class="shadow-1 q-my-xs"
                                :key="index"
                                clickable
                            >
                                <q-item-section>{{auditsNaming[key]}}</q-item-section>

                                <q-item-section>
                                    <div class="row items-center">
                                        <div
                                            v-for="(device, index) in ['lhr_desktop_result', 'lhr_mobile_result']"
                                            class="q-mx-md"
                                        >
                                            <q-icon
                                                :name="device === 'lhr_desktop_result' ? 'desktop_mac' : 'phone_android'"
                                                size="20px"
                                                color="primary"
                                            />
                                            <span
                                                v-if="page.meta.hasOwnProperty(device) && page.meta[device]"
                                                class="q-mx-xs"
                                                :class="[`text-${calculateScoreType(page.meta[device].audits[key].score * 100).color}`]"
                                            >{{calculateScoreType(page.meta[device].audits[key].score * 100).type}}</span>
                                            <span v-else class="q-ml-xs text-warning">Pending</span>
                                        </div>
                                    </div>
                                </q-item-section>

                                <q-item-section side>
                                    <div class="row items-center">
                                        <div
                                            v-for="(device, index) in ['lhr_desktop_result', 'lhr_mobile_result']"
                                            class="q-mx-md"
                                        >
                                            <q-icon
                                                :name="device === 'lhr_desktop_result' ? 'desktop_mac' : 'phone_android'"
                                                size="20px"
                                                color="primary"
                                            />
                                            <q-circular-progress
                                                v-if="page.meta.hasOwnProperty(device) && page.meta[device]"
                                                class="q-mx-xs"
                                                :class="[`text-${calculateScoreType(page.meta[device].audits[key].score * 100).color}`]"
                                                :value="page.meta[device].audits[key].score * 100"
                                                size="60px"
                                                font-size="10px"
                                                :color="calculateScoreType(page.meta[device].audits[key].score * 100).color"
                                                track-color="grey-4"
                                                show-value
                                            >
                                                {{ page.meta[device].audits[key].displayValue }}
                                            </q-circular-progress>
                                            <span v-else class="q-ml-xs text-warning">Pending</span>
                                        </div>
                                    </div>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card-section>

                    <q-card-section>
                        <div
                            class="text-center text-primary text-subtitle1 text-weight-bold q-mb-md"
                        >Categorized Results</div>

                        <q-item class="shadow-1 q-py-xl" clickable>
                            <div
                                v-for="(cr, index) in ['seo', 'pwa', 'performance', 'best-practices', 'accessibility']"
                                class="col text-center"
                                :key="index"
                            >
                                <div
                                    class="q-mb-md text-primary text-subtitle2"
                                >{{$_.upperFirst($_.lowerCase(cr))}}</div>

                                <div class="row items-center justify-center">
                                    <div
                                        v-for="(device, index) in ['lhr_desktop_result', 'lhr_mobile_result']"
                                        class="q-mx-sm"
                                    >
                                        <q-icon
                                            :name="device === 'lhr_desktop_result' ? 'desktop_mac' : 'phone_android'"
                                            size="20px"
                                            color="primary"
                                        />
                                        <q-circular-progress
                                            v-if="page.meta.hasOwnProperty(device) && page.meta[device]"
                                            class="q-mx-xs"
                                            :class="[`text-${calculateScoreType(page.meta[device].categories[cr].score * 100).color}`]"
                                            :value="page.meta[device].categories[cr].score * 100"
                                            size="60px"
                                            font-size="10px"
                                            :color="calculateScoreType(page.meta[device].categories[cr].score * 100).color"
                                            track-color="grey-3"
                                            show-value
                                        >{{ (page.meta[device].categories[cr].score * 100).toFixed(2)+'%' }}</q-circular-progress>
                                        <span v-else class="q-ml-xs text-warning">Pending</span>
                                    </div>
                                </div>
                            </div>
                        </q-item>
                    </q-card-section>

                    <q-card-section class="text-center">
                        <q-btn
                            color="primary"
                            size="sm"
                            label="Show full result"
                            class="q-mr-md"
                            flat
                            no-caps
                        />
                    </q-card-section>
                </q-card>
            </q-expansion-item>
        </q-list>

        <q-card-section v-if="!pagesSpeedInfo.length" class="text-center q-py-xl">
            <div class="q-mb-lg text-subtitle2">No page found</div>
        </q-card-section>

        <div v-if="pageSpeedListPaginationMeta.last_page > 1" class="q-pa-lg flex flex-center">
            <pagination
                :current_page="pageSpeedListPaginationMeta.current_page"
                :last_page="pageSpeedListPaginationMeta.last_page"
                @handlePagination="pageSpeedListPaginationHandle"
            />
        </div>

        <q-inner-loading color="primary" :showing="!!singleLoader.pageSpeedListLoader" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "components/pagination/Pagination";

export default {
    components: { Pagination },
    name: "PageSpeedList",
    props: {},

    data() {
        return {
            pagesSpeedInfo: [],
            auditsNaming: {
                "first-contentful-paint": "First Contentful Paint",
                "max-potential-fid": "First input Delay"
            }
        };
    },

    mounted() {
        this.getPagesSpeedInfo();

        this.interval = setInterval(() => {
            this.getPagesSpeedInfo();
        }, this.$intervalTime);
    },

    beforeDestroy() {
        this.interval && clearInterval(this.interval);
    },

    computed: {
        ...mapGetters({
            pageSpeedListPaginationMeta: "pages_speed/paginationMeta",
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    methods: {
        getPagesSpeedInfo() {
            this.$singleLoaderTrue("pageSpeedListLoader");

            this.$store
                .dispatch("pages_speed/getPagesSpeed", {
                    vm: this,
                    project_id: this.$route.params.project_id
                })
                .then(res => {
                    this.pagesSpeedInfo = res.data.pageSpeedResults.data;

                    this.$emit(
                        "getPagesSpeedCount",
                        res.data.pageSpeedResults.pagination_meta.total
                    );

                    this.$singleLoaderFalse("pageSpeedListLoader");
                })
                .catch(err => {
                    //handle error
                });
        },

        calculateOverallScore(obj) {
            let score = 0;

            Object.keys(obj).forEach(key => {
                if (obj[key].hasOwnProperty("score")) {
                    score += obj[key].score;
                }
            });

            return _.floor((score / Object.keys(obj).length) * 100, 2);
        },

        calculateScoreType(score) {
            if (!score || score < 45) {
                return {
                    type: "Poor",
                    color: "negative"
                };
            } else if (score < 75) {
                return {
                    type: "Average",
                    color: "warning"
                };
            }

            return {
                type: "Good",
                color: "positive"
            };
        },

        pageSpeedListPaginationHandle(page) {
            this.$refs.pagesItem.forEach(item => {
                item.hide()
            })

            this.$store
                .dispatch("pages_speed/updatePageSpeedListCurrentPage", page)
                .then(() => {
                    this.getPagesSpeedInfo();
                });
        }
    }
};
</script>

<style scoped>
</style>
