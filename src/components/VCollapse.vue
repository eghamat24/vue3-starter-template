<template>
    <div
        v-if="$slots.activator"
        ref="activator"
        class="collapse-button"
    >
        <slot name="activator" :on="{ click: toggle }"></slot>
    </div>

    <div
        ref="container"
        class="collapse"
    >
        <slot></slot>
    </div>
</template>

<script>
// Vue
import { onMounted, ref, watch } from "vue";

// Utils
import { executeAfterTransition, reflow } from "@/utils";

export default {
    name: 'VCollapse',

    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },

    emits: ['update:model-value', 'show', 'hide'],

    setup(props, { emit }) {
        const CLASS_NAME_SHOW = 'show';
        const CLASS_NAME_COLLAPSE = 'collapse';
        const CLASS_NAME_COLLAPSING = 'collapsing';
        const CLASS_NAME_COLLAPSED = 'collapsed';

        const container = ref(null);
        const activator = ref(null);

        const show = () => {
            container.value.classList.remove(CLASS_NAME_COLLAPSE);
            container.value.classList.add(CLASS_NAME_COLLAPSING);
            container.value.style.height = 0;

            if (activator.value !== null) activator.value.classList.remove(CLASS_NAME_COLLAPSED);

            const complete = () => {
                container.value.classList.remove(CLASS_NAME_COLLAPSING);
                container.value.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

                container.value.style.height = null;
            }

            executeAfterTransition(complete, container.value);

            container.value.style.height = `${container.value.scrollHeight}px`;

            emit('show');
        }

        const hide = () => {
            container.value.style.height = `${container.value.getBoundingClientRect().height}px`;

            reflow(container.value);

            container.value.classList.add(CLASS_NAME_COLLAPSING);
            container.value.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);

            if (activator.value !== null) activator.value.classList.add(CLASS_NAME_COLLAPSED);

            const complete = () => {
                container.value.classList.remove(CLASS_NAME_COLLAPSING);
                container.value.classList.add(CLASS_NAME_COLLAPSE);
            }

            container.value.style.height = '';

            executeAfterTransition(complete, container.value);

            emit('hide');
        }

        const isShown = () => container.value.classList.contains(CLASS_NAME_SHOW);

        const toggle = () => {
            if (isShown()) {
                hide();
            } else {
                show();
            }
        }

        onMounted(() => {
            if (props.modelValue) {
                container.value.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);
            }
        })

        watch(() => props.modelValue, toggle);

        return {
            container,
            activator,

            toggle
        }
    }
}
</script>
