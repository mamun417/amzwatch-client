<template>
    <div class="row q-gutter-xl q-mt-lg">
        <q-card class="col">
            <q-card-section class="q-py-sm text-subtitle1">Latest Issues</q-card-section>
            <q-separator />

            <q-list v-if="latestIssues.length" class="q-pa-md" dense>
                <q-item
                    v-for="(issue, index) in latestIssues"
                    class="q-mb-sm shadow-1 text-weight-medium text-md"
                    :key="index"
                    clickable
                >
                    <q-item-section style="overflow-wrap: anywhere">{{ issue.service_type }}</q-item-section>

                    <q-item-section side no-wrap>{{ $fromNowTime(issue.logged_at) }}</q-item-section>
                </q-item>
            </q-list>

            <div v-else class="text-center q-py-md text-weight-bold">No issue found</div>

            <q-inner-loading color="primary" :showing="!!singleLoader.latestIssuesLoader" />
        </q-card>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "latest-issues",

    data() {
        return {
            latestIssues: []
        };
    },

    computed: {
        ...mapGetters({
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    mounted() {
        this.getLatestIssues();
    },

    methods: {
        getLatestIssues() {
            this.$singleLoaderTrue("latestIssuesLoader");

            this.$store
                .dispatch("notifications/getLatestIssues", {
                    vm: this
                })
                .then(res => {
                    this.latestIssues = res.data.latestIssues.data;

                    this.$singleLoaderFalse("latestIssuesLoader");
                })
                .catch(err => {
                    //handle error
                });
        }
    }
};
</script>

<style scoped>
</style>
