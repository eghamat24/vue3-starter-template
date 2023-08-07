<template>
    <thead>
        <tr>
            <th v-for="(column, index) of columns" :key="index">
                <component
                    v-if="hasVNodeSlot(column, 'header')"
                    :is="column.children.header"
                ></component>

                <template v-else>{{ column.props.header }}</template>
            </th>
        </tr>
    </thead>
</template>

<script>
// Utils
import { hasVNodeSlot } from '@/utils';

export default {
    name: 'VTableHeader',

    props: {
        columns: {
            type: Array,
            required: true
        }
    },

    setup() {
        return {
            hasVNodeSlot
        };
    }
}
</script>
