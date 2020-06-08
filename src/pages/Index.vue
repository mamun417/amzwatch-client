<template>
    <div>
       <!-- Coming Soon!!-->

        <div class="q-pa-md row items-start q-gutter-md">
            <q-card class="my-card" v-for="item in items">
                <q-item clickable>
                    <q-item-section avatar>
                        <q-icon size="80px" color="primary" name="message"/>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>New messages</q-item-label>
                        <q-item-label>200</q-item-label>
                    </q-item-section>
                </q-item>

                <q-card-actions align="right" style="margin-top: -50px">
                    <q-btn dense flat round color="red">12</q-btn>
                    <q-btn dense flat round color="teal">20</q-btn>
                </q-card-actions>

            </q-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageIndex',

    data() {
        return {
            items : [1,2,3,4,5,6,7,8]
        }
    },

    created() {
        this.$get('/me')
    }
}
</script>
<style lang="sass" scoped>
    .my-card
        width: 100%
        max-width: 300px
</style>

