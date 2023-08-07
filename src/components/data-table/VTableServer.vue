<template>
    <table class="table table-bordered">
        <VTableHeader :columns="columns"/>
        <VTableBody :columns="columns" :items="items"/>
    </table>

    <VPagination
        :model-value="page"
        @update:model-value="updatePage"
        :total="itemsLength"
    />
</template>

<script>
import { computed } from 'vue';

// Components
import VTableHeader from '@/components/data-table/VTableHeader.vue';
import VTableBody from '@/components/data-table/VTableBody.vue';
import VPagination from '@/components/pagination/VPagination.vue';

export default {
    name: 'VTableServer',

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
        itemsLength: {
            type: Number,
            required: true
        },
        page: {
            type: Number,
            default: 1
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },

    emits: ['update:page'],

    setup(props, context) {
        const columns = computed(() => context.slots.default());

        function updatePage(value) {
            context.emit('update:page', value);
        }

        return {
            updatePage,

            columns
        };
    }
}
</script>
