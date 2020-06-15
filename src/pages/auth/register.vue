<template>
    <q-page class="flex flex-center">
        <q-card class="q-pa-lg q-mt-xl" style="min-width: 350px">
            <q-card-section class="text-white">
                <div
                    class="bg-primary text-center q-py-xl shadow-3 border"
                    style="margin-top: -25%; border-radius: 4px"
                >
                    <div class="text-h6">Register</div>
                    <!--                    or social login-->
                </div>
            </q-card-section>

            <q-card-section>
                <div class="q-px-sm">
                    <div class="row">
                        <q-input v-model="formData.first_name" label="First Name" class="col q-mb-sm q-mr-md"
                                 no-error-icon hide-bottom-space
                                 :error-message="formErrors.first_name" :error="!!formErrors.first_name"
                                 @input="formErrors.first_name = ''">
                            <q-icon name="perm_identity" slot="append"/>
                        </q-input>

                        <q-input v-model="formData.last_name" label="Last Name" class="col q-mb-sm" no-error-icon
                                 hide-bottom-space
                                 :error-message="formErrors.last_name" :error="!!formErrors.last_name"
                                 @input="formErrors.last_name = ''">
                            <q-icon name="perm_identity" slot="append"/>
                        </q-input>
                    </div>

                    <q-input v-model="formData.address" label="Address" class="q-mb-sm">
                        <q-icon name="home" slot="append"/>
                    </q-input>

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

                <div class="q-mt-sm">
                    <q-checkbox v-model="formData.agree" label="I agree to the terms and conditions." color="primary"/>
                </div>

            </q-card-section>

            <q-card-actions align="around">
                <q-btn color="primary" @click="registerButtonClicked" :disable="!formData.agree" flat>Get Started
                </q-btn>
            </q-card-actions>
        </q-card>

        <q-inner-loading color="primary" :showing="!!singleLoader.registerLoader"/>

    </q-page>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: 'Register',

    data() {
        return {
            formData  : {
                first_name      : 'John',
                last_name       : 'Doe',
                address         : 'exonhost',
                email           : 'testjohn@example.com',
                password        : '123',
                confirm_password: '123',
                agree           : false
            },
            formErrors: {}
        }
    },

    computed: {
        ...mapGetters({
            singleLoader : 'ui/singleLoaderStatus'
        })
    },

    methods: {
        registerButtonClicked() {

            this.$singleLoaderTrue('registerLoader');
            this.$forceUpdate();

            this.$store.dispatch('auth/register', {vm: this, inputs: this.formData})
                .then(res => {
                    this.$singleLoaderFalse('registerLoader');
                    this.$forceUpdate();

                    this.$q.notify({
                        color   : 'positive',
                        message : 'Registration Successful',
                        position: 'top'
                    })

                    this.$router.push('/');
                })
                .catch(err => {
                    this.$singleLoaderFalse('registerLoader');
                    this.$forceUpdate();

                    this.formErrors = err.response.data.errors;
                })
        }
    }
}
</script>
