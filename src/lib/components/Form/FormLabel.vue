<template>
<span
    class="fd-form-label"
    :aria-required="String(required)"
    :class="classes"
>
        <slot/>
    </span>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
    required: {
        type: Boolean,
        default: false
    }
});

const classes = computed(() => {
    return {
        'fd-form-label--required': props.required
    };
});
</script>
