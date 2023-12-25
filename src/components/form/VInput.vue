<template>
    <label v-if="$slots.label" class="form-label" :for="id">
        <slot name="label"></slot>
    </label>

    <div class="input-group has-validation">
        <slot name="prepend"></slot>

        <input
            :value="modelValue"
            @input="handleInput"
            @blur="validate"
            :id="id"
            :type="type"
            :placeholder="placeholder"
            :disabled="disabled"
            :class="inputClassNames"
        />

        <slot name="append"></slot>

        <div
            v-if="errors.length !== 0"
            class="invalid-feedback"
        >{{ errors[0] }}</div>
    </div>
</template>

<script>
import { computed, toRef, inject, onUnmounted } from 'vue';

// Utils
import { getUniqueId, isWritableFormElement } from '@/utils';

// Composables
import { useValidator } from '@/composables/validatation.composable';

// Components
import { FORM_INJECTION_KEY } from '@/components/form/VForm.vue';

export default {
    name: 'VInput',

    props: {
        modelValue: {
            default: null
        },
        id: {
            type: String,
            default: () => getUniqueId()
        },
        type: {
            type: String,
            default: 'text',
            validator: isWritableFormElement
        },
        placeholder: {
            type: String,
            default: null
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

        const inputClassNames = computed(() => {
            const classNames = ['form-control'];

            if (isValid.value === false) {
                classNames.push('is-invalid');
            }

            return classNames;
        });

        function handleInput(event) {
            context.emit('update:modelValue', event.target.value);
        }

        return {
            errors,
            validate,

            inputClassNames,

            handleInput
        };
    }
};
</script>
