<template>
    <q-page class="flex flex-center">
        <q-card class="q-pa-lg q-mt-xl" style="min-width: 350px">
            <q-card-section class="text-white">
                <div
                    class="bg-primary text-center q-py-xl shadow-3 border"
                    style="margin-top: -25%; border-radius: 4px"
                >
                    <div class="text-h6">Reset</div>
                </div>
            </q-card-section>

            <q-card-section>
                <div class="q-px-sm">
                    <q-input v-model="formData.email" label="Email" class="q-mb-sm" no-error-icon hide-bottom-space
                         :error-message="formErrors.email" :error="!!formErrors.email"
                         @input="formErrors.email = ''">
                        <q-icon name="email" slot="append"/>
                    </q-input>
                    <q-input v-model="formData.password" type="password" label="Password" class="q-mb-sm" no-error-icon
                         hide-bottom-space
                         :error-message="formErrors.password" :error="!!formErrors.password"
                         @input="formErrors.password = ''">
                        <q-icon name="lock" slot="append"/>
                    </q-input>
                    <q-input v-model="formData.confirm_password" type="password" label="Confirm Password"
                         class="q-mb-sm">
                        <q-icon name="lock" slot="append"/>
                    </q-input>
                </div>
            </q-card-section>

            <q-card-actions align="around">
                <q-btn color="primary" @click="resetPasswordButtonClicked" flat>
                    Reset Password
                </q-btn>
            </q-card-actions>
        </q-card>

        <q-inner-loading color="primary" :showing="!!singleLoader.resetPasswordLoader"/>

    </q-page>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: 'Reset-Password',

        data() {
            return {
                formData  : {
                    token: this.$route.params.token,
                    email : '',
                    password : '',
                    confirm_password: '',
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
                this.$singleLoaderTrue('resetPasswordLoader');

                this.$store.dispatch('auth/resetPassword', {vm: this, inputs: this.formData})
                    .then(res => {
                        this.$singleLoaderFalse('resetPasswordLoader');

                        this.$q.notify({
                            color   : 'positive',
                            message : 'Password reset Successful',
                            position: 'top'
                        });

                        this.$store.dispatch('auth/login', {
                            vm: this,
                            inputs: this.formData
                        }).then(() => {
                            this.$router.push('/projects');
                        }).catch(err => {
                            //
                        });
                    })
                    .catch(err => {
                        this.$singleLoaderFalse('resetPasswordLoader');

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
