import CrudService from './crud.service';

class UserService extends CrudService {
    /**
     * Service url
     *
     * @returns {String}
     */
    static get URL() {
        return 'users';
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
            username: undefined,
            email: undefined,
            address: {
                street: undefined,
                suite: undefined,
                city: undefined,
                zipcode: undefined,
                geo: {
                    lat: undefined,
                    lng: undefined
                }
            },
            phone: undefined,
            website: undefined,
            company: {
                name: undefined,
                catchPhrase: undefined,
                bs: undefined
            }
        };
    }
}

export default UserService;
