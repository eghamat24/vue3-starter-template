<script>
    import { computed , h , provide , reactive , ref , watch } from 'vue';

    // Utils
    import {getUniqueId} from '@/utils';

    export const FORM_INJECTION_KEY = 'FormProvider';

    export default {
        name: 'VForm',

        emits: ['submit', 'update:isValidForm'],

        props: {
            isValid: {
                default: false,
                required: false
            }
        },
        setup(props, context) {
            const isValidForm = ref(true)
            const inputs = reactive({});
            watch(() => inputs, (newValue) => validateOnChange(newValue), {deep: true})

            function validate() {
                for (const id in inputs) {
                    const input = inputs[id];
                    input.is_valid = input.validate();
                }
            }

            function validateOnChange(newValue) {
                for (const id in newValue) {
                    const input = inputs[id];
                    if (!input.handleValidateGlobal()) {
                        isValidForm.value = false
                        context.emit('update:isValidForm', isValidForm.value)
                        return
                    } else {
                        isValidForm.value = true
                        context.emit('update:isValidForm', isValidForm.value)
                    }
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
                        handleValidateGlobal: input.handleValidateGlobal,
                        value: input.value,
                        is_valid: false,
                        validate: input.validate,
                        resetValidation: input.resetValidation,
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
                    if (!input.value) {
                        return false;
                    }
                }

                return true;
            });

            function handleSubmit(event) {
                event.preventDefault();

                validate();

                if (isValid.value === true) {
                    context.emit('update:isValidForm', true)
                    context.emit('submit', event);
                } else {
                    context.emit('update:isValidForm', false)
                    context.emit('isValid', isValid.value)
                }
            }


            function renderSubmitter() {
                return h('input', {
                    type: 'submit',
                    class: 'visually-hidden'
                });
            }

            return () => h(
                'form',
                {onSubmit: handleSubmit, onReset: resetValidation},
                [context.slots.default(), renderSubmitter()]
            );
        }
    };
</script>
