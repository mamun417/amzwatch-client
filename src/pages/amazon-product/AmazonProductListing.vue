<template>
    <section>
        <q-card class="q-mb-lg">
            <q-card-section
                class="bg-primary text-white row justify-between items-center"
            >
                <div class="col">
                    <div class="text-h6">Check Amazon Products</div>
                    <div class="text-caption">Project: Test project</div>
                    <div class="text-caption">Domain: exonhost.com</div>
                </div>

                <div class="col text-center">
                    <q-badge color="positive" class="text-subtitle2">
                        Active
                    </q-badge>
                </div>

                <div class="col text-right">
                    <q-btn icon="settings" flat dense/>
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
                                color="white"
                                label="Choose Month"
                                label-color="white"
                                input-class="white"
                                class="col q-mr-md"
                                bg-color="primary"
                                hide-bottom-space
                                dense
                            />
                            <q-select
                                color="white"
                                label="By Year"
                                label-color="white"
                                input-class="white"
                                class="col"
                                style="max-width: 120px"
                                hide-bottom-space
                                dense
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
                    <q-icon name="link_off" class="q-mr-sm"/>
                    <div>Products</div>
                </div>

                <div>
                    <q-badge color="positive">
                        Total: 200 Products
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
                <q-list>
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

                        <q-card class="bg-blue-grey-1 q-px-md q-py-sm text-bold text-caption">
                            <q-card-section>
                                <div class="">Last checked this product: {{product.lastCheck}}
                                </div>
                            </q-card-section>
                            <q-card-section>
                                <div class="flex q-mb-sm">
                                    <div class="q-mr-sm">This product has in:</div>
                                    <q-badge>6 Links</q-badge>
                                </div>
                                <q-list bordered dense>
                                    <q-item class="text-primary text-subtitle2 text-bold">
                                        <q-item-section>Link</q-item-section>
                                        <q-item-section class="text-right">Last checked</q-item-section>
                                    </q-item>
                                    <q-item
                                        v-for="(link, index) in productInPages"
                                        class=""
                                        clickable
                                    >
                                        <q-item-section>http://www.{{link}}</q-item-section>
                                        <q-item-section class="text-right">30 30 20</q-item-section>
                                    </q-item>
                                </q-list>
                            </q-card-section>
                        </q-card>
                    </q-expansion-item>
                </q-list>

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
import QCChart from "components/charts/QCChart";

export default {
    components: {QCChart},
    data() {
        return {
            showChart: true,
            showLinks: true,

            amazonProductsInfo: [
                {
                    productName: 'watch',
                    productUrl : 'amz/test1',
                    status     : 'available',
                    lastCheck  : '30 10 20'
                },
                {
                    productName: 'laptop',
                    productUrl : 'amz/test2',
                    status     : 'unavailable',
                    lastCheck  : '15 10 20'
                }
            ],

            productInPages: [
                'a/a',
                'a/b',
                'a/c',
                'a/d',
                'a/e',
                'a/f'
            ]
        }
    }
}
</script>
