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
        <div
            ref="dialog"
            :class="dialogClassName"
        >
            <div class="modal-content">
                <div class="modal-header" v-if="$slots.title">
                    <button
                        type="button"
                        :class="['btn-back me-2', 'd-' + mobileBreakpoint + '-none']"
                        aria-label="Back"
                        @click="hide"
                    />

                    <div class="modal-title">
                        <slot name="title"></slot>
                    </div>

                    <button
                        type="button"
                        :class="['btn-close d-none', 'd-' + mobileBreakpoint + '-inline-block']"
                        aria-label="Close"
                        @click="hide"
                    />

                    <slot name="extension" v-if="$slots.extension"></slot>
                </div>

                <div class="modal-header" v-else-if="$slots.header">
                    <slot name="header"></slot>
                </div>

                <div class="modal-body">
                    <slot name="body"></slot>
                </div>

                <div class="modal-footer" v-if="$slots.footer">
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

                <slot name="appendFooter" v-if="$slots.appendFooter"></slot>
            </div>
        </div>
    </div>
</template>

<script>
// Vue
import { ref, computed, watch, nextTick, onMounted } from 'vue';

// Enums
import ComponentSize from '@/enums/ComponentSize';

// Utils
import { executeAfterTransition, reflow, hideScrollBar, resetScrollBar } from '@/utils';
import Breakpoints from '@/utils/breakpoints';

import {
    EVENT_MODAL_SHOW,
    EVENT_MODAL_TOGGLE,
    EVENT_MODAL_HIDE
} from '@/directives/modal.directive';

// Services
import LanguageService from "@/services/language.service";

export default {
    name: 'VModal',

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
        centered: {
            type: Boolean,
            default: true,
        },
        scrollable: {
            type: Boolean,
            default: false
        },
        backdrop: {
            type: Boolean,
            default: true
        },
        lazy: {
            type: Boolean,
            default: true
        },
        pin: {
            type: String,
        },
        offset: {
            type: Array,
            default: [0, 16]
        }
    },

    emits: ['update:show', 'show', 'shown', 'hide', 'hidden'],

    setup(props, { emit }) {
        const isMobile = Breakpoints.down(props.mobileBreakpoint);

        const modal = ref(null);
        const dialog = ref(null);

        const modalClassNames = computed(() => {
            return {
                'modal fade': true,
                'backdrop': props.backdrop
            }
        });

        const dialogClassName = computed(() => {
            return [
                'modal-dialog',
                'modal-' + props.size,
                'modal-fullscreen-' + props.mobileBreakpoint + '-down',
                {
                    'modal-dialog-centered': props.centered,
                    'modal-dialog-scrollable': props.scrollable
                }
            ];
        });

        /**
         * ------------------------------------------------------------------------
         * Handle pin modal
         * ------------------------------------------------------------------------
         */

        const DEFAULT_OFFSET_Y = 16;

        const CLASS_NAME_PINNED = 'modal-dialog-pinned';
        const CLASS_NAME_CENTERED = 'modal-dialog-centered';

        function addPinHandler() {
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

            if (props.pin && !isMobile) {
                addPinHandler();
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
            dialogClassName,

            lazyLoad,

            hide,
        };
    }
}
</script>
