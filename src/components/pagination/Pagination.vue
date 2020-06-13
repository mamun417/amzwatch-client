<template>
    <q-pagination
        :value="current_page"
        :max="last_page"
        @input="$emit('handlePagination', $event)"
        :direction-links="true"
        :boundary-links="true"
        icon-first="skip_previous"
        icon-last="skip_next"
        icon-prev="fast_rewind"
        icon-next="fast_forward"
        :max-pages="15"
        :boundary-numbers="true"
    >
    </q-pagination>
</template>

<script>
    export default {
        props: {
            current_page : {
                type : Number
            },
            last_page : {
                type : Number
            }
        }
    }
</script>
