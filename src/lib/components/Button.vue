<template>
<button
    ref="button"
    :class="classes"
    :disabled="disabled"
    v-bind="$attrs"
    @click="click"
>
    <slot></slot>
    <span v-if="hasSlot('text')" class="fd-button__text">
            <slot name="text"></slot>
        </span>
    <span v-if="hasSlot('badge')" class="fd-button__badge">
            <slot name="badge"></slot>
        </span>
</button>
</template>

<script setup>
import { computed, ref } from 'vue';
import { ButtonStyling } from '@/lib/enums/Button.enum';
import { useSlot } from '@/lib/composables/slot.composable';
import { useRouter } from 'vue-router';

const router = useRouter();
const { hasSlot } = useSlot();

const props = defineProps({
    compact: Boolean,
    styling: {
        type: String,
        default: null,
        validator: (value) => Object.values(ButtonStyling).includes(value)
    },
    to: {
        type: Object
    },
    disabled: {
        type: Boolean,
        default: false
    },
    outline: {
        type: Boolean,
        default: false
    },
});

const classes = computed(() => {
    const { disabled, compact, styling, outline } = props;
    return [
        'fd-button',
        compact ? 'fd-button--compact' : '',
        styling ? `fd-button--${styling}` : '',
        disabled ? 'is-disabled' : '',
        outline ? 'fd-button--toggled' : ''
    ];
});

const emit = defineEmits(['click']);

function click(event) {
    const { disabled, to } = props;

    if (disabled){
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
    }
    if (to){
        router.push(to);
    }
    emit('click', event);
}

const button = ref(null);

defineExpose({
    button
});
</script>
