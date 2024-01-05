<template>
    <tbody>
        <tr v-if="isLoading" class="text-center">
            <td :colspan="columns.length" class="text-muted text-center">{{ $t('Loading') }} ...</td>
        </tr>

        <tr v-else-if="items.length === 0" class="text-center">
            <td :colspan="columns.length" class="text-muted">{{ $t('No data available') }}</td>
        </tr>

        <template v-else-if="rowSlot">
            <component
                :is="rowSlot"
                v-for="(item, rowIndex) of items"
                :key="rowIndex"
                :columns="renderColumns(item, rowIndex)"
                :item="item"
                :rowIndex="rowIndex"
            />
        </template>

        <template v-else>
            <tr
                v-for="(item, rowIndex) of items"
                :key="rowIndex"
            >
                <component
                    :is="column"
                    v-for="(column, index) of renderColumns(item ,rowIndex)"
                    :key="index"
                />
            </tr>
        </template>
    </tbody>
</template>

<script>
    import { h } from 'vue';

    // Utils
    import { hasVNodeSlot } from '@/utils/vue';

    export default {
        name: 'VTableBody',

        props: {
            columns: {
                type: Array,
                required: true
            },
            items: {
                type: Array,
                required: true
            },
            rowSlot: {
                type: Function
            },
            isLoading: {
                type: Boolean,
                default: false
            }
        },

        setup(props) {

            function renderColumns(item, rowIndex) {
                return props.columns.map(function (column) {
                    let content;

                    if (hasVNodeSlot(column, 'body')) {
                        content = h(column.children.body, { field: column.props.field, item, rowIndex });
                    } else {
                        content = resolveField(column, item);
                    }

                    return h(
                        "td",
                        { class: "bg-transparent" },
                        content
                    );
                });
            }

            function resolveField(column, item) {
                if (column.props.field === null) {
                    return item;
                }

                if (typeof column.props.field === 'string') {
                    return item[column.props.field];
                }

                return column.props.field(item);
            }

            return {
                renderColumns
            };
        }
    };
</script>
