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
    import { computed } from 'vue';

    // Utils
    import { getUniqueId } from '@/utils';

    // Composables
    import { useRegisterFormValidator } from '@/composables/validatation.composable';

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
            const { errors, isValid, validate } = useRegisterFormValidator();

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
