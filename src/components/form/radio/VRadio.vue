<template>
    <div>
        <input
            type="radio"
            :value="value"
            :id="id"
            :name="name"
            :disabled="disabled"
            class="form-check-input"
            @change="onChange(value)"
        >

        <label :for="id" class="form-check-label ms-1">
            <slot name="label"></slot>
        </label>
    </div>
</template>

<script>
    import { inject } from 'vue';

    // Utils
    import { getUniqueId } from '@/utils';

    // Components
    import { RADIO_GROUP_INJECTION_KEY } from '@/components/form/radio/VRadioGroup.vue';

    export default {
        name: "VRadio",

        props: {
            value: {
                type: [String, Number, Boolean]
            },
            id: {
                type: String,
                default: () => getUniqueId()
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },

        setup() {
            const RadioGroupProvider = inject(RADIO_GROUP_INJECTION_KEY);

            const { onChange, name } = RadioGroupProvider.register();

            return {
                name,
                onChange
            };
        }
    };
</script>