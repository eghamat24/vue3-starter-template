<template>
<div class="w-100 gallery-slider__selected-image">
    <div ref="sliderContainer"
         :class="getClassNames"
         @mousedown="onMousedown"
         @touchstart="onTouchStart"
    >
        <div
            v-for="(image, index) in images"
            :key="index"
            class="gallery-slider__container-image px-0"
        >
            <img
                class="w-100 h-100"
                :src=image
                alt="image"
                loading="lazy"
                draggable="false"
            >
        </div>
    </div>

    <button
        v-if="slideCount !== 0"
        @click="goTo(slideCount - 1)"
        :class="['d-none d-sm-block btn btn-outline-primary btn-border bg-white text-black px-2 py-2 rounded-circle',
                direction ? 'gallery-slider__selected-image__prev' : 'gallery-slider__selected-image__next']"
    >
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            :style="[!direction && 'transform: rotate(180deg)']"
        >
            <path d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
            />
        </svg>
    </button>

    <button
        v-if="slideCount < (images.length - 1)"
        @click="goTo(slideCount + 1)"
        :class="['d-none d-sm-block btn btn-outline-primary btn-border bg-white text-black px-2 py-2 rounded-circle',
                 !direction ? 'gallery-slider__selected-image__prev' : 'gallery-slider__selected-image__next']"
    >
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            :style="[!direction && 'transform: rotate(180deg)']"
        >
            <path d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
            />
        </svg>
    </button>
</div>
</template>

<script>
// Vue
import { computed, nextTick, onMounted, ref, watch } from "vue";

// Utils
import { isRTL } from "@/utils";
import Breakpoints from "@/utils/breakpoints";

export default {
    name: 'GallerySlider',

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

    emits: ['update:model-value'],

    setup(props, context) {
        const isMobile = Breakpoints.down(Breakpoints.SM);

        const sliderContainer = ref();

        const sliderWidth = ref(0);

        const slideCount = ref(0);

        const direction = computed(() => isRTL());

        const signDirection = computed(() => direction.value ? -1 : 1);

        const getClassNames = computed(() => {
            return ['d-flex gallery-slider__selected-image__container', { 'rounded-2': !isMobile }];
        });

        function goTo(index) {
            if (!sliderWidth.value) {
                sliderWidth.value = sliderContainer.value.clientWidth;
            }

            slideCount.value = index;

            if (slideCount.value < 0) {
                slideCount.value = 0;
            }

            if (slideCount.value >= props.images.length) {
                slideCount.value = props.images.length - 1;
            }

            sliderContainer.value.scrollLeft = slideCount.value * (signDirection.value * sliderWidth.value);

            context.emit('update:model-value', slideCount.value);
        }

        function getClientX(event) {
            return event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
        }

        function onMousedown(event) {
            if (isMobile) return;

            const mousedownClientX = getClientX(event);

            sliderContainer.value.style.scrollBehavior = 'unset';

            let clientX = mousedownClientX;

            function moveHandler(mousemoveEvent) {
                const newClientX = getClientX(mousemoveEvent);
                sliderContainer.value.scrollLeft = sliderContainer.value.scrollLeft + (clientX - newClientX);

                clientX = newClientX;
            }

            function upHandler(mouseupEvent) {
                const mouseupClientX = getClientX(mouseupEvent);

                sliderContainer.value.style.removeProperty('scroll-behavior');

                if (mouseupClientX > mousedownClientX) {
                    goTo(slideCount.value + (signDirection.value * -1));
                } else if (mouseupClientX < mousedownClientX) {
                    goTo(slideCount.value + signDirection.value);
                }

                sliderContainer.value.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
            }

            sliderContainer.value.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
        }

        function onTouchStart(event) {
            const mousedownClientX = getClientX(event);
            sliderContainer.value.style.scrollBehavior = 'unset';

            let clientX = mousedownClientX;

            function moveHandler(mousemoveEvent) {
                const newClientX = getClientX(mousemoveEvent);

                sliderContainer.value.scrollLeft = sliderContainer.value.scrollLeft + (clientX - newClientX);
                clientX = newClientX;
            }

            function upHandler(mouseupEvent) {
                const mouseupClientX = getClientX(mouseupEvent);

                sliderContainer.value.style.removeProperty('scroll-behavior');

                if (mouseupClientX > mousedownClientX) {
                    goTo(slideCount.value + (signDirection.value * -1));
                } else if (mouseupClientX < mousedownClientX) {
                    goTo(slideCount.value + signDirection.value);
                }

                sliderContainer.value.removeEventListener('touchmove', moveHandler);
                document.removeEventListener('touchend', upHandler);
            }

            sliderContainer.value.addEventListener('touchmove', moveHandler);
            document.addEventListener('touchend', upHandler);
        }

        onMounted(() => {
            nextTick(() => {
                sliderContainer.value.style.scrollBehavior = 'unset';
                goTo(props.modelValue);
                sliderContainer.value.style.removeProperty('scroll-behavior');
            });
        });

        watch(() => props.modelValue, (value) => {
            nextTick(() => {
                goTo(value);
            });
        });

        return {
            isMobile,
            sliderContainer,
            slideCount,
            getClassNames,
            direction,

            onMousedown,
            onTouchStart,
            goTo
        };
    }
}
</script>
