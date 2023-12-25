import { ref, getCurrentInstance } from 'vue';

// Utils
import { getUniqueId } from '@/utils';

const items = ref([]);

export function installToast() {
    const instance = getCurrentInstance();

    if (instance.type.name !== 'VToasts') {
        throw new Error('installToast should only be called in the Toasts component');
    }

    return items;
}

export function useToast() {
    function showToast({ body, theme, duration = 5000, clearable = true , title}) {
        const id = getUniqueId();

        const _timeOutId = setTimeout(function () {
            hideToast(id);
        }, duration);

        items.value.push({
            id,
            body,
            duration,
            theme,
            clearable,
            title,
            _time_out_id: _timeOutId
        });

        return id;
    }

    function hideToast(id) {
        const index = items.value.findIndex(function (item) {
            return item.id === id;
        });

        clearTimeout(items.value[index]._time_out_id);

        items.value.splice(index, 1);
    }

    return {
        showToast,
        hideToast
    };
}
