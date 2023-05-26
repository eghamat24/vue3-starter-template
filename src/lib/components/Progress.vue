<template>
<div class="progress-bar" :style="styles">
    <div :class="classes"></div>
</div>
</template>

<script setup>
import { computed } from 'vue';
import { TypeMapping } from '@/lib/enums/Type.enum';

const props = defineProps({
    height: {
        type: Number,
        default: 3
    },
    state: {
        type: String,
        default: TypeMapping.INFORMATION,
        validator: (type) =>
            type == null || Object.values(TypeMapping).includes(type)
    }
});

const styles = computed(() => {
    return {
        height: props.height + 'px'
    };
});

const classes = computed(() => {
    return {
        'progress-bar-fill': true,
        [`background-${props.state}`]: !!props.state
    };
});
</script>

<style scoped>
.progress-bar {
    width: 100%;
    background-color: #e0e0e0;
    position: relative;
    overflow: hidden;
}

.progress-bar-fill {
    width: 50%;
    height: 100%;
    position: absolute;
    top: 0;
    left: -50%;
    animation: progress-indeterminate 1.5s ease-in-out infinite;
}

@keyframes progress-indeterminate {
    0% {
        left: -50%;
        width: 50%;
    }
    50% {
        left: 100%;
        width: 50%;
    }
    100% {
        left: 100%;
        width: 50%;
    }
}
</style>
