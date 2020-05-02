<template>
    <q-list>
        <q-item class="q-mb-sm text-subtitle2 text-primary">
            <q-item-section class="q-ml-md">Link</q-item-section>
            <q-item-section class="text-center">Hosted Link</q-item-section>
            <q-item-section class="text-right q-mr-md">Status</q-item-section>
        </q-item>

        <q-expansion-item
            v-for="(guest, index) in guestLinksInfo" :key="index"
            group="guestPost"
            icon=""
            header-class=""
            expand-icon-class="hidden"
            class="shadow-3 q-mb-sm">

            <q-item
                slot="header"
                class="row full-width justify-between text-subtitle2 items-center">
                <q-item-section class="col">{{guest.url}}</q-item-section>
                <q-item-section class="col">
                    {{guest.remoteUrl}}
                </q-item-section>
                <q-item-section class="col inline-block text-right">
                    <q-badge
                        :color="guest.status === '404' ? 'warning' : 'positive'">
                        {{guest.status}} - {{guest.status === '404' ? 'unavailable' : 'available'}}
                    </q-badge>
                </q-item-section>
            </q-item>

            <q-card>
                <q-card-section>
                    <div class="text-caption text-bold">Last updated at: {{guest.lastUpdated}}</div>
                </q-card-section>
            </q-card>
        </q-expansion-item>
    </q-list>
</template>

<script>
    export default {
        name: "GuestLinksList",
        props: {
            getGuestLinksCount: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                guestLinksInfo: []
            }
        },

        mounted() {
            this.getGuestLinks();
        },

        methods: {
            getGuestLinks() {
                this.$store.dispatch('guest_links/getGuestLinks', {
                    vm: this,
                    project_id: this.$route.params.project_id
                })
                    .then(res => {
                        this.guestLinksInfo = res.data;

                        if (this.getGuestLinksCount){
                            this.$emit('getGuestLinksCount', res.data.length);
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
