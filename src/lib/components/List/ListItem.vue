<template>
<li
    class="fd-list__item"
    tabindex="0"
    :class="classes"
    :aria-selected="String(selected)"
    role="option"
>
    <slot/>

    <template v-if="$slots['secondary-title']">
        <div class="fd-list__secondary">
            <slot name="secondary-title"></slot>
        </div>
    </template>
</li>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    selected: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    }
});

const classes = computed(() => {
    const { active } = props;
    return {
        'is-active': active
    };
});
</script>
