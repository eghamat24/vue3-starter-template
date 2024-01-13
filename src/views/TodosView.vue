<template>
    <div class="h3 mb-4">{{ $t('Todos') }}</div>

    <VTableServer
        v-model:page="page"
        v-model:items-per-page="itemsPerPage"
        :items="todos"
        :items-length="200"
        :is-loading="todosLoading"
    >
        <VColumn :header="$t('Id')" field="id"/>
        <VColumn :header="$t('Title')" field="title"/>

        <VColumn :header="$t('User')" field="userId">
            <template v-if="userStore.isLoading" #body>
                <div class="placeholder-glow">
                    <span class="placeholder rounded col-8"></span>
                </div>
            </template>

            <template v-else #body="{ item }">
                {{ userStore.itemsKeyById[item.userId].name }}
            </template>
        </VColumn>

        <VColumn :header="$t('Status')" field="completed">
            <template #body="{ item }">
                <span v-if="item.completed">
                    <i class="bi-check-circle-fill text-success me-1"></i>
                    {{ $t('Completed') }}
                </span>

                <span v-else>
                    <i class="bi-dash-circle text-danger me-1"></i>
                    {{ $t('Not completed') }}
                </span>
            </template>
        </VColumn>
    </VTableServer>
</template>

<script>
    // Components
    import VTableServer from '@/components/data-table/VTableServer.vue';
    import VColumn from '@/components/data-table/VColumn.vue';

    // Composables
    import { useFetchTodos } from '@/composables/todo.composable';
    import { useServerPagination } from '@/composables/pagination.composable';

    // Stores
    import { useUserStore } from '@/stores/user.store';

    export default {
        name: 'TodosView',

        components: {
            VTableServer,
            VColumn
        },

        setup() {
            const { todosLoading, todos, fetchTodos } = useFetchTodos();
            const { page, itemsPerPage, getPaginationParams, onChangePagination } = useServerPagination();

            function fetch() {
                const config = {
                    params: getPaginationParams()
                };

                return fetchTodos(config);
            }

            onChangePagination(() => fetch());

            fetch();

            const userStore = useUserStore();
            userStore.fetch();

            return {
                todosLoading,
                todos,

                page,
                itemsPerPage,

                userStore
            };
        }
    }
</script>
