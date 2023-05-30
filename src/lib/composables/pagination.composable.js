import { computed, inject, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import config from '@/config';

const defaultConfig = {
    page: config.defaultPagingConfig.page,
    itemsPerPage: config.defaultPagingConfig.itemsPerPage
};

export function usePagination() {
    const route = useRoute();
    const router = useRouter();

    const pagingData = reactive({
        page: route?.query.page
            ? Number(route?.query.page)
            : defaultConfig.page,
        itemsPerPage: defaultConfig.itemsPerPage
    });

    const defaultPagingData = computed(() => {
        return defaultConfig;
    });

    const total = inject('total-count');

    const pagesCount = computed(() => {
        return Math.ceil(total.value / pagingData.itemsPerPage);
    });

    const changePage = (e) => {
        pagingData.page = Number(e.target.value);
    };

    const goNextPage = () => {
        const page = Number(route?.query.page)
            ? Number(route?.query.page) + 1
            : 2;
        updateRoute(page);
    };

    const goPreviousPage = () => {
        if (!route?.query.page || Number(route?.query.page) === 1) return;

        const page = Number(route?.query.page) - 1;
        updateRoute(page);
    };

    const goLastPage = () => {
        updateRoute(pagesCount.value);
    };

    const updateRoute = (page) => {
        router.push({
            query: {
                ...route.query,
                page
            }
        });
    };

    watch(route, () => {
        pagingData.page = Number(route?.query.page) || 1;
    });

    watch(
        () => pagingData.page,
        (page) => {
            if (Number(route?.query.page) !== page){
                updateRoute(page);
            }
        }
    );

    return {
        defaultPagingData,
        pagingData,
        pagesCount,
        total,
        changePage,
        goNextPage,
        goPreviousPage,
        goLastPage
    };
}
