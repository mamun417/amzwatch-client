<template>
    <q-layout view="hhh lpR fff" class="bg-grey-3">
        <q-header class="" elevated>
            <q-toolbar>
                <q-btn
                    v-if="$route.path !== '/'"
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

                <profile-menu-dropdown/>
            </q-toolbar>
        </q-header>

        <q-drawer
            v-if="$route.path !== '/'"
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

        <q-page-container class="">
            <q-page class="">
                <q-card
                    v-if="$route.path !== '/'"
                    class="flex q-mb-lg q-py-lg bg-primary text-white no-border-radius"
                >
                    <q-card-section>Home / {{$route.path.substr(1)}}</q-card-section>

                    <q-space/>
                </q-card>

                <router-view class="q-pa-md"/>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script>
    import DrawerLinks from 'components/DrawerLinks'
    import ProfileMenuDropdown from 'components/dropdowns/ProfileMenuDropdown'

    export default {
        name: 'MainLayout',

        components: {
            ProfileMenuDropdown,
            DrawerLinks,
        },
        data() {
            return {
                leftDrawerOpen: false,
                miniState     : true,
                drawerLinks   : [
                    {
                        title  : 'Home',
                        caption: 'Go to home',
                        icon   : 'home',
                        link   : '/'
                    }
                ]
            }
        }
    }
</script>
