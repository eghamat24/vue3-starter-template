<template>
    <input
        type="radio"
        :id="id"
        :disabled="disabled"
        :name="name"
        :checked="isChecked"
        :value="value"
        :class="inputClassNames"
        @change="onChange(value)"
    >

    <label :for="id" :class="labelClassNames">
        <slot name="label"></slot>
    </label>
</template>

<script>
    import { computed, inject } from 'vue';

    // Utils
    import { getUniqueId } from '@/utils';

    // Components
    import { RADIO_GROUP_INJECTION_KEY } from '@/components/form/radio/VRadioGroup.vue';

    // Enums
    import ThemeColor from '@/enums/ThemeColor';

    export default {
        name: "VRadio",

        props: {
            value: {
                type: [String, Number, Boolean]
            },
            id: {
                type: String,
                default: () => getUniqueId()
            },
            disabled: {
                type: Boolean,
                default: false
            },
            button: {
                type: Boolean,
                default: false
            },
            outlined: {
                type: Boolean,
                default: false
            },
            theme: {
                type: String,
                default: ThemeColor.PRIMARY,
                validator(value) {
                    return Object.values(ThemeColor).includes(value);
                }
            }
        },

        setup(props) {
            const RadioGroupProvider = inject(RADIO_GROUP_INJECTION_KEY);

            const { onChange, name, value } = RadioGroupProvider.register();

            const isChecked = computed(() => value.value === props.value);

            const inputClassNames = computed(() => {
                return {
                    "form-check-input": !props.button && !props.outlined,
                    "btn-check": (props.button || props.outlined)
                };
            });

            const labelClassNames = computed(() => {
                return {
                    "form-check-label ms-2": !props.button && !props.outlined,
                    [`btn btn-${props.theme}`]: props.button,
                    [`btn btn-outline-${props.theme}`]: props.outlined
                };
            });

            return {
                inputClassNames,
                labelClassNames,

                isChecked,

                name,
                onChange
            };
        }
    };
</script>