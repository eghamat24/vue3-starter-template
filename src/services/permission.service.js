import StorageService from './storage.service';

class PermissionService {
    /**
     * @private
     * @type {Object}
     */
    static _permissions = StorageService.get(this.STORAGE_KEY) || {};

    /**
     * Storage key
     *
     * @returns {String}
     */
    static get STORAGE_KEY() {
        return 'permissions';
    }

    /**
     * Set permissions
     *
     * @param {Array} permissions
     * @returns void
     */
    static set(permissions) {
        for (const permission of permissions) {
            this._permissions[permission] = true;
        }

        StorageService.set(this.STORAGE_KEY, this._permissions);
    }

    /**
     * Determine if has a permission
     *
     * @param {String} name
     * @returns {Boolean}
     */
    static has(name) {
        return Boolean(this._permissions[name]);
    }

    /**
     * Determine if has all of the requested permissions
     *
     * @param {String[]} names
     * @returns {Boolean}
     */
    static hasAll(names) {
        return names.every(this.has);
    }

    /**
     * Determine if has any of the requested permissions
     *
     * @param {String[]} names
     * @returns {Boolean}
     */
    static hasAny(names) {
        return names.some(this.has);
    }

    /**
     * Clear permissions
     *
     * @returns void
     */
    static clear() {
        this._permissions = {};
        StorageService.delete(this.STORAGE_KEY);
    }
}

export default PermissionService;
