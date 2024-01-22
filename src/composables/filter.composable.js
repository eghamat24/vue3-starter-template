import { reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Utils
import { hasOwnProperty, normalizeData } from '@/utils';

export function useApplyFilters(initialFilters) {
    const route = useRoute();
    const router = useRouter();

    const filters = reactive(initialFilters);

    for (const key in filters) {
        if (hasOwnProperty(route.query, key)) {
            filters[key] = normalizeData(route.query[key]);
        }
    }

    function getCleanFilters() {
        const result = {};

        for (const key in filters) {
            const value = filters[key];

            if (value === '') {
                result[key] = undefined;
                continue;
            }

            result[key] = filters[key];
        }

        return result;
    }

    watch(filters, function () {
        router.push({
            query: {
                ...route.query,
                ...getCleanFilters()
            }
        });
    });

    return filters;
}
