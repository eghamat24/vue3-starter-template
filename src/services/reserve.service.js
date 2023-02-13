import ApiService from './api.service';

class ReserveService {
    /**
     * Service url
     *
     * @returns {String}
     */
    static get URL() {
        return 'reserves';
    }

    /**
     * Get reserve by confirmation code
     *
     * @param {Number|String} confirmationCode
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    static getOneByConfirmationCode(confirmationCode, config) {
        return ApiService.get(`${this.URL}/${confirmationCode}`, config);
    }
}

export default ReserveService;
