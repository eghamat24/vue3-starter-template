<template>
    <div>
        <slot></slot>

        <div v-if="errors.length !== 0" class="invalid-text">
            {{ errors[0] }}
        </div>
    </div>
</template>

<script>
    import { inject, onUnmounted, provide, toRef } from 'vue';

    // Utils
    import { getUniqueId } from '@/utils';

    // Composables
    import { useValidator } from '@/composables/validatation.composable';

    // Components
    import { FORM_INJECTION_KEY } from '@/components/form/VForm.vue';

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

        setup(props, {emit}) {
            const value = toRef(props, 'modelValue');
            const rules = toRef(props, 'rules');

            const { errors, validate, resetValidation } = useValidator(value, rules);

            const formProvider = inject(FORM_INJECTION_KEY);
            const registrationId = formProvider.register({ validate, resetValidation });
            onUnmounted(() => formProvider.unregister(registrationId));

            provide(RADIO_GROUP_INJECTION_KEY, {
                register() {
                    return {
                        value,
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