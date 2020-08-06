<template>
    <q-dialog :value="active" @hide="$emit('update:active', false)">
        <q-card>
            <q-card-section>
                <div
                    class="text-center text-primary text-subtitle1 text-weight-bold q-mb-sm"
                >Full Results</div>

                <div class="q-gutter-lg q-mb-md q-mt-md">
                        <span v-for="n in ['positive', 'warning', 'negative']" >
                            <q-btn dense round :color="n" size="xs"/>
                            <span class="vertical-middle"> {{ $_.upperFirst(n) }}</span>
                        </span>
                </div>

                <q-list>
                    <div
                        v-for="(key, index) in fullSpeedAuditsNames"
                        v-if="fullSpeedResultPage.meta.lhr_desktop_result.audits[key].displayValue"
                        class="row full-width q-pa-sm justify-between items-center shadow-1 q-mb-sm"
                        :class="$q.screen.lt.sm ? 'text-center' : ''"
                        :key="index"
                    >
                        <!--<pre>{{fullSpeedResultPage.meta['lhr_desktop_result'].audits[key]}}</pre>-->
                        <div class="col-12 col-sm-4 q-mb-sm">
                            {{ $_.startCase($_.replace(key, new RegExp("-","g"), ' ')) }}
                        </div>

                        <div class="col-12 col-sm">
                            <span
                                v-for="(device, index) in ['lhr_desktop_result', 'lhr_mobile_result']"
                                class="q-mx-md"
                            >
                                <q-icon
                                    :name="device === 'lhr_desktop_result' ? 'desktop_mac' : 'phone_android'"
                                    size="20px"
                                    color="primary"
                                />
                                <q-circular-progress
                                    v-if="fullSpeedResultPage.meta.hasOwnProperty(device) && fullSpeedResultPage.meta[device]"
                                    class="q-mx-xs text-bold"
                                    :class="[`text-${$parent.calculateScoreType(fullSpeedResultPage.meta[device].audits[key].score * 100).color}`]"
                                    :value="fullSpeedResultPage.meta[device].audits[key].score * 100"
                                    size="60px"
                                    font-size="10px"
                                    :color="$parent.calculateScoreType(fullSpeedResultPage.meta[device].audits[key].score * 100).color"
                                    track-color="grey-4"
                                    show-value
                                >
                                    {{ fullSpeedResultPage.meta[device].audits[key].displayValue }}
                                </q-circular-progress>
                                <span v-else class="q-ml-xs text-warning">Pending</span>
                            </span>
                        </div>
                    </div>
                </q-list>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
export default {
    props: {
        active: {
            type: Boolean,
            default: false
        },
        fullSpeedResultPage: {
            type: Object,
            default: () => ({})
        },
        fullSpeedAuditsNames: {
            type: Array,
            default: () => ([])
        }
    },
}
</script>
