<template>
    <div>
        <slot></slot>

        <div v-if="errors.length !== 0" class="invalid-text">
            {{ errors[0] }}
        </div>
    </div>
</template>

<script>
    import { provide } from 'vue';

    // Utils
    import { getUniqueId } from '@/utils';

    // Composables
    import { useRegisterFormValidator } from '@/composables/validatation.composable';

    export const RADIO_GROUP_INJECTION_KEY = 'RadioGroupProvider';

    export default {
        name: "VRadioGroup",

        props: {
            modelValue: {
                default: null
            },
            name: {
                default: () => getUniqueId()
            },
            rules: {
                type: Array,
                default: () => []
            }
        },

        emits: ['update:modelValue'],

        setup(props, { emit }) {
            const { errors, validate, resetValidation } = useRegisterFormValidator();

            provide(RADIO_GROUP_INJECTION_KEY, {
                register() {
                    return {
                        value: props.modelValue,
                        name: props.name,
                        onChange: handleChange
                    };
                }
            });

            function handleChange(value) {
                emit('update:modelValue', value);
                validate();
            }

            return {
                errors,
                resetValidation
            };
        }
    };
</script>
