<template>
    <div class="fd-dialog-background" v-if="modelValue">
        <div class="fd-dialog" :class="{ 'fd-dialog--active': modelValue }">
            <div class="fd-dialog__content sap-border-radius-tile" role="dialog"
                 ref="dialog">
                <header
                    class="fd-bar fd-bar--header sap-flex--align-items-center">
                    <h2 class="fd-title--h3 fd-title--h5">
                        {{ title }}
                    </h2>
                    <Button
                        styling="transparent"
                        @click="close"
                    >
                        <Icon name="decline"></Icon>
                    </Button>
                </header>
                <p class="fd-padding-begin-end--lg" v-if="text">
                    {{ text }}
                </p>
                <slot :close="close"></slot>
                <footer
                    v-if="showActions"
                    class="fd-dialog__footer fd-bar fd-bar--footer sap-flex--justify-end"
                >
                    <div
                        class="sap-flex sap-flex--align-content-center sap-flex--column-gap-tiny">
                        <Button
                            @click="close"
                            styling="transparent"
                        >
                            {{ t('Cancel') }}
                        </Button>
                        <Button
                            @click="confirm"
                            styling="emphasized"
                        >
                            {{ confirmButtonText }}
                        </Button>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import Button from '@/lib/components/Button.vue';
import Icon from '@/lib/components/Icon.vue';
import { t } from '@/services/language.service';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    title: String,
    text: {
        type: String,
        default: ''
    },
    showActions: {
        type: Boolean,
        default: false
    },
    confirmButtonText: {
        type: String,
        default: 'ذخیره'
    },
    persistent: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'close']);

function close() {
    emit('close');
    emit('update:modelValue', false);
}

function confirm() {
    emit('confirm', true);
}

const dialog = ref(null);
onClickOutside(dialog, () => {
    if (!props.persistent) close();
});

defineExpose({
    dialog
});
</script>
