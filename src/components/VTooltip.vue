<template>
    <slot name="activator" :on="listeners"></slot>

    <Teleport to="body">
        <div
            v-if="isShown"
            :class="tooltipClassNames"
            ref="tooltip"
        >
            <slot></slot>
        </div>
    </Teleport>
</template>

<script>
    import { computed, nextTick, ref } from 'vue';

    // Enums
    import ComponentPosition from '@/enums/ComponentPosition';
    import ThemeColor from '@/enums/ThemeColor';
    import ComponentTrigger from "@/enums/ComponentTrigger";

    // Services
    import LanguageService from '@/services/language.service';

    export default {
        name: 'VTooltip',

        props: {
            position: {
                type: String,
                default: ComponentPosition.TOP,
                validator(value) {
                    return Object.values(ComponentPosition).includes(value);
                }
            },
            trigger: {
                type: String,
                default: ComponentTrigger.HOVER,
                validator(value) {
                    return Object.values(ComponentTrigger).includes(value);
                }
            },
            theme: {
                type: String,
                default: ThemeColor.PRIMARY,
                validator(value) {
                    return Object.values(ThemeColor).includes(value);
                }
            }
        },

        setup(props) {
            const listeners = computed(() => {
                const result = {};

                switch (props.trigger) {
                    case ComponentTrigger.HOVER:
                        result.mouseenter = show;
                        result.mouseleave = hide;
                        break;
                    case ComponentTrigger.CLICK:
                        result.click = toggle;
                        break;

                    case ComponentTrigger.FOCUS:
                        result.focus = show;
                        result.blur = hide;
                        break;
                }


                return result
            });

            const tooltip = ref();
            const tooltipClassNames = computed(() => {
                return {
                    'tooltip show px-2 py-1 rounded-2': true,
                    [`bg-${props.theme}`]: true,
                    ['tooltip-' + props.position]: true
                };
            });

            const isShown = ref(false);

            function show(event) {
                isShown.value = true;

                const rect = event.target.getBoundingClientRect();

                nextTick(() => {
                    switch (props.position) {
                        case ComponentPosition.TOP:
                            tooltip.value.style.top = rect.top + window.scrollY + 'px';
                            tooltip.value.style.left = rect.left + (rect.width / 2) + 'px';
                            break;

                        case ComponentPosition.BOTTOM:
                            tooltip.value.style.top = rect.top + rect.height + 'px';
                            tooltip.value.style.left = rect.left + (rect.width / 2) + 'px';
                            break;

                        case ComponentPosition.START:
                            tooltip.value.style.top = rect.top + window.scrollY - rect.height + 'px';

                            if (LanguageService.isRtl()) {
                                tooltip.value.style.left = rect.left + rect.width + 'px';
                            } else {
                                tooltip.value.style.left = rect.left - tooltip.value.clientWidth + 'px';
                            }

                            break;

                        case ComponentPosition.END:
                            tooltip.value.style.top = rect.top + window.scrollY - rect.height + 'px';

                            if (LanguageService.isRtl()) {
                                tooltip.value.style.left = rect.left - tooltip.value.clientWidth + 'px';
                            } else {
                                tooltip.value.style.left = rect.left + rect.width + 'px';
                            }

                            break;
                    }
                });
            }

            function hide() {
                isShown.value = false;
            }

            function toggle(event) {
                if (isShown.value === false) {
                    show(event);
                } else {
                    hide();
                }
            }

            return {
                listeners,

                tooltip,
                tooltipClassNames,

                isShown,
                show,
                hide,
            };
        }

    }
</script>