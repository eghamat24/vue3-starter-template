<template>
    <div class="d-flex align-items-center justify-content-center py-2">
        <button
            class="btn btn-sm btn-link"
            @click="goPrev"
            :disabled="modelValue === 1"
        >{{ $t('Previous') }}</button>

        <input
            :value="modelValue"
            @input="updateValue($event.target.value)"
            type="tel"
            class="form-control form-control-sm text-center ms-2"
            style="width: 50px;"
        >

        <span class="small text-muted mx-2">{{ $t('From') }} {{ count }}</span>

        <button
            class="btn btn-sm btn-link"
            @click="goNext"
            :disabled="modelValue === count"
        >{{ $t('Next') }}</button>

        <span class="small text-muted ms-5 me-2">{{ $t('Size') }}:</span>

        <select
            :value="size"
            @input="updateSize($event.target.value)"
            class="form-select form-select-sm"
            style="width: 70px;"
        >
            <option
                v-for="option in sizeOptions"
                :key="option"
            >{{ option }}</option>
        </select>
    </div>
</template>

<script>
    import { computed } from 'vue';

    export default {
        name: 'VPagination',

        props: {
            modelValue: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            },
            size: {
                type: Number,
                default: 10
            },
            sizeOptions: {
                type: Array,
                default: () => [5, 10, 50, 100]
            }
        },

        emits: ['update:modelValue', 'update:size'],

        setup(props, context) {
            const count = computed(() => Math.ceil(props.total / props.size));

            function updateValue(value) {
                value = Number(value);

                if (value < 1) {
                    value = 1;
                }

                if (value > count.value) {
                    value = count.value;
                }

                context.emit('update:modelValue', value);
            }

            function goNext() {
                updateValue(props.modelValue + 1);
            }

            function goPrev() {
                updateValue(props.modelValue - 1);
            }

            function updateSize(value) {
                context.emit('update:size', Number(value));
            }

            return {
                count,

                updateValue,
                goPrev,
                goNext,

                updateSize
            };
        }
    }
</script>
