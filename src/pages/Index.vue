<template>
    <div class="q-pa-xl">
        <div class="row items-start q-gutter-xl justify-between">
            <q-card style="min-width: 250px" class="col">
                <q-card-section class="row items-center">
                    <q-icon color="primary" name="settings" size="50px" />
                    <div class="text-subtitle1 text-weight-bold text-right col">
                        <div class="text-grey-7">Total Projects</div>
                        <div
                            class="text-primary"
                        >{{ handleCount(projectsCount, ['active', 'inactive']) }}</div>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="row justify-between q-pa-xs">
                    <q-btn
                        color="positive"
                        class="q-px-xs"
                        no-caps
                        flat
                        dense
                    >{{ handleCount(projectsCount, ['active']) }} Active</q-btn>

                    <q-btn color="warning" class="q-px-xs" no-caps flat dense>
                        <div>{{ handleCount(projectsCount, ['inactive']) }} Inactive</div>

                        <q-menu v-if="handleCount(projectsCount, ['inactive']) > 0">
                            <q-list
                                v-for="(group, key) in projectsCount"
                                class
                                style="min-width: 230px"
                                :key="key"
                                dense
                            >
                                <q-item
                                    v-if="handleCount([group], ['inactive'])"
                                    class="text-weight-medium"
                                    @click="handleProjectRedirect({s:group.user_domain.project_name, f: 'inactive'})"
                                    clickable
                                >
                                    <q-item-section>{{group.user_domain.project_name}}</q-item-section>
                                    <q-item-section class="text-right text-warning">Inactive</q-item-section>
                                </q-item>

                                <q-separator />
                            </q-list>
                        </q-menu>
                    </q-btn>
                </q-card-section>
                <q-inner-loading color="primary" :showing="!!singleLoader.projectsCountLoader" />
            </q-card>

            <q-card style="min-width: 250px" class="col">
                <q-card-section class="row items-center">
                    <q-icon color="primary" name="link_off" size="50px" />
                    <div class="text-subtitle1 text-weight-bold text-right col">
                        <div class="text-grey-7">Total Links Scraped</div>
                        <div
                            class="text-primary"
                        >{{ handleCount(pagesCount, ['available', 'status_404', 'other_error']) }}</div>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="row justify-between q-pa-xs">
                    <q-btn
                        color="positive"
                        class="q-px-xs"
                        no-caps
                        flat
                        dense
                    >{{ handleCount(pagesCount, ['available']) }} Available</q-btn>

                    <q-btn color="warning" class="q-px-xs" no-caps flat dense>
                        <div>{{ handleCount(pagesCount, ['status_404', 'other_error']) }} Problems</div>

                        <q-menu v-if="handleCount(pagesCount, ['status_404', 'other_error']) > 0">
                            <q-list
                                v-for="(group, key) in pagesCount"
                                class
                                style="min-width: 230px"
                                :key="key"
                                dense
                            >
                                <q-item class="text-weight-medium">
                                    <q-item-section>{{group.user_domain.project_name}}</q-item-section>
                                    <q-item-section
                                        class="text-right text-warning"
                                    >Total {{handleCount([group], ['status_404', 'other_error'])}}</q-item-section>
                                </q-item>

                                <q-item
                                    v-if="individualErrorCount(group, 'status_404') > 0"
                                    clickable
                                >
                                    <q-item-section class="q-pl-md">404 errors</q-item-section>
                                    <q-item-section
                                        class="text-right text-warning"
                                    >{{individualErrorCount(group, 'status_404')}}</q-item-section>
                                </q-item>
                                <q-item
                                    v-if="individualErrorCount(group, 'other_error') > 0"
                                    clickable
                                >
                                    <q-item-section class="q-pl-md">Other errors</q-item-section>
                                    <q-item-section
                                        class="text-right text-warning"
                                    >{{individualErrorCount(group, 'other_error')}}</q-item-section>
                                </q-item>

                                <q-separator />
                            </q-list>
                        </q-menu>
                    </q-btn>
                </q-card-section>
                <q-inner-loading color="primary" :showing="!!singleLoader.pagesCountLoader" />
            </q-card>

            <q-card style="min-width: 250px" class="col">
                <q-card-section class="row items-center">
                    <q-icon color="primary" name="link_off" size="50px" />
                    <div class="text-subtitle1 text-weight-bold text-right col">
                        <div class="text-grey-7">Total Products Scraped</div>
                        <div
                            class="text-primary"
                        >{{ handleCount(productsCount, ['available', 'unavailable', 'status_404', 'other_error']) }}</div>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="row justify-between q-pa-xs">
                    <q-btn
                        color="positive"
                        class="q-px-xs"
                        no-caps
                        flat
                        dense
                    >{{ handleCount(productsCount, ['available']) }} Available</q-btn>

                    <q-btn color="warning" class="q-px-xs" no-caps flat dense>
                        <div>{{ handleCount(pagesCount, ['unavailable','status_404', 'other_error']) }} Problems</div>

                        <q-menu
                            v-if="handleCount(productsCount, ['unavailable','status_404', 'other_error']) > 0"
                        >
                            <q-list
                                v-for="(group, key) in productsCount"
                                class
                                style="min-width: 230px"
                                :key="key"
                                dense
                            >
                                <q-item class="text-weight-medium">
                                    <q-item-section>{{group.user_domain.project_name}}</q-item-section>
                                    <q-item-section
                                        class="text-right text-warning"
                                    >Total {{handleCount([group], ['status_404', 'other_error'])}}</q-item-section>
                                </q-item>

                                <q-item
                                    v-if="individualErrorCount(group, 'unavailable') > 0"
                                    clickable
                                >
                                    <q-item-section no-wrap class="q-pl-md">Unavailable errors</q-item-section>
                                    <q-item-section
                                        class="text-right text-warning"
                                    >{{individualErrorCount(group, 'unavailable')}}</q-item-section>
                                </q-item>
                                <q-item
                                    v-if="individualErrorCount(group, 'status_404') > 0"
                                    clickable
                                >
                                    <q-item-section class="q-pl-md">404 errors</q-item-section>
                                    <q-item-section
                                        class="text-right text-warning"
                                    >{{individualErrorCount(group, 'status_404')}}</q-item-section>
                                </q-item>
                                <q-item
                                    v-if="individualErrorCount(group, 'other_error') > 0"
                                    clickable
                                >
                                    <q-item-section class="q-pl-md">Other errors</q-item-section>
                                    <q-item-section
                                        class="text-right text-warning"
                                    >{{individualErrorCount(group, 'other_error')}}</q-item-section>
                                </q-item>

                                <q-separator />
                            </q-list>
                        </q-menu>
                    </q-btn>
                </q-card-section>
                <q-inner-loading color="primary" :showing="!!singleLoader.productsCountLoader" />
            </q-card>
        </div>

        <latest-issues />

        <div class="row q-gutter-xl q-mt-md">
            <latest-scraped-pages />
            <latest-parsed-pages />
        </div>
        <div class="row q-gutter-xl q-mt-md">
            <latest-scraped-products />
            <latest-parsed-products />
        </div>
    </div>
