<script>
import { h, reactive, computed, provide } from 'vue';

// Utils
import { getUniqueId } from '@/utils';

export const FORM_INJECTION_KEY = 'FormProvider';

export default {
    name: 'VForm',

    emits: ['submit'],

    setup(props, context) {
        const inputs = reactive({});

        function validate() {
            for (const id in inputs) {
                const input = inputs[id];
                input.is_valid = input.validate();
            }
        }

        function resetValidation() {
            for (const id in inputs) {
                const input = inputs[id];
                input.resetValidation();
            }
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
            }
        });

        const isValid = computed(() => {
            for (const id in inputs) {
                const input = inputs[id];

                if (input.is_valid === false) {
                    return false;
                }
            }

            return true;
        });

        function handleSubmit(event) {
            event.preventDefault();

            validate();

            if (isValid.value === true) {
                context.emit('submit', event);
            }
        }

        return () => h(
            'form',
            { onSubmit: handleSubmit, onReset: resetValidation },
            context.slots
        );
    }
};
</script>
