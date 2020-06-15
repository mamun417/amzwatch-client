<template>
    <q-btn size="sm" dense flat no-wrap>
        <q-avatar
            text-color="blue-grey-1"
            class="text-weight-bold"
            size="28px"
            icon="notifications"
            rounded
        >
            <q-badge color="red" floating>2</q-badge>
        </q-avatar>

        <q-menu>
            <q-list id="itemSection" bordered class="rounded-borders q-pb-lg scroll" style="max-width: 350px;height: 300px">
                <q-item-label header>Notifications</q-item-label>

                <div v-for="(item, index) in brokenLinkInfo">
                    <q-item v-for="n in 4" clickable v-ripple>
                        <q-item-section avatar>
                            <q-avatar>
                                <img src="https://cdn.quasar.dev/img/avatar2.jpg">
                            </q-avatar>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label lines="1">{{ item.url }}</q-item-label>
                            <q-item-label lines="1">Brunch this weekend?</q-item-label>
                            <q-item-label caption lines="2">
                                {{ item.url }}
                                I'll be in your neighborhood doing errands this
                                weekend. Do you want to grab brunch?
                            </q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                            1 min ago {{ index }}
                        </q-item-section>
                    </q-item>
                    <q-separator inset="item"/>
                </div>
                <q-scroll-observer @scroll="loadNewItems" />
            </q-list>

            <q-inner-loading color="primary" :showing="loading"/>

        </q-menu>
    </q-btn>
</template>

<script>
    import {mapGetters} from 'vuex'
    import { scroll } from 'quasar'
    const { getScrollPosition, setScrollPosition } = scroll

    export default {
        data() {
            return {
                brokenLinkInfo: [],
                loading: false,
                page: 1
            }
        },

        mounted() {
            this.getNotificationsInfo();
        },

        computed: {
            ...mapGetters({
                notificationsPaginationMeta: 'notifications/paginationMeta',
                singleLoader         : 'ui/singleLoaderStatus'
            })
        },

        methods: {
            loadNewItems(info){

                if(info.position > 30) {

                    if ((this.notificationsPaginationMeta.current_page + 1) > this.notificationsPaginationMeta.last_page){
                        return false;
                    }

                    this.page += 1;
                    this.notificationsPaginationHandle(this.page);
                }
            },

            getNotificationsInfo() {


            },

            notificationsPaginationHandle(page) {
                //console.log(page)
                this.$store.dispatch('notifications/updateNotificationsCurrentPage', page)
                    .then(() => {
                        this.getNotificationsInfo()
                    })
            }
        }
    }
</script>
