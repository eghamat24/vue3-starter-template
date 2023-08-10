<template>
    <div
        ref="modal"
        class="modal fade backdrop"
        @click.self="hide"
    >
        <div :class="dialogClassName">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="header">
                        <h5 class="modal-title">
                            <slot name="title">{{ $t('Modal title') }}</slot>
                        </h5>

                        <button
                            @click="hide"
                            type="button"
                            class="btn-close"
                            aria-label="Close"
                        />
                    </slot>
                </div>

                <div class="modal-body">
                    <slot name="body"></slot>
                </div>

                <div class="modal-footer">
                    <slot name="footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            @click="hide"
                        >
                            {{$t('cancel')}}
                        </button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref, computed, watch } from 'vue';

    // Enums
    import ComponentSize from '@/enums/ComponentSize';

    // Utils
    import { executeAfterTransition, reflow } from '@/utils';

    export default {
        name: 'VModal',

        props: {
            show: {
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

        emits: ['update:show', 'show', 'hide'],

        setup(props, { emit }) {
            const dialogClassName = computed(() => {
                return {
                    'modal-dialog': true,
                    'modal-dialog-centered': true,
                    'modal-dialog-scrollable': true,
                    [`modal-${props.size}`]: props.size,
                    [`modal-fullscreen-${props.mobileBreakpoint}-down`]: props.mobileBreakpoint
                }
            });

            const modal = ref(null);

            function hide() {
                emit('update:show', false);
            }

            function setModalDisplay(display) {
                modal.value.style.display = display;
            }

            watch(() => props.show, (value) => {
                if (value) {
                    setModalDisplay('block');
                    reflow(modal.value);
                    modal.value.classList.add('show');

                    emit('show');
                } else {
                    modal.value.classList.remove('show');
                    executeAfterTransition(() => setModalDisplay(null), modal.value);

                    emit('hide');
                }
            });

            return {
                dialogClassName,
                modal,
                hide,
            };
        }
    }
</script>
