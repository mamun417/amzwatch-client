<template>
    <q-inner-loading color="primary" :showing="!!singleLoader.successVerifyEmailLoader"/>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: 'Verify',

    data() {
        return {
            token: this.$route.params.token
        }
    },

    computed: {
        ...mapGetters({
            singleLoader : 'ui/singleLoaderStatus'
        })
    },

    mounted() {
        this.verifyAccount();
    },

    methods: {
        verifyAccount(){
            this.$singleLoaderTrue('successVerifyEmailLoader');

            this.$store.dispatch('auth/successVerifyEmail', {
                vm: this,
                inputs: {
                    token: this.token
                }
            })
                .then(res => {
                    this.$singleLoaderFalse('successVerifyEmailLoader');

                    if (res.data.token_expired){
                        this.$q.notify({
                            color   : 'negative',
                            message : 'your token has been expired',
                            position: 'top'
                        });

                        this.$router.push({name: 'verify'}); return
                    }

                    this.$q.notify({
                        color   : 'positive',
                        message : 'Your account verification successful, You can login now.',
                        position: 'top'
                    });

                    this.$router.push({name: 'login'});
                })
                .catch(err => {
                    this.$singleLoaderFalse('successVerifyEmailLoader');

                    this.$q.notify({
                        color   : 'negative',
                        message : err.response.data.message,
                        position: 'top'
                    })

                    this.$router.push({name: 'verify'})
                })
        }
    }
}
</script>
