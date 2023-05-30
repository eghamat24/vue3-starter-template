<template>
<ul
    ref="list"
    class="fd-list sap-overflow-auto fd-scrollbar"
    :class="classes"
    @keydown.down="focusNextItem"
    @keydown.up="focusPreviousItem"
>
    <slot/>
</ul>
</template>

<script setup>
import { ListTypes } from '@/lib/enums/Type.enum';
import { computed, ref } from 'vue';

const props = defineProps({
    compact: {
        type: Boolean,
        default: false
    },
    borderless: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: null,
        validator: (type) =>
            type == null || Object.values(ListTypes).includes(type)
    }
});

const classes = computed(() => {
    const { borderless, compact, type } = props;
    return {
        'fd-list--no-border': borderless,
        'fd-list--compact': compact,
        'fd-list--multi-input': type === ListTypes.MULTIINPUT,
        'fd-list--dropdown': type === ListTypes.DROPDOWN
    };
});

const list = ref(null);
const emit = defineEmits(['goAbove']);

function focusNextItem(e) {
    e.preventDefault();

    const items = list.value.querySelectorAll('[role=option]');
    const focusedItem = document.activeElement;
    const elementsArray = [].slice.call(items);

    if (!elementsArray.includes(focusedItem)) items[0].focus();
    else if (focusedItem !== elementsArray[elementsArray.length - 1]){
        focusedItem.nextElementSibling.focus();
    }
}

function focusPreviousItem(e) {
    e.preventDefault();

    const items = list.value.querySelectorAll('[role=option]');
    const focusedItem = document.activeElement;
    const elementsArray = [].slice.call(items);

    if (!elementsArray.includes(focusedItem)) items[0].focus();
    else if (focusedItem !== elementsArray[0]){
        focusedItem.previousElementSibling.focus();
    } else {
        emit('goAbove');
    }
}

defineExpose({
    list
});
</script>
