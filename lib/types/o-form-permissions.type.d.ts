import { OPermissions } from './o-permissions.type';
export declare type OFormPermissions = {
    attr: string;
    selector: string;
    components?: OPermissions[];
    actions?: OPermissions[];
};
