import { computed, ref, watch } from 'vue';

// Utils
import Validator from '@/utils/validator';

export function useValidator(value, rules, validateOnChange = true) {
    const validator = new Validator(value.value, rules.value);

    const errors = ref([]);
    const isValid = computed(() => errors.value.length === 0);

    watch(value, function() {
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
        resetValidation
    };
}
