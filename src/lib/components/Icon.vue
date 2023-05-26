<template>
<span
    :class="classes"
    :style="size"
    role="presentation"
/>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    size: {
        type: String,
        default: null
    }
});

const size = computed(() => {
    return {
        'font-size': props.size ? `${props.size}rem` : null
    };
});

const classes = computed(() => {
    return {
        [`sap-icon--${props.name}`]: true
    };
});
</script>
