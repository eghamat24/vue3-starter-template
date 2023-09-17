<template>
    <tbody>
    <tr v-if="items.length === 0" class="fs-2 text-center">
        <td :colspan="columns.length" class="text-mute">{{ $t('No data available') }}</td>
    </tr>

    <template v-if="rowSlot">
        <component
            :is="rowSlot"
            v-for="(item, itemIndex) of items"
            :key="itemIndex"
            :columns="renderColumns(item ,itemIndex)"
            :item="item"
        />
    </template>

    <template v-else>
        <tr v-for="(item, itemIndex) of items" :key="itemIndex">
            <component
                :is="column"
                v-for="(column, index) of renderColumns(item ,itemIndex)"
                :key="index"
            />
        </tr>
    </template>

    </tbody>
</template>

<script>
    import { h } from 'vue';

    // Utils
    import { hasVNodeSlot } from '@/utils';

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
            }
        },

        emits: ['click'],

        setup(props) {

            function renderColumns(item, itemIndex) {
                return props.columns.map((column, columnIndex) =>
                    h(
                        "td",
                        {
                            key: columnIndex,
                            class: "bg-transparent"
                        },
                        [
                            hasVNodeSlot(column, 'body') ?
                                h(column.children.body,
                                    {
                                        field: column.props.field,
                                        item: { ...item, itemIndex }
                                    },
                                    []) :
                                column.innerText = resolveField(column, item)
                        ]
                    )
                );
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