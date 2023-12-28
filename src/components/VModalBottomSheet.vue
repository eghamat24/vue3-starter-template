<template>
<div
    v-if="!lazyLoad"
    ref="modal"
    :id="id"
    :class="modalClassNames"
    tabindex="-1"
    aria-hidden="true"
    @click.self="hide"
>
    <div ref="dialog" :class="dialogClassNames">
        <div
            ref="content"
            class="modal-content"
            @touchstart="touchStartHandler"
        >
            <button
                type="button"
                :class="['bottom-sheet-close', 'd-' + mobileBreakpoint + '-none']"
                aria-label="Close"
                @click="hide"
            ></button>

            <div class="modal-header" v-if="$slots.title">
                <slot name="header">
                    <div class="modal-title">
                        <slot name="title"></slot>
                    </div>

                    <slot name="appendTitle" v-if="$slots.appendTitle"></slot>

                    <button
                        type="button"
                        :class="['btn-close d-none', 'd-' + mobileBreakpoint + '-inline-block']"
                        aria-label="Close"
                        @click="hide"
                    />

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
                    <slot name="footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click="hide"
                        >
                            {{ $t('cancel') }}
                        </button>
                    </slot>
                </div>
            </div>

            <div :class="['bottom-sheet-home-indicator-space', 'd-' + mobileBreakpoint + '-none']"></div>
        </div>
    </div>
</div>
</template>

<script>
// Vue
import { ref, watch, nextTick, onMounted, computed } from 'vue';

// Utils
import {
    reflow,
    hideScrollBar,
    resetScrollBar,
    executeAfterTransition
} from '@/utils';
import Breakpoints from '@/utils/breakpoints';

// Enums
import ComponentSize from '@/enums/ComponentSize';

// Events
import {
    EVENT_MODAL_HIDE,
    EVENT_MODAL_SHOW,
    EVENT_MODAL_TOGGLE
} from '@/directives/modal.directive';

// Service
import LanguageService from '@/services/language.service';

