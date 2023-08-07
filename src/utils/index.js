function isEmptyObject(value) {
    for (const property in value) {
        if (Object.prototype.hasOwnProperty.call(value, property)) {
            return false;
        }
    }

    return true;
}

function isWritableFormElement(element) {
    if (element instanceof HTMLTextAreaElement) {
        return true;
    }

    return (
        element instanceof HTMLInputElement &&
        /^(?:text|email|number|search|tel|url|password)$/i.test(element.type)
    );
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
    isEmptyObject,
    isWritableFormElement,
    getUniqueId,

    hasVNodeSlot
};
