// Utils
import { isObject, normalizeData } from '../utils/index';

function parseKey(keyString) {
    const keyParts = [];

    const mainKeyPattern = /(\w+)(?=\[)/;
    const bracketContentsPattern = /\[(.*?)\]/g;

    const mainKeyMatch = keyString.match(mainKeyPattern);

    if (mainKeyMatch) {
        const mainKey = mainKeyMatch[1];
        keyParts.push(mainKey);

        const bracketMatches = [...keyString.matchAll(bracketContentsPattern)];
        const nestedKeys = bracketMatches.map(match => match[1]);
        keyParts.push(...nestedKeys);
    } else {
        keyParts.push(keyString);
    }

    return keyParts;
}

function isNumericString(string) {
    return /^\d+$/.test(string);
}

function setValue(obj, path, value) {
    let current = obj;

    for (let i = 0; i < path.length; i++) {
        const part = path[i];
        const isNumeric = isNumericString(part);
        const isLast = i === path.length - 1;

        if (isLast) {
            current[part] = value;
            break;
        }
        if (!current[part]) {
            current[part] = isNumeric && Array.isArray(current) ? [] : {};
        }

        if (isNumeric && Array.isArray(current)) {
            const index = parseInt(part, 10);
            if (index >= current.length) {
                current.length = index + 1;
            }
            current = current[index] || (current[index] = {});
        } else {
            current = current[part];
        }
    }
}

function convertObjectsToArrays(obj) {
    if (!isObject(obj)) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(convertObjectsToArrays);
    }

    const keys = Object.keys(obj);
    const isArrayLike = keys.every((key, index) => String(index) === key);

    if (isArrayLike) {
        return keys.map(key => convertObjectsToArrays(obj[key]));
    } else {
        const newObj = {};
        for (const key of keys) {
            newObj[key] = convertObjectsToArrays(obj[key]);
        }
        return newObj;
    }
}

const QueryString = {
    /**
     *
     *
     * @param {String | Object} input
     * @returns {Object}
     */
    parse(input) {
        const result = {};

        let obj = input;

        if (typeof input === 'string') {
            obj = Object.fromEntries(new URLSearchParams(input).entries());
        }

        for (const key in obj) {
            const value = obj[key];
            const path = parseKey(key);

            const convertedValue = Array.isArray(value) ? value : normalizeData(value);

            setValue(result, path, convertedValue);
        }

        return convertObjectsToArrays(result);
    },

    /**
     *
     * @param object
     * @returns {string}
     */
    stringify(object) {
        const params = new URLSearchParams();

        function traverse(value, path = '') {
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    traverse(item, `${path}[${index}]`);
                });
            } else if (isObject(value)) {
                for (const key in value) {
                    traverse(value[key], path ? `${path}[${key}]` : key);
                }
            } else if (value !== undefined) {
                params.append(path, value);
            }
        }

        traverse(object);
        return params.toString();
    }
};

export default QueryString;
