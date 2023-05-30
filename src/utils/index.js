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
const getUniqueId = function () {
    return 'uid_' + uniqueIdCount++;
};

export { isEmptyObject, isWritableFormElement, getUniqueId };
