<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section
                class="bg-primary text-white row justify-between items-center"
            >
                <div class="col">
                    <div class="text-h6">{{projectInfo.name}}</div>
                    <div class="text-subtitle2">{{projectInfo.domain}}</div>
                </div>

                <div class="col text-center">
                    <q-badge color="positive" class="text-subtitle2">
                        Active
                    </q-badge>
                </div>

                <div class="col text-right">
                    <q-btn icon="edit" flat dense/>
                </div>
            </q-card-section>
        </q-card>

        <q-card
            v-for="(service, index) in projectInfo.services"
            :key="index"
            class="q-mb-xl"
        >
            <q-card-section class="bg-primary row items-center text-white text-subtitle2">
                <div class="col flex items-center">
                    <q-icon :name="service.icon" class="q-mr-sm"/>
                    <div>{{index}}</div>
                </div>

                <div>
                    <q-badge :color="service.active ? 'positive' : 'warning'">
                        {{service.active ? 'Active' : 'Service is inactive'}}
                    </q-badge>
                </div>

                <div class="col text-right">
                    <template v-if="service.active">
                        <q-btn
                            icon="visibility"
                            dense flat
                        />
                        <q-btn
                            @click="service.expansionStatus = !service.expansionStatus"
                            :icon="service.expansionStatus ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                            dense flat
                        />
                    </template>

                    <q-btn v-else label="Start service" dense flat/>
                </div>
            </q-card-section>

            <q-card-section v-if="service.expansionStatus && service.active">
                <q-list v-if="index === 'broken_link_check'">
                    <q-item class="q-mb-sm text-subtitle2 text-primary">
                        <q-item-section class="q-ml-md">Link</q-item-section>
                        <q-item-section class="text-center">Status</q-item-section>
                        <q-item-section class="text-right q-mr-md">Last Checked</q-item-section>
                    </q-item>

                    <q-expansion-item
                        v-for="(link, index) in brokenLinkInfo" :key="index"
                        group="brokenLink"
                        icon=""
                        header-class=""
                        expand-icon-class="hidden"
                        class="shadow-3 q-mb-sm"
                    >
                        <q-item
                            slot="header"
                            class="row full-width justify-between text-subtitle2 items-center"
                        >
                            <q-item-section class="col">img</q-item-section>
                            <q-item-section class="col text-center inline-block">
                                <q-badge
                                    :color="link.status === 404 ? 'warning' : 'positive'"
                                >
                                    {{link.status}} - {{link.status === 404 ? 'Not Found' : 'Ok'}}
                                </q-badge>
                            </q-item-section>
                            <q-item-section class="col text-right">
                                {{link.lastCheck}}
                            </q-item-section>
                        </q-item>

                        <!--                        <q-card>-->
                        <!--                            <q-card-section>-->
                        <!--                                <div class="text-caption text-bold">Last updated at: 10 10 10</div>-->
                        <!--                            </q-card-section>-->
                        <!--                        </q-card>-->
                    </q-expansion-item>
                </q-list>
                <!--                end broken link check-->

                <q-list v-if="index === 'guest_post_check'">
                    <q-item class="q-mb-sm text-subtitle2 text-primary">
                        <q-item-section class="q-ml-md">Link</q-item-section>
                        <q-item-section class="text-center">Hosted Link</q-item-section>
                        <q-item-section class="text-right q-mr-md">Status</q-item-section>
                    </q-item>

                    <q-expansion-item
                        v-for="(guest, index) in guestPostInfo" :key="index"
                        group="guestPost"
                        icon=""
                        header-class=""
                        expand-icon-class="hidden"
                        class="shadow-3 q-mb-sm"
                    >
                        <q-item
                            slot="header"
                            class="row full-width justify-between text-subtitle2 items-center"
                        >
                            <q-item-section class="col">{{guest.link}}</q-item-section>
                            <q-item-section class="col">
                                {{guest.hostedLink}}
                            </q-item-section>
                            <q-item-section class="col inline-block text-right">
                                <q-badge
                                    :color="guest.status === 'available' ? 'positive' : 'warning'"
                                >
                                    {{guest.status}}
                                </q-badge>
                            </q-item-section>
                        </q-item>

                        <q-card>
                            <q-card-section>
                                <div class="text-caption text-bold">Last updated at: {{guest.lastCheck}}</div>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                </q-list>
                <!--                guest post check-->

                <q-list v-if="index === 'amazon_product_check'">
                    <q-item class="q-mb-sm text-subtitle2 text-primary">
                        <q-item-section class="q-ml-md">Image</q-item-section>
                        <q-item-section class="text-center">Product Name</q-item-section>
                        <q-item-section class="text-right q-mr-md">In Pages</q-item-section>
                    </q-item>

                    <q-expansion-item
                        v-for="(product, index) in amazonProductsInfo" :key="index"
                        group="amzProduct"
                        icon=""
                        header-class=""
                        expand-icon-class="hidden"
                        class="shadow-3 q-mb-sm"
                    >
                        <q-item
                            slot="header"
                            class="row full-width justify-between text-subtitle2 items-center"
                        >
                            <q-item-section class="col">img</q-item-section>
                            <q-item-section class="col">{{product.productName}}</q-item-section>
                            <q-item-section class="col inline-block text-right">
                                <q-badge
                                    :color="product.status === 'available' ? 'positive' : 'warning'"
                                >
                                    {{product.status}}
                                </q-badge>
                            </q-item-section>
                        </q-item>

                        <q-card>
                            <q-card-section>
                                <div class="text-caption text-bold">Last updated at: {{product.lastCheck}}</div>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                </q-list>
                <!--                end amz product check link check-->

                <div class="q-pa-lg flex flex-center">
                    <q-pagination
                        :value="3"
                        :max="5"
                    >
                    </q-pagination>
                </div>
            </q-card-section>
        </q-card>
    </section>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            projectInfo: {
                name: 'Test project for all',
                domain: 'https//exonhost.com',
                services: {
                    amazon_product_check: {
                        icon: 'local_mall',
                        expansionStatus: true,
                        active: true
                    },
                    guest_post_check: {
                        icon: 'record_voice_over',
                        expansionStatus: true,
                        active: true
                    },
                    broken_link_check: {
                        icon: 'link_off',
                        expansionStatus: true,
                        active: true
                    }
                }
            },
            amazonProductsInfo: [
                {
                    productName: 'watch',
                    productUrl: 'amz/test1',
                    status: 'available',
                    lastCheck: '30 10 20'
                },
                {
                    productName: 'laptop',
                    productUrl: 'amz/test2',
                    status: 'unavailable',
                    lastCheck: '15 10 20'
                }
            ],
            guestPostInfo: [
                {
                    link: 'exon/123',
                    hostedLink: 'google/me',
                    status: 'available',
                    lastCheck: '30 10 20'
                },
                {
                    link: 'exon/456',
                    hostedLink: 'google/contact',
                    status: 'unavailable',
                    lastCheck: '15 10 20'
                }
            ],
            brokenLinkInfo: [
                {
                    link: 'exon/123',
                    status: 200,
                    lastCheck: '30 10 20'
                },
                {
                    link: 'exon/not-found',
                    status: 404,
                    lastCheck: '15 10 20'
                }
            ],
        }
    }
}
</script>
