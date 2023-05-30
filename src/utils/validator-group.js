import { isEmptyObject } from '@/utils/index';

import Validator from '@/utils/validator';

class ValidatorGroup {
    /**
     * @type {Object}
     * @private
     */
    _data;

    /**
     * @type {Object}
     * @private
     */
    _rules;

    /**
     * @type {Object}
     * @private
     */
    _errors;

    /**
     * @param {Object} data
     * @param {Object} rules
     */
    constructor(data, rules) {
        this._data = data;
        this._rules = rules;
        this._errors = {};
    }

    /**
     * @returns {Boolean}
     */
    passes() {
        return isEmptyObject(this.errors());
    }

    /**
     * @returns {Boolean}
     */
    fails() {
        return !this.passes();
    }

    /**
     * @returns {Object}
     */
    errors() {
        this._validate();

        return this._errors;
    }

    /**
     * @param {String} attribute
     * @param {*} value
     * @returns void
     */
    setAttributeValue(attribute, value) {
        this._data[attribute] = value;
    }

    /**
     * @param {String} attribute
     * @param {ValidatorRules} rules
     * @returns void
     */
    setAttributeRules(attribute, rules) {
        this._rules[attribute] = rules;
    }

    /**
     * @param {String} attribute
     * @returns {ValidatorErrors}
     */
    getAttributeErrors(attribute) {
        return this._errors[attribute] || [];
    }

    /**
     * @returns void
     */
    _validate() {
        const errors = {};

        for (const attribute in this._data) {
            const validator = new Validator(
                this._data[attribute],
                this._rules[attribute]
            );
            const attributeErrors = validator.errors();

            if (attributeErrors.length !== 0) {
                errors[attribute] = attributeErrors;
            }
        }

        this._errors = errors;
    }
}

export default ValidatorGroup;
