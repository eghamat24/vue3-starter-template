<template>
<table
    class="fd-table fd-table__body--no-vertical-borders"
>
    <thead class="fd-table__header no-border">
    <tr class="fd-table__row">
        <th
            v-for="header in headers"
            :key="header.value"
            :style="{ width : header.width + '%'}"
            class="fd-table__cell"
            scope="col"
        >
            {{ header.text }}
        </th>
    </tr>
    </thead>
    <tbody class="fd-table__body no-border">
    <tr
        v-for="(item, index) in items"
        :key="index"
        class="fd-table__row"
    >
        <td
            class="fd-table__cell"
            v-for="(header, index) in headers"
            :key="index"
        >
            <slot
                :name="`item.${header.value}`"
                :item="item"
            >
                {{ item[header.value] }}
            </slot>
        </td>
    </tr>
    </tbody>
</table>
</template>

<script setup>
// Vue
import { toRef } from 'vue';

const props = defineProps({
    headers:
        {
            type: Array,
            required: true
        },
    items:
        {
            type: Array,
            required: true
        }
});

const items = toRef(props, 'items');
</script>

<style scoped>
td:empty::before {
    content: '---';
}
</style>
