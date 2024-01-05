// Utils
import { hasOwnProperty } from '@/utils/index';

function hasVNodeSlot(vnode, slotName) {
    return vnode.children !== null && hasOwnProperty(vnode.children, slotName);
}

export {
    hasVNodeSlot
};
