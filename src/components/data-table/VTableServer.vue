<template>
    <div v-if="isLoading" class="table-spinner-loading spinner-border text-primary">
    </div>
    <div v-else>
        <table class="table">
            <VTableHeader :columns="columns"/>
            <VTableBody :columns="columns" :items="items" :row-slot="rowSlot"/>
        </table>

        <VPagination
            :model-value="page"
            :total="itemsLength"
            itemsPerPage="10"
            @update:model-value="updatePage"
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