<template>
    <div class="input-group">
        <button
            class="btn btn-outline-primary"
            @click="goPrev"
        >{{ $t('Previous') }}</button>

        <input
            :value="modelValue"
            @input="updateValue($event.target.valueAsNumber)"
            type="number"
            class="form-control"
        >

        <button
            class="btn btn-outline-primary"
            @click="goNext"
        >{{ $t('Next') }}</button>
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
        }
    },

    emits: ['update:modelValue'],

    setup(props, context) {
        function updateValue(value) {
            if (value < 1) {
                value = 1;
            }

            if (value > props.total) {
                value = props.total;
            }

            context.emit('update:modelValue', value);
        }

        function goNext() {
            updateValue(props.modelValue + 1);
        }

        function goPrev() {
            updateValue(props.modelValue - 1);
        }

        return {
            updateValue,
            goPrev,
            goNext
        };
    }
}
</script>
