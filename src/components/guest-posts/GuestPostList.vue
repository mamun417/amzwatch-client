<template>
    <q-list>
        <q-item class="q-mb-sm text-subtitle2 text-primary">
            <q-item-section class="q-ml-md">Link</q-item-section>
            <q-item-section class="text-center">Hosted Link</q-item-section>
            <q-item-section class="text-right q-mr-md">Status</q-item-section>
        </q-item>

        <q-expansion-item
            v-for="(guestPostInfo, index) in guestPostsInfo" :key="index"
            group="guestPost"
            icon=""
            header-class=""
            expand-icon-class="hidden"
            class="shadow-1 q-mb-sm">

            <q-item
                slot="header"
                class="row full-width justify-between text-subtitle2 items-center">
                <q-item-section class="col">{{ guestPostInfo.guest_post_url }}</q-item-section>
                <q-item-section class="col text-center">{{ guestPostInfo.holding_url }}</q-item-section>
                <q-item-section class="col inline-block text-right">
                    <q-badge
                        :color="guestPostInfo.link_infos.exists !== '1' ? 'warning' : 'positive'"
                    >
                        {{ guestPostInfo.link_infos.exists !== '1' ? 'unavailable' : 'available' }}
                    </q-badge>
                </q-item-section>
            </q-item>

            <q-card>
                <q-card-section>
                    <div class="text-caption text-bold">
                        Last updated at: {{ $timestampToDate(guestPostInfo.updated_at.link_last_checked_at) }}
                    </div>
                </q-card-section>
            </q-card>
        </q-expansion-item>
    </q-list>
</template>

<script>
    export default {
        name : "GuestLinksList",
        props: {
            getGuestPostsCount: {
                type   : Boolean,
                default: false
            }
        },
        data() {
            return {
                guestPostsInfo: []
            }
        },

        mounted() {
            this.getGuestLinks();
        },

        methods: {
            getGuestLinks() {
                this.$store.dispatch('guest_links/getGuestPosts', {
                    vm        : this,
                    project_id: this.$route.params.project_id
                })
                    .then(res => {
                        this.guestPostsInfo = res.data.linksInGuestPosts.data;

                        this.$emit('getGuestLinksCount', res.data.linksInGuestPosts.pagination_meta.total);
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
