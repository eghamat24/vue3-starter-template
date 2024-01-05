import { getCurrentInstance, ref, computed } from 'vue';

// Utils
import { hasOwnProperty } from '@/utils';

export function useModelRef(propName) {
    const instance = getCurrentInstance();
    const internal = ref(instance.props[propName]);

    const hasUpdateEvent = computed(() => hasOwnProperty(instance.vnode.props, `onUpdate:${propName}`));

    return computed({
        get() {
            return hasUpdateEvent.value ? instance.props[propName] : internal.value;
        },
        set(value) {
            internal.value = value;
            instance.emit(`update:${propName}`, value);
        }
    });
}
