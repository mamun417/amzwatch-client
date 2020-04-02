<template></template>

<script>
export default {
    beforeCreate() {
        this.$store.dispatch('auth/logout')
        this.$router.push('/')
    }
}
</script>
