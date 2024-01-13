import { ref, watch } from 'vue';

export function useServerPagination(initialPage = 1, initialItemsPerPage = 10) {
    const page = ref(initialPage);
    const itemsPerPage = ref(initialItemsPerPage);

    function getPaginationParams() {
        return {
            _start: (page.value - 1) * itemsPerPage.value,
            _limit: itemsPerPage.value
        };
    }

    const callbacks = [];

    function onChangePagination(callback) {
        callbacks.push(callback);
    }

    function _triggerCallbacks() {
        for (const callback of callbacks) {
            callback(getPaginationParams());
        }
    }

    watch([page, itemsPerPage], () => _triggerCallbacks());

    return {
        page,
        itemsPerPage,

        getPaginationParams,
        onChangePagination
    };
}
