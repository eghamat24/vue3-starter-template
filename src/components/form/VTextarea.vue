<template>
    <label v-if="$slots.label" class="form-label" :for="id">
        <slot name="label"></slot>
    </label>

    <textarea
        :value="modelValue"
        :class="inputClassNames"
        :id="id"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
        @blur="validate"
    />

    <div
        v-if="errors.length !== 0"
        class="invalid-feedback"
    >
        {{ errors[0] }}
    </div>
</template>

<script>
    import { computed, inject, onUnmounted, toRef } from 'vue';

    // Utils
    import { getUniqueId } from '@/utils';

    // Composables
    import { useValidator } from '@/composables/validatation.composable';

    // Components
    import { FORM_INJECTION_KEY } from '@/components/form/VForm.vue';

    export default {
        name: 'VTextArea',

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
            rows: {
                type: [String, Number],
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

            const inputClassNames = computed(() => {
                return {
                    'form-control': true,
                    'is-invalid': isValid.value === false
                };
            });

            function handleInput(event) {
                context.emit('update:modelValue', event.target.value);
            }

            return {
                inputClassNames,

                errors,
                validate,

                handleInput
            };
        }
    };
</script>
