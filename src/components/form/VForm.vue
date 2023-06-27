<script>
import {h, reactive, computed, provide, watch,watchEffect} from 'vue';

// Utils
import {getUniqueId} from '@/utils';
export const FORM_INJECTION_KEY = 'FormProvider';
export default {
    props: {
        isValid: {
            default: false
        }
    },

    name: 'VForm',
    emits: ['update:modelValue'],
    setup(props, context) {
        const inputs = reactive({});
        const isValid = computed(() => {
            for (const id in inputs) {
                const input = inputs[id];
                input.is_valid = input.validate()
                if (input.is_valid === false) {
                    return false;
                }
            }
            return true
        });
        watchEffect(() => {
            context.emit('update:modelValue', isValid.value);
        });

        function resetValidation() {
            for (const id in inputs) {
                const input = inputs[id];
                input.resetValidation();
            }
        }
        function handleSubmit(event) {
            event.preventDefault();

        }
        provide(FORM_INJECTION_KEY, {
            register(input) {
                const id = getUniqueId();
                inputs[id] = {
                    is_valid: false,
                    validate: input.validate,
                    resetValidation: input.resetValidation
                };
                return id;
            },
            unregister(id) {
                delete inputs[id];
            },

        });

        return () => h(
            'form',
            {onSubmit: handleSubmit, onReset: resetValidation,},
            context.slots
        );
    }
};
</script>


