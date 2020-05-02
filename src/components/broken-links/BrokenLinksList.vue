<template>
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
            class="shadow-3 q-mb-sm">
            <q-item
                slot="header"
                class="row full-width justify-between text-subtitle2 items-center">
                <q-item-section class="col">img</q-item-section>
                <q-item-section class="col text-center inline-block">
                    <q-badge
                        :color="link.status === '404' ? 'warning' : 'positive'">
                        {{link.status}} - {{link.status === '404' ? 'unavailable' : 'available'}}
                    </q-badge>
                </q-item-section>
                <q-item-section class="col text-right">
                    {{link.lastUpdated}}
                </q-item-section>
            </q-item>
        </q-expansion-item>
    </q-list>
</template>

<script>
    export default {
        name: "BrokenLinksList",
        props: {
            getBrokenLinksCount: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                brokenLinkInfo: []
            }
        },

        mounted() {
            this.getBrokenLinkInfo();
        },

        methods: {
            getBrokenLinkInfo() {
                this.$store.dispatch('broken_links/getBrokenLinks', {
                    vm: this,
                    project_id: this.$route.params.project_id
                })
                    .then(res => {
                        this.brokenLinkInfo = res.data;

                        if (this.getBrokenLinksCount){
                            this.$emit('getBrokenLinksCount', res.data.length);
                        }
                    })
                    .catch(err => {
                        //handle error
                    })
            }
        }
    }
</script>

<style scoped>

</style>
