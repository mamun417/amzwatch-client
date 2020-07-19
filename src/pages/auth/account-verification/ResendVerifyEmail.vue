<template>
    <q-page class="flex flex-center">
        <q-card class="q-pa-lg q-mt-xl" style="min-width: 350px">
            <q-card-section class="text-white">
                <div
                    class="bg-primary text-center q-py-xl shadow-3 border"
                    style="margin-top: -25%; border-radius: 4px"
                >
                    <div class="text-h6">Verify Your Email Address</div>
                </div>
            </q-card-section>

            <q-card-section>
                <div class="q-px-sm">
                    <q-input v-model="formData.email" label="Email" class="q-mb-sm" no-error-icon hide-bottom-space
                             :error-message="formErrors.email" :error="!!formErrors.email"
                             @input="formErrors.email = ''">
                        <q-icon name="email" slot="append"/>
                    </q-input>
                </div>
            </q-card-section>

            <q-card-actions align="around">
                <q-btn color="primary" @click="sendEmailButtonClicked" flat>
                    Send Email
                </q-btn>
            </q-card-actions>

        </q-card>

        <q-inner-loading color="primary" :showing="!!singleLoader.resendVerifyEmailLoader"/>

    </q-page>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: 'Resend-Verify-Email',

    data() {
        return {
            formData  : {
                email : ''
            },
            formErrors: {},
        }
    },

    computed: {
        ...mapGetters({
            singleLoader : 'ui/singleLoaderStatus'
        })
    },

    methods: {
        sendEmailButtonClicked() {
            this.$singleLoaderTrue('resendVerifyEmailLoader');

            this.$store.dispatch('auth/resendVerifyEmail', {vm: this, inputs: this.formData})
                .then(res => {
                    this.$singleLoaderFalse('resendVerifyEmailLoader');

                    if (res.data.already_verify){
                        this.$q.notify({
                            color   : 'positive',
                            message : 'Your account already verified, You can login now.',
                            position: 'top'
                        });

                        this.$router.push({name: 'login'});
                        return
                    }

                    this.$q.notify({
                        color   : 'positive',
                        message : 'A fresh verification link has been sent to your email address.',
                        position: 'top'
                    });

                    this.formData.email = '';
                })
                .catch(err => {
                    this.$singleLoaderFalse('resendVerifyEmailLoader');

                    if (!err.response.data.errors) {
                        this.$q.notify({
                            color   : 'negative',
                            message : err.response.data.message,
                            position: 'top'
                        })
                    } else {
                        this.formErrors = err.response.data.errors
                    }
                })
        }
    }
}
</script>
