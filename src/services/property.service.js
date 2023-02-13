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
}

export default PropertyService;
