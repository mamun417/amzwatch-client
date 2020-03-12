<template>
    <q-layout view="hhh lpR fff" class="bg-grey-2">

        <q-header class="q-px-xl q-py-md" elevated>
            <q-toolbar>
                <q-toolbar-title>AMZ Watch</q-toolbar-title>
                <q-space></q-space>
                <q-btn to="/auth/login" flat dense icon="fingerprint" class="q-mr-lg" label="Login" />
                <q-btn to="/auth/register" flat dense icon="group_add" label="Register" />
            </q-toolbar>
        </q-header>

        <q-page-container class="bg-grey-2">
            <router-view/>
        </q-page-container>
    </q-layout>
</template>

<script>

export default {
    name: 'AuthLayout',

    components: {

    },

    data() {
        return {

        }
    }
}
</script>
