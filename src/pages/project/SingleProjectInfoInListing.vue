<template>
    <q-card class="q-mb-lg">
        <q-card-section class="bg-primary text-white row justify-between items-center">
            <div class="col">
                <div class="row items-center q-mb-xs">
                    <div class="q-mr-sm text-subtitle1">{{projectInfo.name}}</div>

                    <q-badge color="positive">
                        Active
                    </q-badge>
                </div>
            </div>

            <div class="col justify-center">
                <div class="text-caption text-center">Domain: {{projectInfo.domain}}</div>
                <div class="text-caption text-center">Created at: 10 10 20</div>
            </div>

            <div class="col flex justify-end">
                <q-btn flat icon="visibility" to="/projects/1" dense></q-btn>
                <q-btn flat icon="edit" dense></q-btn>
            </div>
        </q-card-section>

        <q-card-section>
            <div class="row justify-between items-center q-py-sm">
                <div class="col text-subtitle2 flex items-center">
                    <q-icon name="link_off" class="q-mr-xs"/>
                    <div>Broken link checker</div>
                </div>

                <div class="col flex items-center justify-center">
                    <q-badge v-if="!projectInfo.services.includes('broken_link_check')" color="warning">
                        <q-icon name="error" class="q-mr-xs"/>
                        You are not using this service
                    </q-badge>

                    <template v-else>
                        <q-badge color="warning">
                            <q-icon name="error" class="q-mr-xs"/>
                            22 issues
                        </q-badge>
                    </template>
                </div>

                <div class="col text-right items-center">
                    <template v-if="projectInfo.services.includes('broken_link_check')">
                        <q-btn color="primary" icon="insert_chart_outlined" flat dense></q-btn>
                        <q-btn color="primary" icon="visibility" to="/projects/1/broken-links-check" flat dense></q-btn>
                    </template>

                    <q-btn v-else label="Start" color="primary" size="md"
                           @click="showBrokenLinksActiveModal = !showBrokenLinksActiveModal" flat dense/>
                </div>
            </div>

            <div class="row justify-between items-center q-py-sm">
                <div class="col text-subtitle2 flex items-center">
                    <q-icon name="record_voice_over" class="q-mr-xs"/>
                    <div>Guest link checker</div>
                </div>

                <div class="col flex items-center justify-center">
                    <q-badge v-if="!projectInfo.services.includes('guest_link_check')" color="warning">
                        <q-icon name="error" class="q-mr-xs"/>
                        You are not using this service
                    </q-badge>

                    <template v-else>
                        <q-badge color="positive">
                            <q-icon name="check" class="q-mr-xs"/>
                            no issues
                        </q-badge>
                    </template>
                </div>

                <div class="col text-right items-center">
                    <template v-if="projectInfo.services.includes('guest_link_check')">
                        <q-btn color="primary" icon="insert_chart_outlined" flat dense></q-btn>
                        <q-btn color="primary" icon="visibility" to="/projects/1/guest-links-check" flat dense></q-btn>
                    </template>

                    <q-btn v-else label="Start" color="primary" size="md" flat dense/>
                </div>
            </div>

            <div class="row justify-between items-center q-py-sm">
                <div class="col text-subtitle2 flex items-center q-mr-xs">
                    <q-icon name="local_mall" class="q-mr-xs"/>
                    <div>Amazon product link checker</div>
                </div>

                <div class="col flex items-center justify-center">
                    <q-badge v-if="!projectInfo.services.includes('amazon_product_link_check')" color="warning">
                        <q-icon name="error" class="q-mr-xs"/>
                        You are not using this service
                    </q-badge>

                    <template v-else>
                        <q-badge color="warning">
                            <q-icon name="error" class="q-mr-xs"/>
                            02 issues
                        </q-badge>
                    </template>
                </div>

                <div class="col text-right items-center">
                    <template v-if="projectInfo.services.includes('amazon_product_link_check')">
                        <q-btn color="primary" icon="insert_chart_outlined" flat dense></q-btn>
                        <q-btn color="primary" icon="visibility" to="/projects/1/amazon-products-check" flat
                               dense></q-btn>
                    </template>

                    <q-btn v-else label="Start" color="primary" size="md"
                           @click="showAmazonActiveModal = !showAmazonActiveModal" flat dense/>
                </div>
            </div>
        </q-card-section>

        <q-dialog v-model="showBrokenLinksActiveModal">
            <q-card style="min-width: 400px">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Activate Broken Link Checker Service</div>
                </q-card-section>

                <q-card-section class="text-center q-pa-xl">
                    <div class="text-subtitle1 text-bold q-mb-lg">This service is currently: <span
                        class="text-warning">Deactivated</span></div>

                    <q-btn color="positive" label="Activate"/>
                </q-card-section>
            </q-card>
        </q-dialog>

        <q-dialog v-model="showAmazonActiveModal">
            <q-card style="min-width: 400px">
                <q-card-section class="bg-primary text-white">
                    <div class="text-h6">Activate Amazon Product Checker Service</div>
                </q-card-section>

                <q-card-section class="text-center q-pa-xl">
                    <div class="text-subtitle1 text-bold q-mb-lg">This service is currently: <span
                        class="text-warning">Deactivated</span></div>

                    <q-input v-model="amazonRefId" label="Amazon Ref Id" class="q-mb-lg" label-color="primary"
                             placeholder="Ex. kjaskkkj"/>

                    <q-btn color="positive" label="Activate"/>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-card>
</template>

<script>
export default {
    name : 'SingleProjectInfoInListing',
    props: {
        showBrokenLinksActiveModal: false,
        showAmazonActiveModal     : false,

        amazonRefId: '',

        projectInfo: {
            type   : Object,
            default: () => ({})
        }
    }
}
</script>
