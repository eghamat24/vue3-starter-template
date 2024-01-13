import CrudService from './crud.service';

class TodoService extends CrudService {
    /**
     * Service url
     *
     * @returns {String}
     */
    static get URL() {
        return 'todos';
    }

    /**
     * Get default item
     *
     * @returns {Object}
     */
    static getDefault() {
        return {
            userId: undefined,
            id: undefined,
            title: undefined,
            completed: false
        };
    }
}

export default TodoService;
