<template>
    <q-list>
        <q-item class="q-mb-sm text-subtitle2 text-primary">
            <q-item-section class="q-ml-md">Page Url</q-item-section>
            <q-item-section class="text-center">Overall result</q-item-section>
            <q-item-section class="text-right q-mr-md"></q-item-section>
        </q-item>

        <q-expansion-item
            v-for="(page, index) in pagesSpeedInfo" :key="index"
            group="amzProduct"
            icon=""
            header-class=""
            expand-icon-class="hidden"
            class="shadow-3 q-mb-sm"
        >
            <q-item
                slot="header"
                class="row full-width justify-between text-subtitle2 items-center"
            >
                <!--                {{page}}-->
                <q-item-section class="col">
                    {{page.url}}
                </q-item-section>

                <q-item-section class="col text-center">
                    <div
                        v-if="!page.hasOwnProperty('meta')"
                    >
                        Page is in pending state
                    </div>
                    <div v-else class="row items-center justify-center">
                        <div class="q-mx-md">
                            <q-icon name="desktop_mac" size="20px" color="primary"/>
                            <q-circular-progress
                                v-if="page.meta.hasOwnProperty('lhr_desktop_result') && page.meta.lhr_desktop_result"
                                class="text-primary q-mx-xs"
                                :value="calculateOverallScore(page.meta.lhr_desktop_result.categories)"
                                size="40px"
                                color="primary"
                                track-color="grey-3"
                                show-value
                            />
                            <div v-else>Pending</div>
                        </div>
                        <div class="q-mx-md">
                            <q-icon name="phone_android" size="20px" color="primary"/>
                            <q-circular-progress
                                v-if="page.meta.hasOwnProperty('lhr_mobile_result') && page.meta.lhr_mobile_result"
                                class="text-primary q-mx-xs"
                                value="10"
                                size="40px"
                                color="primary"
                                track-color="grey-3"
                                show-value
                            />
                            <span v-else class="text-sm text-warning">Pending</span>
                        </div>
                    </div>
                </q-item-section>

                <q-item-section class="col inline-block text-right text-md">

                </q-item-section>
            </q-item>

            <q-card class="bg-blue-grey-1 q-px-md q-py-sm text-bold text-caption">
                <q-card-section class="">
                    <div>Last page speed checked:</div>
                    <div class="q-my-xs">
                        <q-icon name="desktop_mac" size="20px" color="primary" class="q-mr-sm"/>
                        <span>{{
                            page.updated_at.hasOwnProperty('last_page_speed_desktop_checked_at')
                            ? $timestampToDate(page.updated_at.last_page_speed_desktop_checked_at)
                            : 'Pending'
                            }}
                        </span>
                    </div>
                    <div class="q-my-xs">
                        <q-icon name="phone_android" size="20px" color="primary" class="q-mr-sm"/>
                        <span>{{
                            page.updated_at.hasOwnProperty('last_page_speed_mobile_checked_at')
                            ? $timestampToDate(page.updated_at.last_page_speed_mobile_checked_at)
                            : 'Pending'
                            }}
                        </span>
                    </div>
                </q-card-section>

                <div class="text-center">
                    <q-btn
                        color="primary"
                        size="sm"
                        label="Show full result"
                        class="q-mr-md"
                        flat
                        no-caps
                    />
                </div>
            </q-card>
        </q-expansion-item>
    </q-list>
</template>

<script>
    export default {
        components: {},
        name      : "PageSpeedList",
        props     : {},

        data() {
            return {
                pagesSpeedInfo: []
            }
        },

        mounted() {
            this.getPagesSpeedInfo();
        },

        methods: {
            getPagesSpeedInfo() {
                this.$store.dispatch('pages_speed/getPagesSpeed', {
                    vm        : this,
                    project_id: this.$route.params.project_id
                })
                    .then(res => {
                        this.pagesSpeedInfo = res.data.pageSpeedResults.data;

                        this.$emit('getPagesSpeedCount', res.data.pageSpeedResults.pagination_meta.total);
                    })
                    .catch(err => {
                        //handle error
                    });
            },

            calculateOverallScore(obj) {
                let score = 0;

                Object.keys(obj).forEach(key => {
                    if (obj[key].hasOwnProperty('score')) {
                        score += obj[key].score
                    }
                })

                return _.floor((score / Object.keys(obj).length) * 100, 2)
            }
        }
    }
</script>

<style scoped>

</style>
