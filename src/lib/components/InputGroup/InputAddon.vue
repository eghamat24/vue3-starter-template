<template>
<span class="fd-input-group__addon" :class="classes">
    <slot v-if="!props.button"></slot>
    <button
        v-if="props.button"
        class="fd-input-group__button fd-button fd-button--transparent"
    >
        <slot></slot>
    </button>
</span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    compact: {
        type: Boolean,
        default: false
    },
    button: {
        type: Boolean,
        default: false
    }
});

const classes = computed(() => {
    return {
        'fd-input-group__addon--compact': props.compact,
        'fd-input-group__addon--button': props.button
    };
});
</script>
