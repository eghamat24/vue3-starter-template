<template>
    <tbody>
        <tr v-for="(item, itemIndex) of items" :key="itemIndex">
            <td v-for="(column, columnIndex) of columns" :key="columnIndex">
                <component
                    v-if="hasVNodeSlot(column, 'body')"
                    :is="column.children.body"
                    :item="item"
                    :field="column.props.field"
                ></component>

                <template v-else>{{ resolveField(column, item) }}</template>
            </td>
        </tr>
    </tbody>
</template>

<script>
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
        }
    },

    setup() {
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
            hasVNodeSlot,
            resolveField
        };
    }
}
</script>
