<template>
<div
    v-if="!lazyLoad"
    ref="modal"
    :id="id"
    class="modal backdrop fade overflow-hidden"
    tabindex="-1"
    aria-hidden="true"
    role="dialog"
    @click.self="hide"
>
    <div
        ref="dialog"
        :class="dialogClassName"
    >
        <div
            ref="content"
            class="modal-content"
            @touchstart="touchStartHandler"
        >
            <button
                type="button"
                class="bottom-sheet-close"
                aria-label="Close"
                @click="hide"
            ></button>

            <div class="modal-header" v-if="$slots.title">
                <slot name="header">
                    <h5 class="modal-title">
                        <slot name="title">{{ $t('Modal title') }}</slot>
                    </h5>

                    <slot name="appendTitle" v-if="$slots.appendTitle"></slot>

                    <slot
                        v-if="$slots.extension"
                        name="extension"
                    ></slot>
                </slot>
            </div>

            <div class="modal-body">
                <slot name="body"></slot>
            </div>

            <div class="modal-footer" v-if="$slots.footer">
                <div class="w-100">
                    <slot name="footer"></slot>
                </div>
            </div>

            <div class="bottom-sheet-home-indicator-space"></div>
        </div>
    </div>
</div>
</template>

<script>
// Vue
import { ref, computed, watch, nextTick, onMounted } from 'vue';

// Utils
import { executeAfterTransition, hideScrollBar, reflow, resetScrollBar } from '@/utils';

// Events
import {
    EVENT_MODAL_HIDE,
    EVENT_MODAL_SHOW,
    EVENT_MODAL_TOGGLE
} from "@/directives/modal.directive";

export default {
    name: 'VBottomSheet',

    props: {
        show: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            required: true
        },
        size: {
            type: String,
            default: 'md'
        },
        lazy: {
            type: Boolean,
            default: true
        }
    },

    emits: ['update:show', 'show', 'shown', 'hide', 'hidden'],

    setup(props, { emit }) {
        const modal = ref(null);
        const dialog = ref(null);
        const content = ref(null);

        const dialogClassName = computed(() => {
            return [
                'modal-dialog',
                'modal-bottom-sheet',
                'modal-' + props.size
            ];
        });

        /**
         * ------------------------------------------------------------------------
         * Handle bottom sheet
         * ------------------------------------------------------------------------
         */

        let isFullBottomSheet = false;

        const DEFAULT_OFFSET_Y = 16;
        const CLASS_NAME_MOVING = 'bottom-sheet-moving';
        const CLASS_NAME_FULL = 'full-bottom-sheet';
        const SELECTOR_CLOSE = '.bottom-sheet-close';

        function checkResizeObserver() {
            if ('ResizeObserver' in window) {
                const resizeObserver = new ResizeObserver(resizeHandler);

                if (isShow.value) {
                    resizeObserver.observe(content.value);
                } else {
                    resizeObserver.unobserve(content.value);
                }
            } else {
                resizeHandler();
            }
        }

        function resizeHandler() {
            const clientHeight = document.documentElement.clientHeight - DEFAULT_OFFSET_Y;
            const contentHeight = content.value.offsetHeight;
            const dialogEl = modal.value.firstElementChild;

            if (contentHeight >= clientHeight) {
                isFullBottomSheet = true;
                dialogEl.classList.add(CLASS_NAME_FULL);
                content.value.style.maxHeight = clientHeight + 'px';
            } else {
                isFullBottomSheet = false;
                dialogEl.classList.remove(CLASS_NAME_FULL);
                content.value.style.maxHeight = null;
            }
        }

        function touchStartHandler(event) {
            let clientY = event.touches[0].clientY;
            let translateY = 0;

            content.value.classList.add(CLASS_NAME_MOVING);

            const target = isFullBottomSheet ? modal.value.querySelector(SELECTOR_CLOSE) : modal.value;

            function moveHandler(event) {
                const newClientY = event.touches[0].clientY;

                translateY += (newClientY - clientY);

                if (translateY < 0) {
                    translateY = 0;
                }

                clientY = newClientY;
                content.value.style.transform = `translateY(${translateY}px)`;
            }

            function upHandler() {
                content.value.classList.remove(CLASS_NAME_MOVING);
                content.value.style.transform = null;

                const movementInPercent = (translateY * 100) / content.value.clientHeight;

                if (movementInPercent > 15) {
                    hide();
                }

                target.removeEventListener('touchmove', moveHandler);
                document.removeEventListener('touchend', upHandler, { once: true });
            }

            target.addEventListener('touchmove', moveHandler);
            document.addEventListener('touchend', upHandler, { once: true });
        }


        /**
         * ------------------------------------------------------------------------
         * Handle show and hide Bottom Sheet
         * ------------------------------------------------------------------------
         */

        const lazyLoad = ref(props.lazy);
        const isShow = ref(props.show);

        const CLASS_NAME_OPEN = 'modal-open';
        const CLASS_NAME_SHOW = 'show';

        function showModal() {
            emit('update:show', true);

            modal.value.style.display = 'block';
            hideScrollBar();

            document.body.classList.add(CLASS_NAME_OPEN);
            reflow(modal.value);

            modal.value.classList.add(CLASS_NAME_SHOW);

            // content.value = modal.value.querySelector('.modal-content');

            checkResizeObserver();

            emit('show', modal.value);

            executeAfterTransition(() => {
                emit('shown', modal.value);
            }, modal.value);
        }

        function hideModal() {
            emit('update:show', false);

            emit('hide', modal.value);

            modal.value.classList.remove(CLASS_NAME_SHOW);
            document.body.classList.remove(CLASS_NAME_OPEN);

            executeAfterTransition(() => {
                modal.value.style.display = null;
                resetScrollBar();

                emit('hidden', modal.value);
            }, modal.value);

            checkResizeObserver();
        }

        function hide() {
            isShow.value = false;
        }

        function show() {
            isShow.value = true;
        }

        function toggle() {
            isShow.value = !isShow.value;
        }

        onMounted(() => {
            if (props.id) {
                document.addEventListener(`${EVENT_MODAL_SHOW}:${props.id}`, show);

                document.addEventListener(`${EVENT_MODAL_HIDE}:${props.id}`, toggle);

                document.addEventListener(`${EVENT_MODAL_TOGGLE}:${props.id}`, hide);
            }

            if (isShow.value) {
                if (lazyLoad.value) lazyLoad.value = false;

                nextTick(() => showModal());
            }
        });

        watch(() => props.show, (value) => {
            isShow.value = value;
        })

        watch(() => isShow.value, (value) => {
            if (value) {
                if (props.lazy) lazyLoad.value = false;

                nextTick(() => showModal());
            } else {
                hideModal();
            }
        });

        return {
            modal,
            dialog,
            dialogClassName,

            content,
            lazyLoad,

            hide,
            touchStartHandler
        };
    }
}
</script>
