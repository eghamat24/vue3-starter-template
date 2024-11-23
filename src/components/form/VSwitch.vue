<template>
    <div class="form-check form-switch">
        <input
            type="checkbox"
            role="switch"
            :id="id"
            @change="handleInput"
            v-model="isCheck"
            :value="isCheck"
            :disabled="disabled"
            :class="inputClassNames">
        <label v-if="$slots.label" class="form-label form-check-label" :for="id">
            <slot name="label"></slot>
        </label>
    </div>
</template>
<script>
    import { computed , ref } from 'vue';

    // Utils
    import { getUniqueId } from '@/utils';

    // Composables
    import ThemeColor from "@/enums/ThemeColor";

    export default {
        name: 'VSwitch',

        props: {
            modelValue: {
                default: false,
                type: Boolean
            },
            id: {
                type: String,
                default: () => getUniqueId()
            },
            disabled: {
                type: Boolean,
                default: false
            },
            theme: {
                type: String,
                default: ThemeColor.PRIMARY,
                validator(value) {
                    return Object.values(ThemeColor).includes(value);
                }
            }

        },

        emits: ['update:modelValue'],

        setup(props, context) {

            const isCheck = ref(props.modelValue)

            const inputClassNames = computed(() => {
                return ['form-check-input'];
            });

            function handleInput() {
                context.emit('update:modelValue', isCheck.value);
            }

            return {
                inputClassNames,
                isCheck,
                handleInput
            };
        }
    };

</script>
