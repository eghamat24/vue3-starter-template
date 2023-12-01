<template>
    <div class="input-group">
        <button
            class="btn text-secondary-dark align-items-center d-flex"
            @click="goFirst"
        >
            go first
        </button>
        <button
            class="btn btn-outline-primary"
            @click="goPrev"
        >{{ $t('Previous') }}
        </button>

        <input
            :value="modelValue"
            @input="updateValue($event.target.valueAsNumber)"
            type="number"
            class="form-control"
        >

        <button
            class="btn btn-outline-primary"
            @click="goNext"
        >{{ $t('Next') }}
        </button>
        <button
            class="btn text-primary  align-items-center d-flex"
            @click="goLast"
        >
            go last
        </button>
    </div>
</template>

<script>
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
        itemsPerPage: {
            type: Number,
            required: true
        }
    },

    emits: ['update:modelValue'],

    setup(props, context) {
        function updateValue(value) {
            if (value > Math.floor(props.total / props.itemsPerPage)) {
                value = Math.ceil(props.total / props.itemsPerPage)
            } else {
                if (value < 1) {
                    value = 1;
                }

                if (value > props.total) {
                    value = props.total;
                }
            }
            context.emit('update:modelValue', value);
        }

        function goNext() {
            updateValue(props.modelValue + 1);
        }

        function goPrev() {
            updateValue(props.modelValue - 1);
        }

        function goFirst() {
            updateValue(props.modelValue - props.modelValue + 1);
        }

        function goLast() {
            updateValue(Math.ceil(props.total / props.itemsPerPage));
        }

        return {
            updateValue,
            goPrev,
            goNext,
            goFirst,
            goLast
        };
    }
}
</script>
