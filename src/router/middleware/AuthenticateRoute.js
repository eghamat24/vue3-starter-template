import AuthenticationService from '@/services/authentication.service';

/**
 * Check authentication
 *
 * @param {RouteLocationNormalized} to
 * @param {RouteLocationNormalized} from
 * @param {NavigationGuardNext} next
 * @returns void
 */
export default function (to, from, next) {
    if (AuthenticationService.isLoggedIn()) {
        next();
    } else {
        next({ name: 'Login' });
    }
}
