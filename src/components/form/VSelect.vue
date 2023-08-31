<template>
    <select
        :class="selectClassNames"
        :disabled="disabled"
        :value="selectValue"
        @change="handleChange"
    >
        <option v-if="label" disabled value="">{{ label }}</option>
        <option
            v-for="(item, index) of items"
            :key="index"
            :value="getOptionValue(item)"
        >
            {{ itemTitleFunction(item) }}
        </option>
    </select>

    <div
        v-if="errors.length !== 0"
        class="invalid-feedback"
    >
        {{ errors[0] }}
    </div>
</template>

<script>
    // Vue
    import { computed, inject, onUnmounted, toRef } from 'vue';

    // Composables
    import { useValidator } from '@/composables/validatation.composable';

    // Enums
    import ComponentSize from "@/enums/ComponentSize";

    // Components
    import { FORM_INJECTION_KEY } from '@/components/form/VForm.vue';


    export default {
        name: 'VSelect',

        props: {
            modelValue: {
                default: null
            },
            items: {
                type: Array
            },
            label: {
                type: String,
                default: null
            },
            size: {
                type: String,
                validator(value) {
                    return [
                        ComponentSize.SM,
                        ComponentSize.LG
                    ].includes(value);
                }
            },
            itemTitle: {
                type: [Function, String],
                default: null
            },
            itemValue: {
                type: String,
                default: null
            },
            returnObject: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            rules: {
                type: Array,
                default: () => []
            }
        },

        emits: ['update:modelValue'],

        setup(props, context) {
            const value = toRef(props, 'modelValue');
            const rules = toRef(props, 'rules');

            const { errors, isValid, validate, resetValidation } = useValidator(value, rules);

            const formProvider = inject(FORM_INJECTION_KEY);
            const registrationId = formProvider.register({ validate, resetValidation });
            onUnmounted(() => formProvider.unregister(registrationId));

            const selectClassNames = computed(() => {
                return {
                    'form-select': true,
                    [`form-select-${props.size}`]: props.size,
                    'is-invalid': isValid.value === false
                };
            });

            const itemTitleFunction = computed(() => {
                if (props.itemTitle === null) {
                    return (item) => item;
                }

                if (typeof props.itemTitle === 'string') {
                    return (item) => item[props.itemTitle];
                }

                return props.itemTitle;
            });

            const selectValue = computed(() => {
                if (!props.modelValue) {
                    return "";
                }

                if (props.returnObject) {
                    return props.modelValue[props.itemValue];
                }

                return props.modelValue;
            });

            const getOptionValue = (item) => {
                return props.itemValue ? item[props.itemValue] : item;
            }

            function handleChange(event) {
                let newValue;

                if (props.returnObject) {
                    newValue = props.items.find(item => item[props.itemValue] == event.target.value);
                } else {
                    newValue = event.target.value;
                }

                context.emit('update:modelValue', newValue);
            }

            return {
                handleChange,
                selectValue,
                getOptionValue,

                itemTitleFunction,

                selectClassNames,
                errors
            }
        }
    }
</script>