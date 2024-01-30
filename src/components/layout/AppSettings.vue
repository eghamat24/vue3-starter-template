<template>
    <button
        type="button"
        class="btn btn-sm text-white"
        @click="offcanvasShow = true"
    >
        <i class="bi-gear h4"></i>
    </button>

    <VOffcanvas v-model="offcanvasShow">
        <template #title>{{ $t('Settings') }}</template>

        <VForm id="settings-form" class="row">
            <div class="col-6">
                <VSelect
                    v-model="language"
                    :items="languageItems"
                    item-text="text"
                    item-key="key"
                >
                    <template #label>{{ $t('Language') }}</template>
                </VSelect>
            </div>

            <div class="col-6">
                <VSelect
                    v-model="theme"
                    :items="themeItems"
                    item-text="text"
                    item-key="key"
                >
                    <template #label>{{ $t('Theme') }}</template>
                </VSelect>
            </div>
        </VForm>
    </VOffcanvas>
</template>

<script>
    import { ref, watch } from 'vue';

    // Components
    import VOffcanvas from '@/components/VOffcanvas.vue';
    import VForm from '@/components/form/VForm.vue';
    import VSelect from '@/components/form/VSelect.vue';

    // Services
    import LanguageService, { t } from '@/services/language.service';
    import ThemeService from '@/services/theme.service';

    export default {
        name: 'AppSettings',

        components: {
            VOffcanvas,
            VForm,
            VSelect
        },

        setup() {
            const offcanvasShow = ref(false);

            const language = ref(LanguageService.get());
            const languageItems = [
                {
                    key: 'en',
                    text: 'English'
                },
                {
                    key: 'fa',
                    text: 'فارسی'
                }
            ];

            watch(language, (value) => LanguageService.set(value));

            const theme = ref(ThemeService.get());
            const themeItems = [
                {
                    key: 'light',
                    text: t('Light')
                },
                {
                    key: 'dark',
                    text: t('Dark')
                },
                {
                    key: 'system',
                    text: t('System')
                }
            ];

            watch(theme, (value) => ThemeService.set(value));

            return {
                offcanvasShow,

                language,
                languageItems,

                theme,
                themeItems
            };
        }
    }
</script>
