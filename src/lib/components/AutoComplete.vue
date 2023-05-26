<template>
<div class="fd-form-item">
    <div class="fd-popover" ref="select">
        <div class="fd-popover__control">
            <div class="fd-select">
                <Input
                    ref="searchInput"
                    v-model="currentItemTitle"
                    :clearable="props.clearable"
                    group
                    @click="showMenu"
                    @keydown.down="focusWithArrowDown"
                    @clear="clear"
                    @update:modelValue="searchChanged"
                >
                    <InputAddon>
                        <Icon name="slim-arrow-down"/>
                    </InputAddon>
                    <Progress v-if="loading"/>
                </Input>
            </div>
        </div>
        <div
            :aria-hidden="menuIsHidden"
            class="fd-popover__body fd-popover__body--no-arrow fd-popover__body--dropdown fd-popover__body--dropdown-fill"
        >
            <List
                ref="selectList"
                v-if="currentItems"
                :type="ListTypes.DROPDOWN"
                @goAbove="focusOnItem(searchInput.input)"
            >
                <ListItem
                    v-for="(item, index) in currentItems"
                    :key="index"
                    :selected="checkIsSelected(item)"
                    @click="selectItem(item)"
                    @keyup.enter="selectItem(item)"
                >
                    {{ item[props.itemTitle] }}
                </ListItem>
            </List>
        </div>
    </div>
</div>
</template>

<script setup>
// Vue
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

// Enums
import { ListTypes } from '@/lib/enums/Type.enum';

// Components
import Icon from '@/lib/components/Icon.vue';
import List from '@/lib/components/List/List.vue';
import ListItem from '@/lib/components/List/ListItem.vue';
import Input from '@/lib/components/InputGroup/Input.vue';
import InputAddon from '@/lib/components/InputGroup/InputAddon.vue';
import Progress from '@/lib/components/Progress.vue';

// Utils
import { focusOnItem, focusOnList } from '@/lib/utils/focus.util';

const props = defineProps({
    modelValue: {
        required: true
    },
    items: {
        required: true
    },
    itemTitle: {
        type: String,
        default: 'title'
    },
    itemValue: {
        type: String,
        default: 'value'
    },
    returnObject: {
        type: Boolean,
        default: false
    },
    clearable: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    count: {
        type: Number,
        default: 10
    }
});

const searchItem = ref(null);

const currentItemTitle = computed({
    get() {
        const { modelValue, loading, items, itemValue, itemTitle } = props;
        if (modelValue && !loading)
            return items.find((item) => item[itemValue] === modelValue)[
                itemTitle
                ];
        return searchItem.value;
    },
    set(value) {
        searchItem.value = value;
    }
});

const currentItems = computed(() => {
    const { items, itemTitle, count } = props;
    return searchItem.value?.length
        ? items
            .filter((item) => item[itemTitle].includes(searchItem.value))
            .slice(0, count)
        : items?.slice(0, count);
});

const selectedItem = computed(() => {
    const { items, modelValue, returnObject, itemValue } = props;
    if (returnObject){
        return items.find((item) => item === modelValue);
    } else {
        return items.find((item) => item[itemValue] === modelValue);
    }
});

const menuIsHidden = ref(true);

function toggleMenu() {
    menuIsHidden.value = !menuIsHidden.value;
}

function showMenu() {
    menuIsHidden.value = false;
}

function hideMenu() {
    menuIsHidden.value = true;
}

function searchChanged() {
    showMenu();
    clear();
}

const selectList = ref(null);

function focusWithArrowDown(e) {
    showMenu();
    focusOnList(e, selectList.value.list);
}

const emit = defineEmits(['update:modelValue']);

function clear() {
    emit('update:modelValue', undefined);
}

function checkIsSelected(item) {
    return (
        selectedItem.value &&
        selectedItem.value[props.itemValue] === item[props.itemValue]
    );
}

const searchInput = ref(null);

function selectItem(item) {
    toggleMenu();
    emit(
        'update:modelValue',
        props.returnObject ? item : item[props.itemValue]
    );
    searchInput.value.input.focus();
}

const select = ref(null);
onClickOutside(select, () => {
    hideMenu();
});
</script>

<style scoped>
.progress-bar {
    position: absolute;
    bottom: 0;
}
</style>
