import { reflow, executeAfterTransition } from 'bootstrap/js/src/util';

function isEmptyObject(value) {
    for (const property in value) {
        if (Object.prototype.hasOwnProperty.call(value, property)) {
            return false;
        }
    }

    return true;
}

function isWritableFormElement(type) {
    return /^(?:text|email|number|search|tel|url|password)$/i.test(type);
}

let uniqueIdCount = 0;
function getUniqueId() {
    return 'uid_' + uniqueIdCount++;
}

export {
    reflow,
    executeAfterTransition,
    isEmptyObject,
    isWritableFormElement,
    getUniqueId
};
