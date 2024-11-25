import {defineStore} from 'pinia';


// Composables
import {useFetchTodos} from "@/composables/todo.composable";
import CacheService from "@/services/cache.service";
import {ref} from "vue";

export const useTodoStore = defineStore('todos', () => {

    const {todosLoading, todos, fetchTodos, todosKeyById} = useFetchTodos();
    const todo = ref(todos.value)

    const cacheService = new CacheService(5, 0, "todos")


    async function handleRequestWithCache(arg) {
        const argParams = JSON.stringify(arg.params)

        if (!cacheService.isCache) {
            await fetchTodos(arg)
            return
        }

        const cacheIndex = cacheService.getCacheDataIndex(argParams)
        if (cacheIndex === -1) {
            await fetchTodos(arg)
            cacheService.setCache(argParams, todos.value)
            todo.value = todos.value
        } else {
            const data = cacheService.getDataFromCache(cacheIndex)
            if (data) {
                todo.value = data
            } else {
                await fetchTodos(arg)
                cacheService.updateDataFromCache(cacheIndex, todos.value)
            }
        }


    }


    return {
        isLoading: todosLoading,
        fetch: (arg) => handleRequestWithCache(arg),
        items: todo,
        itemsKeyById: todosKeyById,
    };
});
