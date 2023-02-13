import PermissionService from '@/services/permission.service';
import { t } from '@/services/language.service';

/**
 * Check authorization
 *
 * @param {RouteLocationNormalized} to
 * @param {RouteLocationNormalized} from
 * @param {NavigationGuardNext} next
 * @returns void
 */
export default function (to, from, next) {
    const permissions = to.meta.permissions;

    if (PermissionService.hasAll(permissions)) {
        next();
    } else {
        alert(t('Authorization Error'));
    }
}
