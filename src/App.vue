<template>
    <div id="q-app">
        <router-view/>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'App',
        computed: {
            ...mapGetters({
                isLoggedIn: "auth/isLoggedIn",
            })
        },

        mounted() {
            if (this.isLoggedIn){
                this.getUserInfo();
            }
        },

        methods: {
            getUserInfo() {
                this.$store.dispatch('auth/getUserInfo', {
                    vm: this
                })
                    .then(res => {
                        this.$store.dispatch('auth/updateUserInfo', {
                            vm: this,
                            user: res.data
                        })
                    })
            }
        }
    }
</script>