export default {
    name: 'VModalBottomSheet',

    props: {
        show: {
            type: Boolean,
            default: false
        },
        lazy: {
            type: Boolean,
            default: true
        },
        centered: {
            type: Boolean,
            default: true
        },
        backdrop: {
            type: Boolean,
            default: true
        },
        scrollable: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: ComponentSize.MD,
            validator(value) {
                return [
                    ComponentSize.XS,
                    ComponentSize.SM,
                    ComponentSize.MD,
                    ComponentSize.LG,
                    ComponentSize.XL
                ].includes(value);
            }
        },
        mobileBreakpoint: {
            type: String,
            default: ComponentSize.MD,
            validator(value) {
                return [
                    ComponentSize.XS,
                    ComponentSize.SM,
                    ComponentSize.MD,
                    ComponentSize.LG,
                    ComponentSize.XL
                ].includes(value);
            }
        },
        id: {
            type: String,
            default: null
        },
        pin: {
            type: String,
            default: null
        },
        offset: {
            type: Array,
            default: [0, 16]
        }
    },

    emits: ['update:show', 'show', 'shown', 'hide', 'hidden'],

    setup(props, { emit }) {
        const isMobile = Breakpoints.down(props.mobileBreakpoint);

        const modal = ref();
        const dialog = ref();
        const content = ref();

        const modalClassNames = computed(() => {
            return [
                'modal fade overflow-hidden',

                {
                    'backdrop': props.backdrop
                }
            ];
        });

        const dialogClassNames = computed(() => {
            return [
                'modal-dialog',
                `modal-${props.size}`,
                `modal-bottom-sheet-${props.mobileBreakpoint}-down`,

                {
                    'modal-dialog-centered': props.centered,
                    'modal-dialog-scrollable': props.scrollable
                }
            ];
        });

        /**
         * ------------------------------------------------------------------------
         * Handle pin modal bottom sheet
         * ------------------------------------------------------------------------
         */

        const DEFAULT_OFFSET_Y = 16;

        const CLASS_NAME_PINNED = 'modal-dialog-pinned';
        const CLASS_NAME_CENTERED = 'modal-dialog-centered';

        function addPinModal() {
            const pinEl = document.querySelector(props.pin);
            const pinElRect = pinEl.getBoundingClientRect();

            dialog.value.classList.remove(CLASS_NAME_CENTERED);
            dialog.value.classList.add(CLASS_NAME_PINNED);

            dialog.value.style.top = (pinElRect.bottom + props.offset[1]) + 'px';

            if (LanguageService.isRtl()) {
                dialog.value.style.right = (screen.width - pinElRect.right + props.offset[0]) + 'px';
            } else {
                dialog.value.style.left = (pinElRect.left + props.offset[0]) + 'px';
            }

            const dialogRect = dialog.value.getBoundingClientRect();
            let distanceFromBottom = window.innerHeight - dialogRect.bottom;

            if (distanceFromBottom >= 0) return;

            distanceFromBottom -= DEFAULT_OFFSET_Y;

            dialog.value.style.top = (parseInt(dialog.value.style.top) + distanceFromBottom) + 'px';
            document.documentElement.scrollTop -= distanceFromBottom;
        }

        function removePinModal() {
            dialog.value.classList.remove(CLASS_NAME_PINNED);

            dialog.value.style.top = null;
            dialog.value.style.right = null;
            dialog.value.style.left = null;
        }

        /**
         * ------------------------------------------------------------------------
         * Handle bottom sheet
         * ------------------------------------------------------------------------
         */

        let isBottomSheet = false;

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

            if (contentHeight >= clientHeight) {
                isBottomSheet = true;

                dialog.value.classList.add(CLASS_NAME_FULL);
                content.value.style.maxHeight = clientHeight + 'px';
            } else {
                isBottomSheet = false;

                dialog.value.classList.remove(CLASS_NAME_FULL);
                content.value.style.maxHeight = null;
            }
        }

        function touchStartHandler(event) {
            let clientY = event.touches[0].clientY;
            let translateY = 0;

            content.value.classList.add(CLASS_NAME_MOVING);
            const target = isBottomSheet ? modal.value.querySelector(SELECTOR_CLOSE) : modal.value;

            function moveHandler(touchMoveEvent) {
                const newClientY = touchMoveEvent.touches[0].clientY;

                translateY += (newClientY - clientY);

                if (translateY < 0) {
                    translateY = 0;
                }

                clientY = newClientY;
                content.value.style.transform = `translateY(${translateY}px)`;
            }

            function endHandler() {
                content.value.classList.remove(CLASS_NAME_MOVING);
                content.value.style.transform = null;

                const movementInPercent = (translateY * 100) / content.value.clientHeight;

                if (movementInPercent > 15) {
                    hide();
                }

                target.removeEventListener('touchmove', moveHandler);
                document.removeEventListener('touchend', endHandler, { once: true });
            }

            target.addEventListener('touchmove', moveHandler);
            document.addEventListener('touchend', endHandler, { once: true });
        }

        /**
         * ------------------------------------------------------------------------
         * Handle show and hide modal
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

            checkResizeObserver();

            if (props.pin && !isMobile) {
                addPinModal();
            }

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

                if (props.pin && !isMobile) {
                    removePinModal();
                }

                emit('hidden', modal.value);
            }, modal.value);

            checkResizeObserver();
        }

        function show() {
            isShow.value = true;
        }

        function hide() {
            isShow.value = false;
        }

        function toggle() {
            isShow.value = !isShow.value;
        }

        onMounted(() => {
            if (props.id) {
                document.addEventListener(`${EVENT_MODAL_SHOW}:${props.id}`, show);
                document.addEventListener(`${EVENT_MODAL_HIDE}:${props.id}`, hide);

                document.addEventListener(`${EVENT_MODAL_TOGGLE}:${props.id}`, toggle);
            }

            if (isShow.value) {
                if (lazyLoad.value) lazyLoad.value = false;

                nextTick(() => showModal());
            }
        });

        watch(() => props.show, (value) => {
            isShow.value = value;
        });

        watch(() => isShow.value, (value) => {
            if (value) {
                if (lazyLoad.value) lazyLoad.value = false;

                nextTick(() => showModal());
            } else {
                hideModal();
            }
        });

        return {
            modal,
            modalClassNames,

            dialog,
            dialogClassNames,

            content,
            lazyLoad,

            hide,
            touchStartHandler
        };
    }
};
</script>
