<template>
    <RouterView />
    <VToasts/>
</template>

<script>
    // Components
    import VToasts from '@/components/VToasts.vue';

    export default {
        name: 'App',

        components: { VToasts }
    };
</script>