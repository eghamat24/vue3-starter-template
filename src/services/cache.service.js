import StorageService from "@/services/storage.service";
import DateTime from "@/utils/date-time";
import StorageType from "@/enums/StorageType";
class CacheService {
    cacheName
    isCache = true
    storage = StorageType.Local
    cacheTime
    cacheData = []

    /**
     * @param {number} cacheTime - seconds
     * @param {string} storageCache
     * @param {string} cacheName
     */
    constructor(cacheTime, storageCache = StorageType.Local, cacheName) {
        this.cacheTime = cacheTime
        this.storage = storageCache
        this.cacheName = cacheName
        if (storageCache === StorageType.LocalStorage) {
            if (localStorage.getItem(cacheName)) {
                this.cacheData = StorageService.get(cacheName)
            }
        }
    }


    /**
     * @param {string} key
     * @param data
     */
    setCache(key, data) {
        if (!this.isCache) return
        const DateTimes = new DateTime()
        const finalValue = {key, data, expire: DateTimes.jalali().getTimestamp() + this.cacheTime}
        this.cacheData.push(finalValue)
        if (this.storage === StorageType.LocalStorage) {
            StorageService.set(this.cacheName, this.cacheData)
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
        return this.cacheData?.findIndex(item => item.key === key)
    }

    /**
     * @param {number} index
     */
    getDataFromCache(index) {
        if (!this.isCache) return null

        if (this.isExpireCache(index)) {
            return null
        } else {
            return this.cacheData[index].data
        }
    }

    updateDataFromCache(index, newData) {
        if (!this.isCache) return
        const DateTimes = new DateTime()
        this.cacheData[index].expire = DateTimes.jalali().getTimestamp() + this.cacheTime
        this.cacheData[index].data = newData
        if (this.storage === StorageType.LocalStorage) {
            StorageService.update(this.cacheName, JSON.stringify(this.cacheData))
        }
    }


    isExpireCache(index) {
        const DateTimes = new DateTime()
        return DateTimes.diffInTimes(this.cacheData[index].expire)
    }

    removeCache(index) {
        this.cacheData = this.cacheData.splice(index, 1)
        if (this.storage === StorageType.LocalStorage) {
            StorageService.update(this.cacheName, this.cacheData)
        }
    }

    clearCache() {
        this.cacheData = []
        if (this.storage === StorageType.LocalStorage) {
            StorageService.delete(this.cacheName)
        }
    }

    changeCacheTime(newCacheTime) {
        this.cacheTime = newCacheTime
    }

    /**
     * @param {Boolean} newCacheStatus
     */
    changeCacheStatus(newCacheStatus) {
        if (!newCacheStatus) {
            this.clearCache()
        }
        this.isCache = newCacheStatus
    }
}

export default CacheService
