import {computed, getCurrentInstance, inject, onUnmounted, ref, toRef, watch} from 'vue';

// Utils
import Validator from '@/utils/validator';

// Components
import {FORM_INJECTION_KEY} from '@/components/form/VForm.vue';

export function useValidator(value, rules, validateOnChange = true) {
    const validator = new Validator(value.value, rules.value);
    const isFirstCreateValidation = ref(true)
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

    function handleValidateGlobal() {
        if (isFirstCreateValidation.value) {
            isFirstCreateValidation.value = false
            return
        }

        let validInput

        validator.setValue(value.value);
        validator.setRules(rules.value);
        errors.value = validator.errors();
        validInput = errors.value.length === 0
        errors.value = [];
        return validInput;

    }


    return {
        errors,
        isValid,
        validate,
        resetValidation, handleValidateGlobal

    };
}

export function useRegisterFormValidator(validateOnChange = true, valuePropName = 'modelValue', rulesPropName = 'rules') {
    const instance = getCurrentInstance();
    const value = toRef(instance.props, valuePropName);
    const rules = toRef(instance.props, rulesPropName);
    const {errors, isValid, validate, resetValidation, handleValidateGlobal} = useValidator(value, rules, validateOnChange);
    const formProvider = inject(FORM_INJECTION_KEY);
    const registrationId = formProvider.register({validate, resetValidation, handleValidateGlobal, value});
    onUnmounted(() => formProvider.unregister(registrationId));


    return {
        errors,
        isValid,
        validate,
        resetValidation
    };
}
