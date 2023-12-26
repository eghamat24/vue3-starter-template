<template>
    <div>
        <label v-if="$slots.label" class="form-label" :for="id">
            <slot name="label"></slot>
        </label>

        <div ref="container" :class="inputGroupClassNames">
            <div class="d-flex align-items-center">
                <input
                    v-model="search"
                    ref="inputElement"
                    :id="id"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :class="inputClassNames"
                    autocomplete="off"
                    @focus="onFocus"
                    @keydown.down="focusWithArrowDown"
                    @keydown.delete="clearInput"
                >
                <button
                    v-if="modelValue && clearable"
                    @click="clearInput"
                    class="btn-close position-absolute end-0 me-2"
                />
            </div>

            <ul
                ref="menu"
                :class="menuClassNames"
                @keydown.down="focusNextItem"
                @keydown.up="focusPreviousItem"
            >
                <li v-if="filteredItems.length === 0" class="ms-2">
                    {{ $t('No data available') }}
                </li>
                <li
                    v-else
                    v-for="(item, index) in filteredItems"
                    class="dropdown-item"
                    :key="index"
                    role="option"
                    tabindex="0"
                    @click="selectItem(item)"
                    @keyup.enter="selectItem(item)"
                >
                    <slot name="item" :item="item">
                        {{ itemTextFunction(item) }}
                    </slot>
                </li>
            </ul>

            <div v-if="errors.length !== 0" class="invalid-text">{{ errors[0] }}</div>

        </div>
    </div>
</template>

<script>
    import { computed, toRef, inject, onUnmounted, ref } from 'vue';

    // Utils
    import { getUniqueId } from '@/utils';

    // Composables
    import { useValidator } from '@/composables/validatation.composable';
    import { onClickOutside } from '@/composables/click.composable';

    // Components
    import { FORM_INJECTION_KEY } from '@/components/form/VForm.vue';

    // Enums
    import ComponentSize from "@/enums/ComponentSize";

    export default {
        name: 'VAutoComplete',

        props: {
            modelValue: {
                default: null
            },
            id: {
                type: String,
                default: () => getUniqueId()
            },
            placeholder: {
                type: String,
                default: null
            },
            disabled: {
                type: Boolean,
                default: false
            },
            size: {
                type: String,
                default: null,
                validator(value) {
                    return [ComponentSize.SM, ComponentSize.LG].includes(value);
                }
            },
            items: {
                type: Array,
                default: () => [],
                required: true
            },
            itemKey: {
                type: [Function, String],
                default: null
            },
            itemText: {
                type: [Function, String],
                default: null
            },
            clearable: {
                type: Boolean,
                default: false
            },
            rules: {
                type: Array,
                default: () => []
            }
        },

        emits: ['update:modelValue'],

        setup(props, { emit }) {
            const isShowMenu = ref(false);

            function showMenu() {
                isShowMenu.value = true;
            }

            function hideMenu() {
                isShowMenu.value = false;
            }

            const inputGroupClassNames = computed(() => {
                return {
                    'position-relative': true,
                    [`input-group-${props.size}`]: props.size
                };
            });
            const inputClassNames = computed(() => {
                return {
                    'form-control': true,
                    'is-invalid': isValid.value === false
                };
            });
            const menuClassNames = computed(() => {
                return {
                    'dropdown-menu w-100': true,
                    'show': isShowMenu.value
                };
            });

            const value = toRef(props, 'modelValue');
            const rules = toRef(props, 'rules');

            const { errors, isValid, validate, resetValidation } = useValidator(value, rules);

            const formProvider = inject(FORM_INJECTION_KEY);
            const registrationId = formProvider.register({ validate, resetValidation });
            onUnmounted(() => formProvider.unregister(registrationId));

            const itemKeyFunction = computed(() => {
                if (props.itemKey === null) {
                    return (item) => item;
                }

                if (typeof props.itemKey === 'string') {
                    return (item) => item[props.itemKey];
                }

                return props.itemKey;
            });
            const itemTextFunction = computed(() => {
                if (props.itemText === null) {
                    return (item) => item;
                }

                if (typeof props.itemText === 'string') {
                    return (item) => item[props.itemText];
                }

                return props.itemText;
            });

            const search = ref('');
            const filteredItems = computed(() => {
                if (search.value.length === 0) {
                    return props.items;
                }

                return props.items.filter(item => {
                    const text = itemTextFunction.value(item);
                    return text.toLowerCase().includes(search.value.toLowerCase());
                });
            });

            let selectedItem;

            function selectItem(item) {
                selectedItem = item;

                emit('update:modelValue', itemKeyFunction.value(item));

                search.value = itemTextFunction.value(item);

                hideMenu();
                validate();
            }

            const container = ref();
            const menu = ref();
            const inputElement = ref();

            function onFocus() {
                showMenu();

                const { off } = onClickOutside(container, function () {
                    if (selectedItem) {
                        search.value = itemTextFunction.value(selectedItem);
                    }else {
                        search.value = '';
                    }

                    hideMenu();
                    validate();
                    off();
                });
            }

            function clearInput() {
                emit('update:modelValue', undefined);
                search.value = '';
                selectedItem = undefined;
            }

            function focusWithArrowDown(event) {
                showMenu();
                event.preventDefault();
                menu.value.querySelectorAll('[role=option]')[0].focus();
            }

            function focusNextItem(e) {
                e.preventDefault();

                const items = menu.value.querySelectorAll('[role=option]');
                const focusedItem = document.activeElement;
                const elementsArray = [].slice.call(items);

                if (!elementsArray.includes(focusedItem)) {
                    items[0].focus();
                } else if (focusedItem !== elementsArray[elementsArray.length - 1]) {
                    focusedItem.nextElementSibling.focus();
                }
            }

            function focusPreviousItem(e) {
                e.preventDefault();

                const items = menu.value.querySelectorAll('[role=option]');
                const focusedItem = document.activeElement;
                const elementsArray = [].slice.call(items);

                if (!elementsArray.includes(focusedItem)) {
                    items[0].focus();
                } else if (focusedItem !== elementsArray[0]) {
                    focusedItem.previousElementSibling.focus();
                } else {
                    inputElement.value.focus();
                }
            }

            return {
                inputGroupClassNames,
                inputClassNames,
                menuClassNames,

                isShowMenu,

                itemTextFunction,

                search,
                filteredItems,

                errors,
                validate,

                selectItem,

                container,
                menu,
                inputElement,
                onFocus,

                clearInput,
                focusWithArrowDown,
                focusNextItem,
                focusPreviousItem
            };
        }
    };
</script>

<style lang="scss">

</style>