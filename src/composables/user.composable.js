import { ref, computed } from 'vue';

// Service
import UserService from '@/services/user.service';

// Composables
import { useLoading } from '@/composables/loading.composable';

// Utils
import { keyBy } from '@/utils';

export function useFetchUsers() {
    const { isLoading, startLoading, endLoading } = useLoading();

    const users = ref([]);

    const usersKeyById = computed(() => keyBy(users.value, 'id'));

    function fetchUsers() {
        startLoading();

        return UserService.getAll()
            .then(function (response) {
                users.value = response.data;
                return response;
            })
            .finally(function () {
                endLoading();
            });
    }

    return {
        usersLoading: isLoading,
        users,
        usersKeyById,
        fetchUsers
    };
}

export function useFetchUser(initialValue = UserService.getDefault()) {
    const { isLoading, startLoading, endLoading } = useLoading();

    const user = ref(initialValue);

    function fetchUserById(id) {
        startLoading();

        return UserService.getOneById(id)
            .then(function (response) {
                user.value = response.data;
                return response;
            })
            .finally(function () {
                endLoading();
            });
    }

    return {
        userLoading: isLoading,
        user,
        fetchUserById
    };
}
