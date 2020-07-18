<template>
    <q-btn size="sm" dense flat no-wrap>
        <q-avatar
            text-color="blue-grey-1"
            class="text-weight-bold"
            size="28px"
            icon="notifications"
            rounded
        >
             <q-badge v-if="getUnseenNotifications > 0" color="red" floating>{{ getUnseenNotifications }}</q-badge>
        </q-avatar>

        <q-menu @show="updateNotification">
            <q-infinite-scroll @load="loadNewItems" :offset="75" :disable="disableInfiniteScroll">
                <q-list
                    bordered
                    class="rounded-borders scroll"
                    style="max-width: 350px; min-width:230px"
                >
                    <!-- <q-item-label header>Notifications</q-item-label> -->

                    <div v-for="(item, index) in notifications" :key="index">
                        <q-item class="flex items-center" :class="[item.seen ? '' : 'bg-blue-grey-1']" clickable v-ripple>
                            <q-item-section avatar>
                                <q-icon size="20px" :name="calcServiceIcon(item.service_type)" />
                            </q-item-section>

                            <q-item-section>
                                <q-item-label lines="1">{{calcNotificationTitle(item.service_type)}}</q-item-label>
                                <q-item-label
                                    caption
                                    lines="2"
                                >{{calcNotificationCaption(item.service_type, item.log)}}</q-item-label>
                            </q-item-section>

                            <q-item-section side>{{$moment(item.log.logged_at).fromNow()}}</q-item-section>
                        </q-item>
                        <q-separator />
                    </div>
                </q-list>
                <template v-slot:loading>
                    <div class="row justify-center q-my-md">
                        <q-spinner-dots color="primary" size="40px" />
                    </div>
                </template>
            </q-infinite-scroll>
        </q-menu>
    </q-btn>
</template>

<script>
import { mapGetters } from "vuex";
import { scroll } from "quasar";
const { getScrollPosition, setScrollPosition } = scroll;

export default {
    data() {
        return {
            notifications: [],
            disableInfiniteScroll: true
        };
    },

    mounted() {
        this.getNotifications();
    },

    computed: {
        getUnseenNotifications() {
            return this.notifications.filter(notification => {
                return !notification.seen
            }).length
        },

        ...mapGetters({
            notificationsPaginationMeta: "notifications/paginationMeta",
            singleLoader: "ui/singleLoaderStatus"
        })
    },

    methods: {
        calcServiceIcon(type) {
            if (type === "uptime") {
                return "trending_up";
            }

            return "";
        },
        calcNotificationTitle(type) {
            if (type === "uptime") {
                return "Domain is down";
            }

            return "";
        },
        calcNotificationCaption(type, log) {
            if (type === "uptime") {
                return `Project ${log.user_domain.project_name}'s domain is down`;
            }

            return "";
        },

        loadNewItems(page, loadDone) {},

        getNotifications() {
            this.$singleLoaderTrue("notificationsLoader");
            this.$store
                .dispatch("notifications/getNotifications", {
                    vm: this
                })
                .then(res => {
                    this.notifications = res.data.notifications.data;

                    this.$singleLoaderFalse("notificationsLoader");
                })
                .catch(err => {
                    //handle error
                });
        },

        updateNotification() {
            let unseenNotifications = this.notifications.filter(notification => {
                return !notification.seen
            })

            let ids = unseenNotifications.map(notification => {
                return notification.id
            })

            if (ids.length > 0){
                this.$store
                    .dispatch("notifications/updateNotifications", {
                        vm: this,
                        ids: ids
                    })
                    .then(res => {
                        this.getNotifications()
                    })
                    .catch(err => {
                        //handle error
                    });
            }
        }
    }
};
</script>
