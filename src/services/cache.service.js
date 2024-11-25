import StorageService from "@/services/storage.service";
import storageService from "@/services/storage.service";
import DateTime from "@/utils/date-time";
import StorageType from "@/enums/StorageType";

class CacheService {
    cacheName
    isCache = true
    storage = StorageType.Local
    cacheTime
    cacheData = []

    /**
     * @param {number} cacheTime - millisecond
     * @param {string} storageCache
     * @param {string} cacheName
     */
    constructor(cacheTime, storageCache = StorageType.Local, cacheName) {
        this.cacheTime = cacheTime
        this.storage = storageCache
        this.cacheName = cacheName
        if (storageCache === StorageType.LocalStorage) {
            if (localStorage.getItem(cacheName)) {
                this.cacheData = storageService.get(cacheName)
            }
        }
    }


    /**
     * @param {string} key
     * @param data
     */
    setCache(key, data) {
        const DateTimes = new DateTime()
        const finalValue = {key, data, expire: DateTimes.jalali().getTimestamp() + this.cacheTime}
        this.cacheData.push(finalValue)
        if (this.storage === StorageType.LocalStorage) {
            StorageService.set(this.cacheName, finalValue)
        }
    }


    getCaches() {
        return this.cacheData
    }

    /**
     * @param {string} key
     * @return {number}
     */
    getCacheDataIndex(key) {
        return this.cacheData.findIndex(item => item.key === key)
    }

    /**
     * @param {number} index
     */
    getDataFromCache(index) {
        if (this.isExpireCache(index)) {
            return null
        } else {
            return this.cacheData[index].data
        }
    }

    updateDataFromCache(index, newData) {
        const DateTimes = new DateTime()
        this.cacheData[index].expire = DateTimes.jalali().getTimestamp() + this.cacheTime
        this.cacheData[index].data = newData
    }


    isExpireCache(index) {
        const DateTimes = new DateTime()
        return DateTimes.diffInTimes(this.cacheData[index].expire)
    }

    removeCache(index) {
        this.cacheData = this.cacheData.splice(index, 1)
    }

    clearCache() {
        this.cacheData = []
    }

    changeCache(newCacheTime) {
        this.cacheTime = newCacheTime
    }
}

export default CacheService
