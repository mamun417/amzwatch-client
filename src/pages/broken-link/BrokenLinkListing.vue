<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section
                class="bg-primary text-white row justify-between items-center"
            >
                <div class="col">
                    <div class="text-h6">Check Broken Links</div>
                    <div class="text-caption">Project: Test project</div>
                    <div class="text-caption">Domain: exonhost.com</div>
                </div>

                <div class="col text-center">
                    <q-badge color="positive" class="text-subtitle2">
                        Active
                    </q-badge>
                </div>

                <div class="col text-right">
                    <q-btn icon="settings" @click="showModal = !showModal" flat dense/>
                </div>
            </q-card-section>
        </q-card>

        <q-card class="q-mb-xl">
            <q-card-section class="bg-primary row items-center text-white text-subtitle2">
                <div class="col flex items-center">
                    <q-icon name="show_chart" class="q-mr-sm"/>
                    <div>This years chart</div>
                </div>

                <div class="col text-right">
                    <div class="row items-center">
                        <div v-if="showChart" class="col row q-mr-md">
                            <q-select
                                color="white"
                                label="Choose Month"
                                label-color="white"
                                input-class="white"
                                class="col q-mr-md"
                                bg-color="primary"
                                hide-bottom-space
                                dense
                                value=""
                            />
                            <q-select
                                color="white"
                                label="By Year"
                                label-color="white"
                                input-class="white"
                                class="col"
                                style="max-width: 120px"
                                hide-bottom-space
                                dense
                                value=""
                            />
                        </div>

                        <div class="text-right q-py-sm" :class="[showChart ? 'col-auto' : 'col']">
                            <q-btn
                                @click="showChart = !showChart"
                                :icon="showChart ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                                dense flat
                            />
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-card-section v-show="showChart">
                <q-c-chart/>
            </q-card-section>
        </q-card>

        <q-card class="q-mb-xl">
            <q-card-section class="bg-primary row items-center text-white text-subtitle2">
                <div class="col flex items-center">
                    <q-icon name="link_off" class="q-mr-sm"/>
                    <div>Links</div>
                </div>

                <div>
                    <q-badge color="positive">
                        Total: {{ brokenLinkInfo.length }} links
                    </q-badge>
                </div>

                <div class="col text-right">
                    <q-btn
                        @click="showLinks = !showLinks"
                        :icon="showLinks ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                        dense flat
                    />
                </div>
            </q-card-section>

            <q-card-section v-if="showLinks">
                <q-list>
                    <q-item class="q-mb-sm text-subtitle2 text-primary">
                        <q-item-section class="q-ml-md">Link</q-item-section>
                        <q-item-section class="text-center">Status</q-item-section>
                        <q-item-section class="text-right q-mr-md">Last Checked</q-item-section>
                    </q-item>

                    <q-expansion-item
                        v-for="(link, index) in brokenLinkInfo" :key="index"
                        group="brokenLink"
                        icon=""
                        header-class=""
                        expand-icon-class="hidden"
                        class="shadow-3 q-mb-sm"
                    >
                        <q-item
                            slot="header"
                            class="row full-width justify-between text-subtitle2 items-center"
                        >
                            <q-item-section class="col">{{link.url}}</q-item-section>
                            <q-item-section class="col text-center inline-block">
                                <q-badge
                                    :color="link.status === '404' ? 'warning' : 'positive'"
                                >
                                    {{link.status}} - {{link.status === '404' ? 'Not Found' : 'Ok'}}
                                </q-badge>
                            </q-item-section>
                            <q-item-section class="col text-right">
                                {{link.lastUpdated}}
                            </q-item-section>
                        </q-item>

                        <!--                        <q-card>-->
                        <!--                            <q-card-section>-->
                        <!--                                <div class="text-caption text-bold">Last updated at: 10 10 10</div>-->
                        <!--                            </q-card-section>-->
                        <!--                        </q-card>-->
                    </q-expansion-item>
                </q-list>

                <div class="q-pa-lg flex flex-center">
                    <q-pagination
                        :value="3"
                        :max="5"
                    >
                    </q-pagination>
                </div>
            </q-card-section>
        </q-card>

        <q-dialog v-model="showModal">
            <q-card style="min-width: 400px">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Deactivate this service?</div>
                </q-card-section>

                <q-card-section class="text-center q-pa-xl">
                    <div class="text-subtitle1 text-bold q-mb-lg">This service is currently: <span
                        class="text-positive">Active</span></div>

                    <q-btn color="warning" label="Deactivate"/>
                </q-card-section>
            </q-card>
        </q-dialog>
    </section>
</template>

<script>
    import QCChart from "components/charts/QCChart";

    export default {
        components: {QCChart},
        data() {
            return {
                showChart: true,
                showLinks: true,
                showModal: false,

                brokenLinkInfo: [],
            }
        },

        mounted(){
            this.$store.dispatch('broken_links/getBrokenLinks', {vm: this, project_id: this.$route.params.project_id})
                .then(res => {
                    this.brokenLinkInfo = res.data;
                })
                .catch(err => {
                    //handle error
                })
        },
    }
</script>
