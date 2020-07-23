<template>
    <div id="q-app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App',

        mounted() {
            this.getUserInfo();
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
