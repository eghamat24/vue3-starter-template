import {computed, getCurrentInstance, inject, onUnmounted, ref, toRef, watch} from 'vue';

// Utils
import Validator from '@/utils/validator';

// Components
import {FORM_INJECTION_KEY} from '@/components/form/VForm.vue';

export function useValidator(value, rules, validateOnChange = true) {
    const validator = new Validator(value.value, rules.value);
    const errors = ref([]);
    const isValid = computed(() => errors.value.length === 0);
    watch(value, function () {
        validator.setValue(value.value);
        if (validateOnChange) {
            validate();
        }
    });

    function validate() {
        validator.setRules(rules.value);
        errors.value = validator.errors();
        return isValid.value;
    }


    function resetValidation() {
        errors.value = [];
    }


    return {
        errors,
        isValid,
        validate,
        resetValidation,

    };
}

export function useRegisterFormValidator(validateOnChange = true, valuePropName = 'modelValue', rulesPropName = 'rules') {
    const instance = getCurrentInstance();
    const value = toRef(instance.props, valuePropName);
    const rules = toRef(instance.props, rulesPropName);
    const {errors, isValid, validate, resetValidation} = useValidator(value, rules, validateOnChange);
    const formProvider = inject(FORM_INJECTION_KEY);
    const registrationId = formProvider.register({validate, resetValidation});
    onUnmounted(() => formProvider.unregister(registrationId));


    return {
        errors,
        isValid,
        validate,
        resetValidation
    };
}
