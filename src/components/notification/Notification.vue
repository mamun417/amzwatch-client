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
            <q-list bordered class="rounded-borders q-pb-lg" style="max-width: 350px">
                <q-item-label header>Notifications</q-item-label>

                <div v-for="n in 6">
                    <q-item clickable v-ripple>
                        <q-item-section avatar>
                            <q-avatar>
                                <img src="https://cdn.quasar.dev/img/avatar2.jpg">
                            </q-avatar>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label lines="1">Brunch this weekend?</q-item-label>
                            <q-item-label caption lines="2">
                                I'll be in your neighborhood doing errands this
                                weekend. Do you want to grab brunch?
                            </q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                            1 min ago
                        </q-item-section>
                    </q-item>
                    <q-separator inset="item"/>
                </div>
            </q-list>

            <q-inner-loading color="primary" :showing="loading"/>

        </q-menu>
    </q-btn>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                loading: false
            }
        },

        computed: {
            ...mapGetters({
                userInfo: 'auth/user'
            })
        },
    }
</script>
