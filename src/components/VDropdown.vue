<template>
<div class="dropdown">
    <div
        ref="activatorContainer"
        class="dropdown-activator d-inline-block"
    >
        <slot
            :on="listeners"
            :show="isShown"
            name="activator"
        ></slot>
    </div>


    <Teleport to="body">
        <div
            v-if="isShown"
            ref="dropdownMenu"
            :class="dropdownMenuClassNames">
            <slot :hide="hide"></slot>
        </div>
    </Teleport>

</div>
</template>

<script>
import {computed, nextTick, ref} from 'vue';

// Enums
import ComponentPosition from '../enums/ComponentPosition';
import ComponentTrigger from "../enums/ComponentTrigger";

// Services
import LanguageService from '@/services/language.service';

// Composable
import {onClickOutside} from '@/composables/click.composable';

export default {
    name: 'VDropdown',

    props: {
        position: {
            type: String,
            default: ComponentPosition.BOTTOM,
            validator(value) {
                return Object.values(ComponentPosition).includes
                (value);
            }
        },
        trigger: {
            type: String,
            default: ComponentTrigger.CLICK,
            validator(value) {
                return Object.values(ComponentTrigger).includes(value);
            }
        }
    },

    setup(props) {
        const listeners = computed(() => {
            const result = {};

            switch (props.trigger) {
                case ComponentTrigger.CLICK:
                    result.click = toggle;
                    break;
                case ComponentTrigger.HOVER:
                    result.mouseenter = show;
                    result.mouseleave = hide;
                    break;
                case ComponentTrigger.FOCUS:
                    result.focus = show;
                    result.blur = hide;
                    break;
            }

            return result;
        });

        const dropdownMenuClassNames = computed(() => {

            return {
                'dropdown-menu position-fixed py-0 overflow-auto': true,
                'show': isShown.value
            };
        });


        const isShown = ref(false);
        const dropdownMenu = ref();
        const activatorContainer = ref();

        let offCloseHandler;

        function show() {
            isShown.value = true;

            const rect = activatorContainer.value.getBoundingClientRect();
            const vpWidth = window.innerWidth || document.documentElement.clientWidth;
            const vpHeight = window.innerHeight || document.documentElement.clientHeight;

            const {off} = onClickOutside(dropdownMenu, function () {
                hide();
            });

            offCloseHandler = off;
            nextTick(() => {


                let dropdown = null;

                switch (props.position) {
                    case ComponentPosition.TOP:
                        dropdownMenu.value.style.top = rect.top + window.scrollY - dropdownMenu.value.clientHeight + 'px';
                        if (LanguageService.isRtl()) {
                            dropdownMenu.value.style.left = rect.left + 'px';
                            dropdown = dropdownMenu.value.getBoundingClientRect();

                            if ((dropdown.width + dropdown.left) > vpWidth) {
                                dropdownMenu.value.style.right = activatorContainer.value.clientWidth + 'px';
                                dropdownMenu.value.style.left = 'initial';
                            }
                            if (dropdown.top < 0) {
                                dropdownMenu.value.style.bottom = 'initial';
                                dropdownMenu.value.style.top = rect.top + 20 + 'px';
                            }

                        } else {
                            dropdownMenu.value.style.left = rect.left - activatorContainer.value.clientWidth - activatorContainer.value.clientWidth + 'px';
                        }
                        break;

                    case ComponentPosition.BOTTOM:
                        dropdownMenu.value.style.top = rect.top + rect.height + 'px';
                        if (LanguageService.isRtl()) {
                            dropdownMenu.value.style.left = rect.left + 'px';

                            dropdown = dropdownMenu.value.getBoundingClientRect();
                            if ((dropdown.width + dropdown.left) > vpWidth) {
                                dropdownMenu.value.style.right = activatorContainer.value.clientWidth + 'px';
                                dropdownMenu.value.style.left = 'initial';
                            }

                            if ((dropdown.height + dropdown.top) > vpHeight) {
                                dropdownMenu.value.style.top = 'initial';
                                dropdownMenu.value.style.bottom = vpHeight - rect.top + 'px';
                            }

                        } else {
                            // dropdownMenu.value.style.left = rect.left - activatorContainer.value.clientWidth + 'px';
                            dropdownMenu.value.style.left = rect.left + 'px';
                        }
                        break;

                    case ComponentPosition.START:
                        dropdownMenu.value.style.top = rect.top + window.scrollY + 'px';
                        dropdown = dropdownMenu.value.getBoundingClientRect();

                        if (LanguageService.isRtl()) {
                            dropdownMenu.value.style.left = rect.left + rect.width + 10 + 'px';

                            if (dropdown.top < 0) {
                                dropdownMenu.value.style.bottom = 'initial';
                                dropdownMenu.value.style.top = rect.top + 20 + 'px';
                            }

                            if ((dropdown.height + dropdown.top) > vpHeight) {
                                dropdownMenu.value.style.top = 'initial';
                                dropdownMenu.value.style.bottom = vpHeight - rect.top + 'px';
                            }


                        } else {
                            dropdownMenu.value.style.left = rect.left + 'px';
                        }

                        break;

                    case ComponentPosition.END:
                        dropdownMenu.value.style.top = rect.top + window.scrollY + 'px';
                        dropdown = dropdownMenu.value.getBoundingClientRect();

                        if (LanguageService.isRtl()) {
                            dropdownMenu.value.style.left = rect.left - dropdownMenu.value.clientWidth + 'px';

                            if (dropdown.top < 0) {
                                dropdownMenu.value.style.bottom = 'initial';
                                dropdownMenu.value.style.top = rect.top + 20 + 'px';
                            }

                            if ((dropdown.height + dropdown.top) > vpHeight) {
                                dropdownMenu.value.style.top = 'initial';
                                dropdownMenu.value.style.bottom = vpHeight - rect.top + 'px';
                            }

                        } else {
                            dropdownMenu.value.style.left = rect.left + rect.width + 'px';
                        }

                        break;
                }
            });
        }

        function hide() {
            isShown.value = false;
            offCloseHandler();
        }

        function toggle(event) {
            if (isShown.value === false) {
                show(event);
            } else {
                hide();
            }
        }

        return {
            dropdownMenuClassNames,

            isShown,

            listeners,

            dropdownMenu,
            activatorContainer,

            show,
            hide
        };
    }

};
</script>
