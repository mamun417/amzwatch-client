<template>
    <q-page class="flex flex-center">
        <q-card class="q-pa-lg q-mt-xl" style="min-width: 350px">
            <q-card-section class="text-white">
                <div
                    class="bg-primary text-center q-py-xl shadow-3 border"
                    style="margin-top: -25%; border-radius: 4px"
                >
                    <div class="text-h6">Reset Password</div>
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
                <q-btn color="primary" @click="resetPasswordButtonClicked" flat>
                    Send Email
                </q-btn>
            </q-card-actions>

        </q-card>

        <q-inner-loading color="primary" :showing="!!singleLoader.resetEmailLoader"/>

    </q-page>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: 'Reset-Email',

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
        resetPasswordButtonClicked() {
            this.$singleLoaderTrue('resetEmailLoader');

            this.$store.dispatch('auth/forgotPassword', {vm: this, inputs: this.formData})
                .then(res => {
                    this.$singleLoaderFalse('resetEmailLoader');

                    this.$q.notify({
                        color   : 'positive',
                        message : 'We have e-mailed your password reset link!',
                        position: 'top'
                    });

                    this.formData.email = '';
                })
                .catch(err => {
                    this.$singleLoaderFalse('resetEmailLoader');

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
