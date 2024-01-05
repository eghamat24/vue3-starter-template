<template>
    <div class="border border-2 rounded-2 overflow-hidden bg-white">
        <table class="table mb-0">
            <VTableHeader :columns="columns"/>
            <VTableBody
                :columns="columns"
                :row-slot="rowSlot"
                :items="paginatedItems"
                :is-loading="isLoading"
            />
        </table>

        <VPagination
            v-model="pageRef"
            v-model:size="itemsPerPageRef"
            :total="items.length"
        />
    </div>
</template>

<script>
    import { computed } from 'vue';

    // Components
    import VTableHeader from '@/components/data-table/VTableHeader.vue';
    import VTableBody from '@/components/data-table/VTableBody.vue';
    import VPagination from '@/components/pagination/VPagination.vue';

    // Composables
    import { useModelRef } from '@/composables/model.composable';

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
            const rowSlot = computed(() => context.slots.row);
            const columns = computed(() => context.slots.default());

            const pageRef = useModelRef('page');
            const itemsPerPageRef = useModelRef('itemsPerPage');

            const paginatedItems = computed(() => {
                const start = (pageRef.value - 1) * itemsPerPageRef.value;
                const end = pageRef.value * itemsPerPageRef.value;

                return props.items.slice(start, end);
            });

            return {
                rowSlot,
                columns,

                pageRef,
                itemsPerPageRef,

                paginatedItems
            };
        }
    }
</script>
