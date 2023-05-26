<template>
<div class="fd-pagination">
    <nav
        class="fd-pagination__nav"
        role="navigation"
        aria-label="first page example, pagination with more than 9 pages"
    >
        <a
            @click="goPreviousPage"
            class="fd-button fd-button--compact fd-button--transparent fd-pagination__button"
            aria-label="Previous page"
            :aria-disabled="disableGoPreviousPage"
        >
            صفحه قبل
        </a>

        <input
            class="fd-input fd-input--compact fd-pagination__input"
            type="number"
            min="1"
            max="500"
            required
            @keyup.enter="changePage"
            :value="pagingData.page"
        />
        از
        <a
            @click="goLastPage"
            class="fd-button fd-button--compact fd-button--transparent fd-pagination__link"
            aria-label="Goto page 500"
        >{{ pagesCount }}</a
        >

        <a
            @click="goNextPage"
            class="fd-button fd-button--compact fd-button--transparent fd-pagination__button"
            aria-label="Next page"
            aria-disabled="false"
        >
            صفحه بعد
        </a>
    </nav>

    <div class="fd-pagination__total">
            <span class="fd-form-label fd-pagination__total-label">
                همه ( {{ total }} )
            </span>
    </div>
</div>
</template>
<script setup>
import { usePagination } from '@/lib/composables/pagination.composable';
import { computed } from 'vue';

const {
    total,
    pagesCount,
    pagingData,
    changePage,
    goNextPage,
    goPreviousPage,
    goLastPage
} = usePagination();

const disableGoPreviousPage = computed(() => {
    return pagingData.page === 1;
});
</script>
