import { t } from '@/services/language.service';

class Validator {
    /**
     * @type {*}
     * @private
     */
    _value;

    /**
     * @typedef {Array<Function>} ValidatorRules
     * @type {ValidatorRules}
     * @private
     */
    _rules;

    /**
     * @typedef {Array<String>} ValidatorErrors
     * @type {ValidatorErrors}
     * @private
     */
    _errors;

    /**
     * @param {*} value
     * @param {ValidatorRules} rules
     */
    constructor(value, rules) {
        this._value = value;
        this._rules = rules;
        this._errors = [];
    }

    /**
     * @returns {Boolean}
     */
    passes() {
        return this.errors().length === 0;
    }

    /**
     * @returns {Boolean}
     */
    fails() {
        return !this.passes();
    }

    /**
     * @returns {ValidatorErrors}
     */
    errors() {
        this._validate();

        return this._errors;
    }

    /**
     * @param {*} value
     * @returns void
     */
    setValue(value) {
        this._value = value;
    }

    /**
     * @param {ValidatorRules} rules
     * @returns void
     */
    setRules(rules) {
        this._rules = rules;
    }

    /**
     * @returns void
     */
    _validate() {
        const errors = [];

        for (const rule of this._rules) {
            const result = rule(this._value);

            if (typeof result === 'string') {
                errors.push(result);
            }
        }

        this._errors = errors;
    }

    /**
     * @param {String} [message]
     * @returns {Function}
     */
    static required(message) {
        return function(value) {
            if (value === null || value === undefined || value === '') {
                return message || t('Validation error message');
            }

            return true;
        };
    }

    /**
     * @param {Number} length
     * @param {String} [message]
     * @returns {Function}
     */
    static length(length, message) {
        return function(value) {
            if (typeof value === 'string' && value.length === length) {
                return true;
            }

            return message || t('Validation error message');
        };
    }

    /**
     * @param {Number} min
     * @param {String} [message]
     * @returns {Function}
     */
    static minLength(min, message) {
        return function(value) {
            if (typeof value === 'string' && value.length >= min) {
                return true;
            }

            return message || t('Validation error message');
        };
    }
}

export default Validator;
