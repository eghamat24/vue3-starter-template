import {defineStore} from 'pinia';


// Composables
import {useFetchTodos} from "@/composables/todo.composable";

export const useTodoStore = defineStore('todos', () => {
    let cache = true
    let cacheTime = 10 * 1000
    let cachedData = []
    const {todosLoading, todos, fetchTodos, todosKeyById} = useFetchTodos(cache, cacheTime);

    async function handleRequestWithCache(arg) {
        if (!cache) {
            await fetchTodos(arg)
            return
        }
        const findCachedDataIndex = cachedData.findIndex(item => item.params === JSON.stringify(arg.params))
        if (findCachedDataIndex === -1) {
            await fetchTodos(arg)
            addDataWithCache(arg.params)
        } else {
            await useDataFromCache(arg, findCachedDataIndex)
        }
    }

    function addDataWithCache(params) {
        const now = new Date()
        cachedData.push({
            params: JSON.stringify(params),
            startCache: {minute: now.getMinutes(), second: now.getSeconds()},
            data: todos.value
        })
    }

    function updateDataCache(findCachedDataIndex) {
        const now = new Date()
        cachedData[findCachedDataIndex].startCache = {minute: now.getMinutes(), second: now.getSeconds()}
    }

    async function useDataFromCache(arg, findCachedDataIndex) {
        const now = new Date()
        const isCacheExpire = calculatedTimeCache(findCachedDataIndex, now)
        if (isCacheExpire) {
            await fetchTodos(arg)
            updateDataCache(findCachedDataIndex)
        } else {
            todos.value = cachedData[findCachedDataIndex].data
        }
    }

    function calculatedTimeCache(cachedDataIndex, currentTime) {
        const cacheStart = cachedData[cachedDataIndex].startCache;
        const startCacheTimeInMillis = cacheStart.minute * 60 * 1000 + cacheStart.second * 1000;
        const currentTimeInMillis = currentTime.getMinutes() * 60 * 1000 + currentTime.getSeconds() * 1000;
        const elapsedTime = currentTimeInMillis - startCacheTimeInMillis;

        return elapsedTime > cacheTime;
    }

    function clearCache() {
        cachedData = []
    }


    /**
     * @param {boolean} newCache
     * @param {number} newCacheTime
     **/
    function changeCache(newCache, newCacheTime) {
        cache = newCache
        cacheTime = newCacheTime
    }

    return {
        isLoading: todosLoading,
        fetch: (arg) => handleRequestWithCache(arg),
        items: todos,
        itemsKeyById: todosKeyById,
        changeCache,
        clearCache
    };
});
