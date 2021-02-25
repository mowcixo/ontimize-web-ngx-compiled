import { OComponentPermissions } from './o-component-permissions.type';
export declare type ORoutePermissions = {
    permissionId: string;
    enabled?: boolean;
    components?: OComponentPermissions[];
};
