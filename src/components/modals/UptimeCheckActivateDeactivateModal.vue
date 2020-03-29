<template>
    <q-dialog v-model="show">
        <q-card style="min-width: 400px">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{active ? 'Deactivate' : 'Activate'}} Uptime Monitor Checker Service</div>
            </q-card-section>

            <q-card-section class="text-center q-py-xl">
                <div class="text-subtitle1 text-bold q-mb-lg">This service is currently: <span
                    class="text-warning">{{active ? 'Deactivated' : 'Activated'}}</span></div>

                <div class="q-px-md">
                    <q-select
                        filled
                        v-model="uptimeActiveInfo.type"
                        class="q-mb-xl"
                        :options="['http', 'ping', 'port']"
                        label="Uptime check type"
                        multiple
                        emit-value
                        map-options
                    >
                        <template v-slot:option="scope">
                            <q-item
                                v-bind="scope.itemProps"
                                v-on="scope.itemEvents"
                            >
                                <q-item-section>
                                    <q-item-label>{{scope.opt}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-toggle v-model="uptimeActiveInfo.type" :val="scope.opt"/>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>

                    <q-slider v-model="uptimeActiveInfo.timeRange" :min="1" :max="3" label-always
                              :label-value="uptimeTimeLabelMaker"/>
                </div>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn v-if="!active" flat color="primary" label="Activate" class="q-mr-md" v-close-popup/>
                <q-btn v-else flat label="Deactivate" color="warning" class="q-mr-md" v-close-popup/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            uptimeActiveInfo: {
                type: [],
                timeRange: 1
            }
        }
    },
    created() {
        // get info using api & update uptimeActiveInfo if active
    },
    computed: {
        uptimeTimeLabelMaker() {
            let info = {1: '5 min', 2: '10 min', 3: '1 hour'}

            return info[this.uptimeActiveInfo.timeRange]
        }
    },
}
</script>
