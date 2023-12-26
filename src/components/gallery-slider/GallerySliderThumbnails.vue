<template>
<div
    v-slider
    class="row flex-nowrap gallery-slider__images overflow-scroll mx-0 mt-4 ps-2 ps-sm-0"
>
    <div
        v-for="(image, index) in images"
        :key="index"
        :id="`js-thumbnail-${index}`"
        class="rounded-2 me-2 me-sm-4 px-0"
    >
        <img
            @click="goTo(index)"
            :class="getClassNames(index)"
            :src=image
            alt="image"
            loading="lazy"
            draggable="false"
        >
    </div>
</div>
</template>

<script>
// Vue
import { nextTick, onMounted, watch } from "vue";

// Directive
import { slider } from "@/directives/slider.directive";

export default {
    name: 'GallerySliderThumbnails',

    props: {
        modelValue: {
            type: Number,
            required: true
        },
        images: {
            type: Array,
            required: true
        }
    },

    directives: {
        slider
    },

    emits: ['update:model-value'],

    setup(props, context) {
        function getClassNames(index) {
            return ['w-100 h-100 rounded-2 image-cover cursor-pointer', { 'selected': index === props.modelValue }];
        }

        function goTo(index) {
            context.emit('update:model-value', index);

            const thumbnailEl = document.getElementById(`js-thumbnail-${index}`);

            if (thumbnailEl) {
                thumbnailEl.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            }
        }

        onMounted(() => {
            nextTick(() => {
                goTo(props.modelValue);
            });
        });

        watch(() => props.modelValue, () => {
            nextTick(() => {
                goTo(props.modelValue);
            });
        });

        return {
            goTo,
            getClassNames
        };
    }
}

</script>
