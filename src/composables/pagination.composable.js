import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Utils
import { hasOwnProperty, normalizeData } from '@/utils';

export function usePagination(initialPage = 1, initialItemsPerPage = 10) {
    const page = ref(initialPage);
    const itemsPerPage = ref(initialItemsPerPage);

    const paginationParams = computed(() => {
        return {
            _start: (page.value - 1) * itemsPerPage.value,
            _limit: itemsPerPage.value
        };
    });

    return {
        page,
        itemsPerPage,
        paginationParams
    };
}

export function useRoutePagination(initialPage = 1, initialItemsPerPage = 10) {
    const route = useRoute();
    const router = useRouter();

    if (hasOwnProperty(route.query, 'page')) {
        initialPage = normalizeData(route.query.page);
    }

    if (hasOwnProperty(route.query, 'items_per_page')) {
        initialItemsPerPage = normalizeData(route.query.items_per_page);
    }

    const {
        page,
        itemsPerPage,
        paginationParams
    } = usePagination(initialPage, initialItemsPerPage);

    watch(paginationParams, function () {
        router.push({
            query: {
                ...route.query,
                page: page.value,
                items_per_page: itemsPerPage.value
            }
        });
    });

    return {
        page,
        itemsPerPage,
        paginationParams
    };
}
