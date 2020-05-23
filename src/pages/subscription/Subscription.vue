<template>
    <div class="q-mx-auto">
        <q-card>
            <q-card-section class="q-py-lg">
                <div class="text-weight-bold text-h6 text-center">
                    <span>Your current plan is </span>
                    <span class="text-primary">Free</span>
                </div>
                <div class="text-center text-caption">
                    <span>This plan expires in </span>
                    <span></span>
                </div>
            </q-card-section>
        </q-card>

        <q-card class="q-mt-xl">
            <q-card-section class="row q-py-xl">
                <pricing-plan
                    v-for="(plan, index) in pricingPlanInfos"
                    class="col-12 col-md-4"
                    :key="index"
                    :pricing-plan="plan"
                    :featured="index === 1"
                />
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
    import PricingPlan from 'components/subscription/PricingPlan'

    export default {
        components: {PricingPlan},
        data() {
            return {
                pricingPlanInfos: [
                    {
                        name: 'Free',
                        infos: [
                            '1 Project',
                            '500 links',
                            '1 service',
                            '50 mails'
                        ],
                        price: {
                            monthly: 0,
                            yearly: 0
                        }
                    },
                    {
                        name: 'Premium',
                        infos: [
                            '5 Project',
                            '5000 links',
                            '3 service',
                            '500 mails'
                        ],
                        price: {
                            monthly: 1000,
                            yearly: 10000
                        }
                    },
                    {
                        name: 'Platinum',
                        infos: [
                            'Unlimited Project',
                            'Unlimited links',
                            'Unlimited service',
                            'Unlimited mails'
                        ],
                        price: {
                            monthly: 1500,
                            yearly: 15000
                        }
                    },
                ]
            }
        }
    }
</script>