import { OComponentPermissions } from './o-component-permissions.type';
import { OPermissions } from './o-permissions.type';
import { ORoutePermissions } from './o-route-permissions.type';
export declare type OPermissionsDefinition = {
    routes?: ORoutePermissions[];
    components?: OComponentPermissions[];
    menu?: OPermissions[];
};
