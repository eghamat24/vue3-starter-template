import ApiService from './api.service';
import TokenService from './token.service';
import PermissionService from './permission.service';

class AuthenticationService {
    /**
     * Login user
     *
     * @param {Object} [data]
     * @param {AxiosRequestConfig} [config]
     * @returns {Promise<AxiosResponse>}
     */
    static login(data, config) {
        return ApiService.post('login', data, config).then((response) => {
            TokenService.set(response.data.token);
            PermissionService.set(response.data.permissions);
        });
    }

    /**
     * Logout user
     *
     * @returns void
     */
    static logout() {
        TokenService.clear();
        PermissionService.clear();
    }

    /**
     * User is logged in
     *
     * @returns {Boolean}
     */
    static isLoggedIn() {
        return TokenService.isExist();
    }
}

export default AuthenticationService;
