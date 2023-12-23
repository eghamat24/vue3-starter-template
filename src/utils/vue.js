function hasVNodeSlot(vnode, slotName) {
    return vnode.children !== null && Object.prototype.hasOwnProperty.call(vnode.children, slotName);
}

export {
    hasVNodeSlot
};
