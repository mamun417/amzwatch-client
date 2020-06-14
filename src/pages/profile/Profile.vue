<template>
    <div class="row justify-center q-mt-xl">
        <q-card style="max-width: 650px" class="col q-pa-xl q-mt-xl">
            <q-card-actions class="row justify-center">
                <q-avatar
                    color="primary"
                    text-color="blue-grey-1"
                    icon="person"
                    size="128px"
                    class="absolute"
                    style="transform: translateY(-50%); top: 0"
                    round>
                </q-avatar>

                <q-btn
                    v-if="!profileEditSelected"
                    size="sm"
                    icon="edit"
                    text-color="primary"
                    class="absolute"
                    style="right: 0; top: 0; transform: translate3d(50%, -50%, 0)"
                    @click="profileEditSelected = true"
                    round
                />
            </q-card-actions>

            <q-card-section v-if="!profileEditSelected" class="q-mt-lg">
                <div class="text-center text-subtitle1 text-weight-bold text-primary">{{ formData.first_name + ' ' + formData.last_name }}</div>
                <div class="text-center text-md">{{ formData.email }}</div>
                <div class="text-center text-md">{{ formData.address }}</div>

                <div class="text-center q-mt-md">{{ formData.about_me }}</div>
            </q-card-section>

            <q-card-section v-else class="q-mt-lg">
                <div class="q-mb-xl">
                    <div class="row">
                        <q-input
                            v-model="formData.first_name" label="First Name" class="col q-mb-sm q-mr-md"
                            no-error-icon hide-bottom-space
                            :error-message="formErrors.first_name" :error="!!formErrors.first_name"
                            @input="formErrors.first_name = ''">
                            <q-icon name="perm_identity" slot="append"/>
                        </q-input>

                        <q-input
                            v-model="formData.last_name" label="Last Name" class="col q-mb-sm" no-error-icon
                            hide-bottom-space
                            :error-message="formErrors.last_name" :error="!!formErrors.last_name"
                            @input="formErrors.last_name = ''">
                            <q-icon name="perm_identity" slot="append"/>
                        </q-input>
                    </div>

                    <q-input v-model="formData.address" label="Address" class="q-mb-sm">
                        <q-icon name="home" slot="append"/>
                    </q-input>

                    <q-input
                        v-model="formData.email" label="Email" class="q-mb-sm" no-error-icon hide-bottom-space
                        :error-message="formErrors.email" :error="!!formErrors.email"
                        @input="formErrors.email = ''">
                        <q-icon name="email" slot="append"/>
                    </q-input>

                    <q-input
                        v-model="formData.about_me"
                        type="textarea" rows="3"
                        label="About yourself" class="q-mb-sm"
                        hide-bottom-space
                    />

                    <div class="row items-baseline q-mt-xl text-weight-medium">
                        <div class="">For change password</div>
                        <q-btn color="primary" @click="passwordChangeModal = true" flat>Click here</q-btn>
                    </div>
                </div>

                <div class="row justify-center">
                    <q-btn @click="updateProfileButtonClicked" class="q-mr-md" color="primary">Update</q-btn>
                    <q-btn @click="cancelProfileButtonClicked">Cancel</q-btn>
                </div>
            </q-card-section>
        </q-card>

        <q-dialog v-model="passwordChangeModal" @hide="hidePasswordChangeForm">
            <q-card style="overflow: unset; min-width: 400px">
                <q-card-section class="bg-primary text-weight-bold text-white text-subtitle1">
                    {{currentPasswordCheckSection ? 'Check current password' : 'Update new password'}}
                </q-card-section>

                <q-card-section class="q-pa-xl">
                    <template v-if="currentPasswordCheckSection">
                        <div
                            class="text-subtitle2 q-mb-md"
                        >
                            Note* Before change your password please confirm your current password first
                        </div>
                        <q-input
                            v-model="currentPassword"
                            :error-message="formErrors.current_password" :error="!!formErrors.current_password"
                            @input="formErrors.current_password = ''"
                            label="Current Password"
                            type="password"
                            class="q-mb-xl"
                            autofocus
                        >
                            <q-icon name="vpn_key" slot="append"/>
                        </q-input>

                        <div class="text-center">
                            <q-btn color="primary" @click="checkCurrentPassword">Check</q-btn>
                        </div>
                    </template>
                    <template v-else>
                        <div class="q-mb-xl">
                            <q-input v-model="updatePassFormData.password" type="password" label="New Password"
                                     class="q-mb-sm" no-error-icon
                                     hide-bottom-space
                                     :error-message="formErrors.password" :error="!!formErrors.password"
                                     @input="formErrors.password = ''"
                                     autofocus>
                                <q-icon name="lock" slot="append"/>
                            </q-input>
                            <q-input v-model="updatePassFormData.confirm_password" type="password"
                                     label="Confirm New Password"
                                     class="q-mb-sm">
                                <q-icon name="lock" slot="append"/>
                            </q-input>
                        </div>

                        <div class="text-center">
                            <q-btn color="primary" no-caps @click="updatePasswordButtonClicked">Update Password</q-btn>
                        </div>
                    </template>
                </q-card-section>
            </q-card>

        </q-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                profileEditSelected        : false,
                passwordChangeModal        : false,
                currentPasswordCheckSection: true,
                formData                   : {},
                formErrors                 : {},
                currentPassword            : '',
                updatePassFormData         : {}
            }
        },

        computed: {
            ...mapGetters({
                userInfo: 'auth/user'
            })
        },

        mounted() {
            this.setUserProfile();
        },

        methods: {
            setUserProfile(){
                this.$set(this.formData, 'first_name', this.userInfo.meta.first_name);
                this.$set(this.formData, 'last_name', this.userInfo.meta.last_name);
                this.$set(this.formData, 'address', this.userInfo.meta.address);
                this.$set(this.formData, 'email', this.userInfo.email);
                this.$set(this.formData, 'about_me', this.userInfo.meta.about_me);
            },

            updateProfileButtonClicked() {
                this.$store.dispatch('auth/updateProfile', {
                    vm        : this,
                    inputs    : this.formData,
                })
                    .then(res => {
                        this.$q.notify({
                            color   : 'positive',
                            message : 'Profile has been updated Successful',
                            position: 'top'
                        });
                    })
                    .catch(err => {
                        this.formErrors = err.response.data.errors;
                    })
            },

            cancelProfileButtonClicked() {
                this.setUserProfile();
                this.formErrors = {};
                this.profileEditSelected = false
            },

            checkCurrentPassword() {
                // check current pass then set to false
                this.$store.dispatch('auth/checkCurrentPassword', {
                    vm        : this,
                    inputs    : { current_password: this.currentPassword },
                })
                    .then(res => {
                        this.currentPasswordCheckSection = false;
                        this.currentPassword = '';
                    })
                    .catch(err => {
                        if (!err.response.data.errors) {
                            this.$q.notify({
                                color   : 'negative',
                                message : err.response.data.message,
                                position: 'top'
                            })
                        } else {
                            this.formErrors = err.response.data.errors
                        }
                    });
            },

            updatePasswordButtonClicked() {
                this.$store.dispatch('auth/updatePassword', {
                    vm        : this,
                    inputs    : this.updatePassFormData,
                })
                    .then(res => {
                        this.passwordChangeModal = false;
                        this.$q.notify({
                            color   : 'positive',
                            message : 'Password has been changed Successful',
                            position: 'top'
                        });
                    })
                    .catch(err => {
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
            },

            hidePasswordChangeForm(){
                this.currentPasswordCheckSection = true;
                this.updatePassFormData = {};
                this.formErrors = {};
            }
        },
    }
</script>
