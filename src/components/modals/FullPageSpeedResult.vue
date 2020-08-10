<template>
    <q-dialog :value="active" @hide="$emit('update:active', false)">
        <q-card>
            <q-card-section>
                <div class="text-center text-primary text-h6 text-weight-bold q-mb-sm">Full Results</div>

                <div class="q-gutter-lg q-my-lg text-center">
                    <span
                        v-for="(n, index) in [{c: 'positive', n: 'Good'}, {c:'warning', n: 'Average'}, {c:'negative', n: 'poor'}]"
                        :key="index"
                    >
                        <q-btn dense round :color="n.c" class="q-mr-sm" size="xs" />
                        <span class="vertical-middle">{{ n.n }}</span>
                    </span>
                </div>

                <!-- tried to do it simply but got duplicate code blocks. solve it by render function -->
                <q-list v-for="(key, index) in fullSpeedAuditsNames" class :key="index">
                    <q-item
                        v-if="fullSpeedResultPage.meta.lhr_desktop_result.audits[key].displayValue"
                        class="shadow-1 q-my-xs"
                        clickable
                    >
                        <q-item-section class="text-weight-bold" no-wrap>
                            <template v-if="$q.screen.lt.sm">
                                <q-item-label
                                    class="text-center q-my-sm"
                                >{{ $_.startCase($_.replace(key, new RegExp("-","g"), ' ')) }}</q-item-label>
                                <q-item-label>
                                    <div
                                        v-for="(device, index) in ['lhr_desktop_result', 'lhr_mobile_result']"
                                        class="text-weight-bold q-my-sm flex items-center justify-between"
                                        :key="index"
                                    >
                                        <q-icon
                                            size="30px"
                                            :name="device === 'lhr_desktop_result' ? 'desktop_mac' : 'phone_android'"
                                            :color="$parent.calculateScoreType(fullSpeedResultPage.meta[device].audits[key].score * 100).color"
                                        />
                                        <div
                                            v-if="fullSpeedResultPage.meta.hasOwnProperty(device) && fullSpeedResultPage.meta[device]"
                                            :class="[`text-${$parent.calculateScoreType(fullSpeedResultPage.meta[device].audits[key].score * 100).color}`]"
                                        >{{ fullSpeedResultPage.meta[device].audits[key].displayValue }}</div>

                                        <div v-else class="text-warning">Pending</div>
                                    </div>
                                </q-item-label>
                            </template>
                            <template
                                v-else
                            >{{ $_.startCase($_.replace(key, new RegExp("-","g"), ' ')) }}</template>
                        </q-item-section>

                        <q-item-section v-if="!$q.screen.lt.sm" no-wrap side>
                            <div
                                v-for="(device, index) in ['lhr_desktop_result', 'lhr_mobile_result']"
                                class="text-weight-bold q-my-xs"
                                :key="index"
                            >
                                <span
                                    v-if="fullSpeedResultPage.meta.hasOwnProperty(device) && fullSpeedResultPage.meta[device]"
                                    :class="[`text-${$parent.calculateScoreType(fullSpeedResultPage.meta[device].audits[key].score * 100).color}`]"
                                >{{ fullSpeedResultPage.meta[device].audits[key].displayValue }}</span>
                                <span v-else class="text-warning">Pending</span>

                                <q-icon
                                    class="q-ml-md"
                                    size="30px"
                                    :name="device === 'lhr_desktop_result' ? 'desktop_mac' : 'phone_android'"
                                    :color="$parent.calculateScoreType(fullSpeedResultPage.meta[device].audits[key].score * 100).color"
                                />
                            </div>
                        </q-item-section>
                    </q-item>
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
            default: false,
        },
        fullSpeedResultPage: {
            type: Object,
            default: () => ({}),
        },
        fullSpeedAuditsNames: {
            type: Array,
            default: () => [],
        },
    },
};
</script>
