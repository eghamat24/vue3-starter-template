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
import {computed, nextTick, ref} from 'vue';

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
        },
        autoClose: {
            type: Boolean,
            default: false,

        },
        autoCloseTime: {
            type: Number,
            default: 1000,
        }
    },

    setup(props) {
        const listeners = computed(() => {
            const result = {};
            switch (props.trigger) {
                case ComponentTrigger.HOVER:
                    result.mouseenter = show;
                    result.mouseleave = hide;
                    break
                case ComponentTrigger.CLICK:
                    result.click = toggle;
                    break

                case ComponentTrigger.FOCUS:
                    result.focus = show;
                    result.blur = hide;
                    break
            }

            return result
        });
        const tooltip = ref(null);
        const tooltipClassNames = computed(() => {
            return {
                'tooltip px-2 py-1 rounded-2': true,
                [`bg-${props.theme}`]: true,
                ['tooltip-' + props.position]: true
            };
        });

        const isShown = ref(false);

        function show(event) {
            isShown.value = true;
            const rect = event.target.getBoundingClientRect();
            nextTick(() => {
                const tooltipRect = tooltip.value.getBoundingClientRect()
                switch (props.position) {
                    case ComponentPosition.TOP:
                        addTooltipToTop(rect)
                        break;

                    case ComponentPosition.BOTTOM:
                        tooltip.value.style.top = rect.top + rect.height + 'px';
                        tooltip.value.style.left = rect.left + (rect.width / 2) + 'px';
                        break;

                    case ComponentPosition.START:
                        if (LanguageService.isRtl()) {
                            if (isSpaceRight(rect, tooltipRect)) {
                                addTooltipToTop(rect)
                                break;
                            } else {
                                addTooltipToStart(rect, tooltipRect)
                                break
                            }
                        } else {
                            if (isSpaceLeft(rect, tooltipRect)) {
                                addTooltipToTop(rect)
                                break;
                            } else {
                                addTooltipToStart(rect, tooltipRect)
                                break
                            }
                        }


                    case ComponentPosition.END:
                        if (LanguageService.isRtl()) {
                            if (isSpaceLeft(rect, tooltipRect)) {
                                addTooltipToTop(rect)
                                break;
                            } else {
                                addTooltipToEnd(rect, tooltipRect)
                                break
                            }
                        } else {
                            if (isSpaceRight(rect, tooltipRect)) {
                                addTooltipToTop(rect)
                                break;
                            } else {
                                addTooltipToEnd(rect, tooltipRect)


                                break
                            }
                        }
                }
                tooltip.value.classList.add('show')
                autoClose()
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

        function isSpaceRight(rect, tooltipRect) {
            const rightPosition = rect.left + rect.width;
            return (rightPosition + tooltipRect.width) >= window.innerWidth;
        }

        function isSpaceLeft(rect, tooltipRect) {
            return rect.left < tooltipRect.width;
        }

        function addTooltipToTop(rect) {
            if (LanguageService.isRtl()) {
                tooltip.value.style.top = rect.top + window.scrollY - 5 + 'px';
                tooltip.value.style.left = rect.right - (rect.width / 2) + 'px';
                tooltip.value.classList.remove("tooltip-start")
                tooltip.value.classList.add("tooltip-top")
            } else {
                tooltip.value.style.top = rect.top + window.scrollY - 5 + 'px';
                tooltip.value.style.left = rect.right - (rect.width / 2) + 'px';
                tooltip.value.classList.remove("tooltip-start")
                tooltip.value.classList.add("tooltip-top")
            }
        }

        function addTooltipToStart(rect, tooltipRect) {
            if (LanguageService.isRtl()) {
                tooltip.value.style.left = rect.left + rect.width + 5 + 'px';
                tooltip.value.style.top = rect.bottom + window.scrollY - ((tooltipRect.height + rect.height) / 2) + 'px';
            } else {
                tooltip.value.style.left = rect.left - tooltipRect.width - 5 + 'px';
                tooltip.value.style.top = rect.bottom + window.scrollY - ((tooltipRect.height + rect.height) / 2) + 'px';
            }
        }

        function addTooltipToEnd(rect, tooltipRect) {
            if (LanguageService.isRtl()) {
                tooltip.value.style.left = rect.left - tooltipRect.width - 5 + 'px';
                tooltip.value.style.top = rect.bottom + window.scrollY - ((tooltipRect.height + rect.height) / 2) + 'px';
            } else {
                tooltip.value.style.left = rect.left + rect.width + 5 + 'px';
                tooltip.value.style.top = rect.bottom + window.scrollY - ((tooltipRect.height + rect.height) / 2) + 'px';
            }
        }

        function autoClose() {
            setTimeout(() => {
                if (props.autoClose && props.trigger !== ComponentTrigger.HOVER) {
                    isShown.value = false
                }
            }, props.autoCloseTime)
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
