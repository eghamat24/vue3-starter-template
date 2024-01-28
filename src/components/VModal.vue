<template>
    <div
        class="modal fade backdrop"
        tabindex="-1"
        ref="modal"
        @click.self="hide"
    >
        <div :class="dialogClassName">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="header">
                        <div class="modal-title h5">
                            <slot name="title">{{ $t('Title') }}</slot>
                        </div>

                        <button
                            type="button"
                            class="btn-close"
                            aria-label="Close"
                            @click="hide"
                        />
                    </slot>
                </div>

                <div class="modal-body">
                    <slot></slot>
                </div>

                <div class="modal-footer">
                    <slot name="footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click="hide"
                        >{{ $t('Cancel') }}</button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref, computed, watch, nextTick } from 'vue';

    // Enums
    import ComponentSize from '@/enums/ComponentSize';

    // Utils
    import { executeAfterTransition, reflow } from '@/utils';

    export default {
        name: 'VModal',

        props: {
            modelValue: {
                type: Boolean,
                required: true
            },
            size: {
                type: String,
                validator(value) {
                    return [
                        ComponentSize.SM,
                        ComponentSize.LG,
                        ComponentSize.XL
                    ].includes(value);
                }
            },
            mobileBreakpoint: {
                type: String,
                validator(value) {
                    return [
                        ComponentSize.SM,
                        ComponentSize.LG,
                        ComponentSize.MD,
                        ComponentSize.XL
                    ].includes(value);
                }
            }
        },

        emits: ['update:modelValue', 'show', 'hide'],

        setup(props, { emit }) {
            const dialogClassName = computed(() => {
                return {
                    'modal-dialog modal-dialog-centered modal-dialog-scrollable': true,
                    [`modal-${props.size}`]: Boolean(props.size),
                    [`modal-fullscreen-${props.mobileBreakpoint}-down`]: Boolean(props.mobileBreakpoint)
                }
            });

            function hide() {
                emit('update:modelValue', false);
            }

            const modal = ref();

            function setModalDisplay(display) {
                modal.value.style.display = display;
            }

            function syncWithModelValue() {
                if (props.modelValue) {
                    setModalDisplay('block');
                    reflow(modal.value);
                    modal.value.classList.add('show');

                    emit('show');
                } else {
                    modal.value.classList.remove('show');
                    executeAfterTransition(() => setModalDisplay(null), modal.value);

                    emit('hide');
                }
            }

            watch(() => props.modelValue, function () {
                if (modal.value !== undefined) {
                    syncWithModelValue();
                } else {
                    nextTick(() => syncWithModelValue());
                }
            }, { immediate: true });

            return {
                dialogClassName,
                modal,
                hide
            };
        }
    }
</script>
