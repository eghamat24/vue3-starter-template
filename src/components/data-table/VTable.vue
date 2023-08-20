<template>
    <table class="table table-bordered">
        <VTableHeader :columns="columns"/>
        <VTableBody :columns="columns" :items="paginatedItems"/>
    </table>

    <VPagination
        :model-value="page"
        @update:model-value="updatePage"
        :total="items.length"
        :itemsPerPage="itemsPerPage"
    />
</template>

<script>
import { computed } from 'vue';

// Components
import VTableHeader from '@/components/data-table/VTableHeader.vue';
import VTableBody from '@/components/data-table/VTableBody.vue';
import VPagination from '@/components/pagination/VPagination.vue';

export default {
    name: 'VTable',

    components: {
        VTableHeader,
        VTableBody,
        VPagination
    },

    props: {
        items: {
            type: Array,
            required: true
        },
        page: {
            type: Number,
            default: 1
        },
        itemsPerPage: {
            type: Number,
            default: 10
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },

    emits: ['update:page', 'update:itemsPerPage'],

    setup(props, context) {
        const columns = computed(() => context.slots.default());

        function updatePage(value) {
            context.emit('update:page', value);
        }

        const paginatedItems = computed(() => {
            const start = (props.page - 1) * props.itemsPerPage;
            const end = props.page * props.itemsPerPage;

            return props.items.slice(start, end);
        });

        return {
            updatePage,
            paginatedItems,
            columns
        };
    }
}
</script>
