import { ref, computed } from 'vue';

export function useLoading() {
    const loading = ref(0);
    const isLoading = computed(() => loading.value > 0);

    function startLoading() {
        loading.value++;
    }

    function endLoading() {
        loading.value--;
    }

    return {
        isLoading,
        startLoading,
        endLoading
    };
}
