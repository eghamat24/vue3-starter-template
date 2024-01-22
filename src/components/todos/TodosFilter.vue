<template>
    <VForm class="row">
        <div class="col-3">
            <VInput
                v-model="filters.title"
                :placeholder="$t('Filter by title')"
            >
                <template #label>{{ $t('Title') }}</template>
            </VInput>
        </div>

        <div class="col-3">
            <VAutoComplete
                v-model="filters.userId"
                :items="userStore.items"
                :is-loading="userStore.isLoading"
                item-key="id"
                item-text="name"
                :placeholder="$t('Filter by user')"
                clearable
            >
                <template #label>{{ $t('User') }}</template>
            </VAutoComplete>
        </div>

        <div class="col-3">
            <VAutoComplete
                v-model="filters.completed"
                :items="statusItems"
                item-key="key"
                item-text="text"
                :placeholder="$t('Filter by status')"
                clearable
            >
                <template #label>{{ $t('Status') }}</template>
            </VAutoComplete>
        </div>
    </VForm>
</template>

<script>
    // Components
    import VForm from '@/components/form/VForm.vue';
    import VInput from '@/components/form/VInput.vue';
    import VAutoComplete from '@/components/form/VAutoComplete.vue';

    // Stores
    import { useUserStore } from '@/stores/user.store';

    // Composables
    import { useModelRef } from '@/composables/model.composable';

    // Services
    import { t } from '@/services/language.service';

    export default {
        name: 'TodosFilter',

        components: {
            VForm,
            VInput,
            VAutoComplete
        },

        props: {
            modelValue: {
                type: Object,
                required: true
            }
        },

        emits: ['update:modelValue'],

        setup() {
            const filters = useModelRef('modelValue');

            const statusItems = [
                {
                    key: true,
                    text: t('Completed')
                },
                {
                    key: false,
                    text: t('Not completed')
                }
            ];

            const userStore = useUserStore();
            userStore.fetch();

            return {
                filters,
                statusItems,

                userStore
            };
        }
    }
</script>
