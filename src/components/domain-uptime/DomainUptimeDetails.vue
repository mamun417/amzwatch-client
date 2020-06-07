<template>
    <div
        v-if="Object.keys(details).length"
    >
        <div>
            <span class="text-subtitle2">Currently active uptime checks</span>
            <span class="q-ml-md">
                <q-chip
                    v-for="(type, index) in ['http', 'ping']"
                    class="q-px-sm"
                    :class="[getCheckTypesActiveState(type) ? 'text-white' : '']"
                    :color="getCheckTypesActiveState(type) ? 'primary' : ''"
                    :disable="!getCheckTypesActiveState(type)"
                    dense
                >
                    {{type}}
                </q-chip>
            </span>
        </div>

        <q-card
            v-for="(checkType, index) in ['http', 'ping']"
            class="q-my-md"
        >
            <q-card-section class="bg-primary text-white row items-center">
                <div class="col">
                    {{$_.upperCase(checkType)}}
                </div>

                <div>
                    <q-badge :color="getCheckTypesActiveState(checkType) ? 'positive' : 'warning'">
                        {{getCheckTypesActiveState(checkType) ? 'active' : 'inactive'}}
                    </q-badge>
                </div>

                <div class="col text-right">
                    <template
                        v-if="getCheckTypesHasLastDate(checkType)"
                    >
                        <span>Last checked</span>
                        <span class="q-ml-sm">{{$timestampToDate(details.uptime_checker[checkType].last_checked_at)}}</span>
                    </template>
                    <div v-else>Pending</div>
                </div>
            </q-card-section>

            <q-card-section>

            </q-card-section>
        </q-card>
    </div>
    <div
        v-else
        class="text-subtitle2 text-center q-pa-lg"
    >
        No Data found
    </div>
</template>

<script>
    export default {
        data() {
            return {
                details: {}
            }
        },

        mounted() {
            this.getDomainUptimeDetail()
        },

        methods: {
            getCheckTypesActiveState(type) {
                return this.details.user_domain.domain_use_for.domain_uptime_check_service.check_types.includes(type)
            },
            getCheckTypesHasLastDate(type) {
                if (this.details.hasOwnProperty('uptime_checker')) {
                    if (this.details.uptime_checker.hasOwnProperty(type)) {
                        return this.details.uptime_checker[type].hasOwnProperty('last_checked_at')
                            && this.details.uptime_checker[type].last_checked_at
                    }
                }

                return false
            },

            getDomainUptimeDetail() {
                this.$store.dispatch('domain_uptime/getDomainUptimeDetails', {
                    vm        : this,
                    project_id: this.$route.params.project_id
                })
                    .then(res => {
                        this.details = res.data.domainUptimeDetails;
                    })
                    .catch(err => {
                        //handle error
                    });
            }
        }
    }
</script>