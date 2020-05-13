<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section
                class="bg-primary text-white row justify-between items-center"
            >
                <div class="col">
                    <div class="text-h6">Check Guest Posts</div>
                    <div class="text-caption">Project: Test project</div>
                    <div class="text-caption">Domain: exonhost.com</div>
                </div>

                <div class="col text-center">
                    <q-badge color="positive" class="text-subtitle2">
                        Active
                    </q-badge>
                </div>

                <div class="col text-right">
                    <q-btn icon="settings" @click="showModal = !showModal" flat dense/>
                </div>
            </q-card-section>
        </q-card>

        <q-card class="q-mb-xl">
            <q-card-section class="bg-primary row items-center text-white text-subtitle2">
                <div class="col flex items-center">
                    <q-icon name="show_chart" class="q-mr-sm"/>
                    <div>This years chart</div>
                </div>

                <div class="col text-right">
                    <div class="row items-center">
                        <div v-if="showChart" class="col row q-mr-md">
                            <q-select
                                color="white" label="Choose Month" label-color="white"
                                input-class="white" class="col q-mr-md" bg-color="primary"
                                value="" hide-bottom-space dense
                            />
                            <q-select
                                color="white" label="By Year" label-color="white"
                                input-class="white" class="col" style="max-width: 120px"
                                value="" hide-bottom-space dense
                            />
                        </div>

                        <div class="text-right q-py-sm" :class="[showChart ? 'col-auto' : 'col']">
                            <q-btn
                                @click="showChart = !showChart"
                                :icon="showChart ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                                dense flat
                            />
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-card-section v-show="showChart">
                <q-c-chart/>
            </q-card-section>
        </q-card>

        <q-card class="q-mb-xl">
            <q-card-section class="bg-primary row items-center text-white text-subtitle2">
                <div class="col flex items-center">
                    <q-icon name="record_voice_over" class="q-mr-sm"/>
                    <div>Guest posts</div>
                </div>

                <div>
                    <q-badge color="positive">
                        Total: {{ guestPostsCount }} Links
                    </q-badge>
                </div>

                <div class="col text-right">
                    <q-btn
                        @click="showLinks = !showLinks"
                        :icon="showLinks ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                        dense flat
                    />
                </div>
            </q-card-section>

            <q-card-section v-if="showLinks">

                <guest-post-list
                    :getguestPostsCount="true"
                    @get$guestPostsCount="guestPostsCount = $event"
                />

                <div class="q-pa-lg flex flex-center">
                    <q-pagination :value="3" :max="5"/>
                </div>
            </q-card-section>
        </q-card>

        <q-dialog v-model="showModal">
            <q-card style="min-width: 400px">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Deactivate this service?</div>
                </q-card-section>

                <q-card-section class="text-center q-pa-xl">
                    <div class="text-subtitle1 text-bold q-mb-lg">
                        This service is currently: <span class="text-positive">Active</span>
                    </div>

                    <q-btn color="warning" label="Deactivate"/>
                </q-card-section>
            </q-card>
        </q-dialog>
    </section>
</template>

<script>
    import QCChart from "components/charts/QCChart";
    import GuestPostList from "components/guest-posts/GuestPostList";

    export default {
        components: {
            QCChart,
            GuestPostList
        },
        data() {
            return {
                showChart      : false,
                showLinks      : true,
                showModal      : false,
                guestPostsCount: '',
            }
        }
    }
</script>
