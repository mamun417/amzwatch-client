<template>
    <q-layout view="hhh lpR fff" class="bg-grey-3">
        <template v-if="$route.path !== '/'">
            <q-header elevated>
                <q-toolbar>
                    <q-btn
                        flat
                        dense
                        round
                        icon="menu"
                        aria-label="Menu"
                        @click="leftDrawerOpen = !leftDrawerOpen"
                    />

                    <q-toolbar-title>
                        AMZ Watch
                    </q-toolbar-title>
                </q-toolbar>
            </q-header>

            <q-drawer
                v-model="leftDrawerOpen"
                content-class="bg-grey-3"
                :mini="miniState"
                @mouseover="miniState = false"
                @mouseout="miniState = true"
                show-if-above
                bordered
                elevated
            >
                <q-list>
                    <drawer-links
                        v-for="link in drawerLinks"
                        :key="link.title"
                        v-bind="link"
                    />
                </q-list>
            </q-drawer>
        </template>

        <q-page-container class="">
            <q-page class="">
                <q-card class="q-mb-lg q-py-lg bg-primary text-white no-border-radius">
                    <q-card-section>Home / {{$route.path.substr(1)}}</q-card-section>
                </q-card>

                <router-view class="q-pa-md"/>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script>
import DrawerLinks from 'components/DrawerLinks'

export default {
    name: 'MainLayout',

    components: {
        DrawerLinks
    },
    data() {
        return {
            leftDrawerOpen: false,
            miniState: true,
            drawerLinks: [
                {
                    title: 'Home',
                    caption: 'Go to home',
                    icon: 'home',
                    link: '/'
                }
            ]
        }
    }
}
</script>
