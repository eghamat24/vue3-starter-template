<template>
    <div
        :class="offcanvasClassNames"
        tabindex="-1"
        ref="offcanvas"
    >
        <div class="offcanvas-header">
            <slot name="header">
                <h5 class="offcanvas-title">
                    <slot name="title">{{ $t('Title') }}</slot>
                </h5>

                <button
                    type="button"
                    class="btn-close"
                    aria-label="Close"
                    @click="hide"
                ></button>
            </slot>
        </div>

        <div class="offcanvas-body">
            <slot></slot>
        </div>
    </div>

    <div
        class="offcanvas-backdrop fade hide"
        ref="backdrop"
        @click="hide"
    ></div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue';

    // Enums
    import ComponentPosition from '@/enums/ComponentPosition';

    // Utils
    import { executeAfterTransition, reflow } from '@/utils';

    export default {
        name: 'VOffcanvas',

        props: {
            modelValue: {
                type: Boolean,
                required: true
            },
            position: {
                type: String,
                default: ComponentPosition.END,
                validator(value) {
                    return Object.values(ComponentPosition).includes(value);
                }
            }
        },

        emits: ['update:modelValue', 'show', 'hide'],

        setup(props, { emit }) {
            const offcanvasClassNames = computed(() => {
                return ['offcanvas', 'offcanvas-' + props.position];
            });

            function hide() {
                emit('update:modelValue', false);
            }

            const offcanvas = ref();
            const backdrop = ref();

            function handleShow() {
                offcanvas.value.classList.add('showing');

                backdrop.value.classList.remove('hide');
                reflow(backdrop.value);
                backdrop.value.classList.add('show');

                executeAfterTransition(function () {
                    offcanvas.value.classList.replace('showing', 'show');
                }, offcanvas.value);
            }

            function handleHide() {
                offcanvas.value.classList.add('hiding');
                executeAfterTransition(function () {
                    offcanvas.value.classList.remove('hiding', 'show');
                }, offcanvas.value);

                backdrop.value.classList.remove('show');
                executeAfterTransition(function () {
                    backdrop.value.classList.add('hide');
                }, backdrop.value);
            }

            function syncWithModelValue() {
                if (props.modelValue) {
                    handleShow();
                    emit('show');
                } else {
                    handleHide();
                    emit('hide');
                }
            }

            watch(() => props.modelValue, function () {
                if (offcanvas.value !== undefined) {
                    syncWithModelValue();
                } else {
                    nextTick(() => syncWithModelValue());
                }
            }, { immediate: true });

            return {
                offcanvasClassNames,
                offcanvas,

                backdrop,

                hide
            };
        }
    }
</script>
