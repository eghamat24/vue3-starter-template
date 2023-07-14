import CrudService from './crud.service';

class PropertyService extends CrudService {
    /**
     * Service url
     *
     * @returns {String}
     */
    static get URL() {
        return 'properties';
    }

    /**
     * Get default item
     *
     * @returns {Object}
     */
    static getDefault() {
        return {
            id: undefined,
            name: undefined,
            disabled: false
        };
    }
}

export default PropertyService;
