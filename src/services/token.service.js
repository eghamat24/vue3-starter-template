import StorageService from './storage.service';

class TokenService {
    /**
     * Storage key
     *
     * @returns {String}
     */
    static get STORAGE_KEY() {
        return 'auth_token';
    }

    /**
     * Set token
     *
     * @param {String} value
     * @returns void
     */
    static set(value) {
        StorageService.set(this.STORAGE_KEY, value);
    }

    /**
     * Get token
     *
     * @returns {String}
     */
    static get() {
        return StorageService.get(this.STORAGE_KEY);
    }

    /**
     * Token is exist
     *
     * @returns {Boolean}
     */
    static isExist() {
        return StorageService.has(this.STORAGE_KEY);
    }

    /**
     * Clear token
     *
     * @returns void
     */
    static clear() {
        StorageService.delete(this.STORAGE_KEY);
    }
}

export default TokenService;
