<template>
    <div>
        <label v-if="$slots.label" class="form-label" :for="id">
            <slot name="label"></slot>
        </label>

        <div ref="container" :class="inputGroupClassNames">
            <div class="d-flex align-items-center">
                <input
                    v-model="search"
                    @input="resetFilteredItems"
                    :id="id"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :class="inputClassNames"
                    @focus="onFocus"
                >

                <button
                    v-if="clearable && !isEmpty(modelValue)"
                    @click="clear"
                    class="form-select-clear btn-close"
                />
            </div>

            <ul ref="dropdownMenu" :class="menuClassNames" style="max-height: 210px;">
                <li
                    v-if="isLoading"
                    class="dropdown-item"
                >{{ $t('Loading') }}...</li>

                <li
                    v-else-if="items.length === 0"
                    class="dropdown-item"
                >{{ $t('No data available') }}</li>

                <li
                    v-else-if="filteredItems.length === 0"
                    class="dropdown-item"
                >{{ $t('No data found') }}</li>

                <template v-else>
                    <li
                        v-for="(item, index) in filteredItems"
                        :class="['dropdown-item text-truncate', { 'active': item.value === modelValue }]"
                        :key="index"
                        role="option"
                        @click="selectItem(item)"
                    >
                        <slot
                            name="item"
                            :item="item.raw"
                            :value="item.value"
                            :text="item.text"
                        >{{ item.text }}</slot>
                    </li>

                    <VLazyLoadHelper tag="li" @reach="addFilteredItems"/>
                </template>
            </ul>

            <div v-if="errors.length !== 0" class="invalid-text">{{ errors[0] }}</div>
        </div>
    </div>
</template>

<script>
    import {computed, nextTick, ref, watch} from 'vue';

    // Utils
    import {getUniqueId, isEmpty, resolveIteratee} from '@/utils';

    // Components
    import VLazyLoadHelper from '@/components/VLazyLoadHelper.vue';

    // Composables
    import {useRegisterFormValidator} from '@/composables/validatation.composable';
    import {onClickOutside} from '@/composables/click.composable';

    // Enums
    import ComponentSize from '@/enums/ComponentSize';

    export default {
        name: 'VAutoComplete',

        components: {
            VLazyLoadHelper
        },

        props: {
            modelValue: {
                required: true
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
            isLoading: {
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
            const { errors, isValid, validate } = useRegisterFormValidator();
            const dropdownMenu = ref()
            const isShowSelectsTop = ref(false)
            const isShowMenu = ref(false);

            function showMenu() {
                isShowMenu.value = true;
                const containerRect = container.value.getBoundingClientRect()
                let dropDownPositionFromTop = containerRect.top
                nextTick(() => {
                    const dropDownRect = dropdownMenu.value.getBoundingClientRect()
                    dropDownPositionFromTop += dropDownRect.height
                    if (dropDownPositionFromTop > window.innerHeight) {
                        isShowSelectsTop.value = true
                        document.documentElement.style.setProperty('--topPositionSelect', `calc(-100% + ${container.value.getBoundingClientRect().height}px - ${dropdownMenu.value.getBoundingClientRect().height}px)`);
                    }
                })

            }

            function hideMenu() {
                isShowMenu.value = false;
                if (isShowSelectsTop.value) {
                    isShowSelectsTop.value = false
                }
            }

            const inputGroupClassNames = computed(() => {
                return {
                    'position-relative': true,
                    [`input-group-${props.size}`]: props.size
                };
            });
            const inputClassNames = computed(() => {
                return {
                    'form-select': true,
                    'is-invalid': isValid.value === false
                };
            });
            const menuClassNames = computed(() => {
                return {
                    'dropdown-menu auto-complete w-100 overflow-y-auto overflow-x-hidden': true,
                    'show': isShowMenu.value,
                    'showTop -mt-1': isShowSelectsTop.value,
                    'mt-1': !isShowSelectsTop.value

                };
            });

            const resolveItemKey = resolveIteratee(props.itemKey);
            const resolveItemText = resolveIteratee(props.itemText);

            const search = ref('');

            const filteredItems = ref([]);
            const itemsPerPage = 10;
            let lastIndex = -1;

            function addFilteredItems() {
                let count = 0;
                let index;

                const searchValue = search.value.toLowerCase();

                for (index = lastIndex + 1; index < props.items.length; index++) {
                    const item = props.items[index];
                    const text = resolveItemText(item);

                    if (searchValue.length > 0 && !text.toLowerCase().includes(searchValue)) {
                        continue;
                    }

                    filteredItems.value.push({
                        raw: item,
                        value: resolveItemKey(item),
                        text: text
                    });

                    count++;

                    if (count === itemsPerPage) {
                        break;
                    }
                }

                lastIndex = index;
            }

            function resetFilteredItems() {
                lastIndex = -1;
                filteredItems.value = [];

                addFilteredItems();
            }

            let selectedItem;

            function selectItem(item) {
                selectedItem = item;
                search.value = item.text;

                emit('update:modelValue', item.value);

                hideMenu();
                validate();
            }

            function syncWithModelValue() {
                if (selectedItem !== undefined && selectedItem.value === props.modelValue) {
                    return;
                }

                const selectedRawItem = props.items.find(function (item) {
                    const value = resolveItemKey(item);
                    return props.modelValue === value;
                });

                if (selectedRawItem === undefined) {
                    return;
                }

                selectedItem = {
                    raw: selectedRawItem,
                    value: props.modelValue,
                    text: resolveItemText(selectedRawItem)
                };

                search.value = selectedItem.text;
            }

            watch(
                [
                    () => props.modelValue,
                    () => props.items
                ],
                function () {
                    resetFilteredItems();

                    if (!isEmpty(props.modelValue)) {
                        syncWithModelValue();
                    }
                },
                { immediate: true }
            );

            const container = ref();

            function onFocus(event) {
                event.target.select();

                showMenu();

                const { off } = onClickOutside(container, function () {
                    search.value = selectedItem !== undefined ? selectedItem.text : '';

                    hideMenu();
                    validate();
                    off();
                });
            }

            function clear() {
                selectedItem = undefined;
                search.value = '';

                emit('update:modelValue', undefined);

                resetFilteredItems();
            }

            return {
                isEmpty,

                errors,

                inputGroupClassNames,
                inputClassNames,
                menuClassNames,

                isShowMenu,
                dropdownMenu,
                search,

                filteredItems,
                addFilteredItems,
                resetFilteredItems,
                isShowSelectsTop,
                selectItem,

                container,
                onFocus,

                clear
            };
        }
    };
</script>
