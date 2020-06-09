<template>
    <div>
       <!-- Coming Soon!!-->
        <div class="q-pa-md bg-amber">
            <div  @scroll="loadNewItems" id="itemSection" class="scroll" style="height: 150px">
                <p v-for="n in items">
                    {{ n }}
                </p>
                <q-scroll-observer @scroll="loadNewItems" />
            </div>
        </div>
        <div class="q-pa-md row items-start q-gutter-md">
            <q-card class="my-card" v-for="item in 8" :key="item">
                <q-item clickable>
                    <q-item-section avatar>
                        <q-icon size="80px" color="primary" name="message"/>
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>New messages</q-item-label>
                        <q-item-label>200</q-item-label>
                    </q-item-section>
                </q-item>

                <q-card-actions align="right" style="margin-top: -50px">
                    <q-btn dense flat round color="red">12</q-btn>
                    <q-btn dense flat round color="teal">20</q-btn>
                </q-card-actions>

            </q-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageIndex',

    data() {
        return {
            index: 0,
            items: [
                '1','2','3',
                '4','6','7',
                '8','9','10',
            ],
            newItems: [
                '11','12','13',
                '14','16','17',
                '18','19','20',
            ]
        }
    },

    methods: {
        loadNewItems(info){

            //console.log(info);

            let container = document.getElementById('itemSection');
            let scrollTop = container.scrollTop,
                clientHeight = container.clientHeight,
                scrollHeight = container.scrollHeight;

            if(scrollTop > 90) {
                this.items.push(this.newItems[this.index]);
                this.index++;
                console.log('load data');
            }

            /*if(scrollTop+90 >= scrollHeight-clientHeight) {
                this.items.push(this.newItems[this.index]);
                this.index++;
                console.log('load data');
            }*/
        }
    },

    created() {
        this.$get('/me')
    }
}
</script>
<style lang="sass" scoped>
    .my-card
        width: 100%
        max-width: 300px
</style>

