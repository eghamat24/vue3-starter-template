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

// Vue Utils

function hasVNodeSlot(vnode, slotName) {
    return vnode.children !== null && Object.prototype.hasOwnProperty.call(vnode.children, slotName);
}

export {
    reflow,
    executeAfterTransition,
    isEmptyObject,
    isWritableFormElement,
    getUniqueId,
    hasVNodeSlot
};
