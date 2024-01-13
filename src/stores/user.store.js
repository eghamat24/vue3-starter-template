import { defineStore } from 'pinia';

// Utils
import { cachePromise } from '@/utils';

// Composables
import { useFetchUsers } from '@/composables/user.composable';

export const useUserStore = defineStore('user', () => {
    const { usersLoading, users, usersKeyById, fetchUsers } = useFetchUsers();

    return {
        isLoading: usersLoading,
        items: users,
        itemsKeyById: usersKeyById,
        fetch: cachePromise(fetchUsers)
    };
});
