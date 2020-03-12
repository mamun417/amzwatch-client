<template>
    <q-page class="flex flex-center">
        <q-card class="q-pa-lg q-mt-xl" style="min-width: 400px">
            <q-card-section class="text-white">
                <div
                    class="text-h6 bg-primary text-center q-py-xl shadow-3 border"
                    style="margin-top: -30%; border-radius: 4px"
                >Register
                </div>
            </q-card-section>

            <q-card-section>
                <q-input label="First Name" class="q-mb-sm">
                    <template>
                        <q-btn round dense flat icon="perm_identity"/>
                    </template>
                </q-input>

                <q-input label="Last Name" class="q-mb-sm">
                    <template>
                        <q-btn round dense flat icon="perm_identity"/>
                    </template>
                </q-input>

                <q-input label="Address" class="q-mb-sm">
                    <template>
                        <q-btn round dense flat icon="home"/>
                    </template>
                </q-input>

                <q-input label="Email" class="q-mb-sm">
                    <template>
                        <q-btn round dense flat icon="email"/>
                    </template>
                </q-input>

                <q-input label="Password">
                    <template>
                        <q-btn round dense flat icon="lock"/>
                    </template>
                </q-input>

                <div class="q-mt-sm">
                    <q-checkbox v-model="agree" label="I agree to the terms and conditions." color="teal" />
                </div>

            </q-card-section>

            <q-card-actions align="around">
                <q-btn flat>Get Started</q-btn>
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script>
    export default {
        name: 'Register',

        data() {
            return {
                agree: false
            }
        }
    }
</script>
