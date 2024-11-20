<template>
<label v-if="$slots.label" class="form-label" :for="id">
    <slot name="label"></slot>
</label>


<div class="input-group has-validation">
    <slot name="prepend"></slot>

    <input :value="modelValue" @input="handleInput" @blur="validate" :id="id" :type="type"
           :placeholder="placeholder" :disabled="disabled" :class="inputClassNames"/>

    <slot name="append"></slot>

    <div v-if="errors.length !== 0" class="invalid-feedback">{{ errors[0] }}
    </div>
</div>
</template>

<script>
import {computed} from 'vue';

// Utils
import {getUniqueId, isWritableFormElement} from '@/utils';

// Composables
import {useRegisterFormValidator} from '@/composables/validatation.composable';

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
        const {errors, isValid, validate} = useRegisterFormValidator();

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
            handleInput,
        };
    }
};
</script>