</template>

<script>
import LatestIssues from "components/issues/LatestIssues";
import LatestScrapedPages from "components/issues/LatestScrapedPages";
import LatestParsedPages from "components/issues/LatestParsedPages";
import LatestScrapedProducts from "components/issues/LatestScrapedProducts";
import LatestParsedProducts from "components/issues/LatestParsedProducts";
import { mapGetters } from "vuex";

export default {
    name: "PageIndex",
    components: {
        LatestParsedProducts,
        LatestScrapedProducts,
        LatestParsedPages,
        LatestScrapedPages,
        LatestIssues
    },

    data() {
        return {
            projectsCount: [],
            pagesCount: [],
            productsCount: []
        };
    },

    computed: {
        ...mapGetters({
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    mounted() {
        this.getProjectsCount();
        this.getPagesCount();
        this.getProductsCount();
    },

    methods: {
        handleCount(datas, contains) {
            let total = 0;

            datas.forEach(data => {
                Object.keys(data).forEach(objKey => {
                    if (contains.includes(objKey)) {
                        total += data[objKey];
                    }
                });
            });

            return total;
        },
        individualErrorCount(data, keyName) {
            if (data.hasOwnProperty(keyName)) {
                return data[keyName];
            }

            return 0;
        },
        getProjectsCount() {
            this.$singleLoaderTrue("projectsCountLoader");

            this.$store
                .dispatch("counts/getProjectsCount", {
                    vm: this
                })
                .then(res => {
                    this.projectsCount = res.data.projectsCount.data;

                    this.$singleLoaderFalse("projectsCountLoader");
                })
                .catch(err => {
                    //handle error
                });
        },
        getPagesCount() {
            this.$singleLoaderTrue("pagesCountLoader");

            this.$store
                .dispatch("counts/getPagesCount", {
                    vm: this
                })
                .then(res => {
                    this.pagesCount = res.data.pagesCount.data;

                    this.$singleLoaderFalse("pagesCountLoader");
                })
                .catch(err => {
                    //handle error
                });
        },
        getProductsCount() {
            this.$singleLoaderTrue("productsCountLoader");

            this.$store
                .dispatch("counts/getProductsCount", {
                    vm: this
                })
                .then(res => {
                    this.productsCount = res.data.productsCount.data;

                    this.$singleLoaderFalse("productsCountLoader");
                })
                .catch(err => {
                    //handle error
                });
        },

        handleProjectRedirect(pipeline) {
            this.$store
                .dispatch("projects/updateProjectsPipeline", {
                    vm: this,
                    pipeline: pipeline
                })
                .then(() => {
                    this.$router.push("/projects");
                });
        }
    }
};
</script>
