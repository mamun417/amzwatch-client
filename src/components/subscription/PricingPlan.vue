<template>
    <div
        class="text-center q-pa-xl"
        :class="{'shadow-10 relative-position overflow-hidden': featured}"
        style="border-radius: 15px"
        :style="[]"
    >
        <div
            v-if="featured"
            class="bg-primary q-py-xs full-width"
            style="position: absolute; top: 4%; left: 35%; transform: rotate(45deg)"
        >
            <q-icon name="person" color="white"/>
        </div>

        <div class="text-primary text-weight-bold text-subtitle1 q-mb-lg">{{pricingPlan.name}}</div>
        <div class="q-my-md">
            <span class="vertical-top">TK</span>
            <span class="text-h4 text-weight-bold">{{pricingPlan.price[durationType]}}</span>
            <span class="text-caption">/{{durationType}}</span>
        </div>

        <div
            v-for="(info, index) in pricingPlan.infos"
            class="q-py-sm q-my-sm text-grey-9"
            style="border-bottom: 1px solid rgba(153, 153, 153, 0.3)"
            :key="index"
        >
            {{info}}
        </div>

        <q-btn label="Get Started" color="primary" class="q-mt-lg"></q-btn>
    </div>
</template>

<script>
    export default {
        props: {
            pricingPlan : {
                type   : Object,
                default: () => ({})
            },
            durationType: {
                type   : String,
                default: 'monthly'
            },
            featured: {
                type: Boolean,
                default: false
            }
        }
    }
</script>