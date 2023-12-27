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

function getScrollBarWidth() {
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
}

function hideScrollBar() {
    const width = getScrollBarWidth();
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${width}px`;
}

function resetScrollBar() {
    document.body.style.overflow = null;
    document.body.style.paddingRight = null;
}

export {
    reflow,
    executeAfterTransition,
    isEmptyObject,
    isWritableFormElement,
    getUniqueId,
    hasVNodeSlot,
    hideScrollBar,
    resetScrollBar
};
