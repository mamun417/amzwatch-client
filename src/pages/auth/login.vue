<template>
    <q-page class="flex flex-center">
        <q-card class="q-pa-lg q-mt-xl" style="min-width: 400px">
            <q-card-section class="text-white">
                <div
                    class="bg-primary text-center q-py-xl shadow-3 border"
                    style="margin-top: -30%; border-radius: 4px"
                >
                    <div class="text-h6">Log in</div>
<!--                    or social login-->
                </div>
            </q-card-section>

            <q-card-section>
                <q-input v-model="formData.email" label="Email" class="q-mb-sm">
                    <q-icon name="email" slot="append"/>
                </q-input>

                <q-input v-model="formData.password" label="Password">
                    <q-icon slot="append" name="lock"/>
                </q-input>
            </q-card-section>

            <q-card-actions align="around">
                <q-btn @click="loginButtonClicked" color="primary" flat>Lets Go</q-btn>
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script>
export default {
    name   : 'Login',
    data() {
        return {
            formData: {
                email   : 'john@example.com',
                password: '123'
            }
        }
    },
    methods: {
        loginButtonClicked() {
            this.$store.dispatch('auth/login', {vm: this, inputs: this.formData})
                .then(res => {
                    this.$q.notify({
                        color   : 'positive',
                        message : 'Login Successful',
                        position: 'top'
                    })

                    this.$router.push('/')
                })
                .catch(err => {

                })
        }
    }
}
</script>
