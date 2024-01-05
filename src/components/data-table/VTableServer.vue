<template>
    <div class="border border-2 rounded-2 overflow-hidden bg-white">
        <table class="table mb-0">
            <VTableHeader :columns="columns"/>
            <VTableBody
                :columns="columns"
                :row-slot="rowSlot"
                :items="items"
                :is-loading="isLoading"
            />
        </table>

        <VPagination
            :model-value="page"
            @update:model-value="updatePage"
            :total="itemsLength"
        />
    </div>
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
            },
            itemsPerPage: {
                type: Number,
                default: 10
            }
        },

        emits: ['update:page'],

        setup(props, context) {
            const rowSlot = computed(() => context.slots.row);
            const columns = computed(() => context.slots.default());

            function updatePage(value) {
                context.emit('update:page', value);
            }

            return {
                updatePage,

                columns,
                rowSlot
            };
        }
    };
</script>
