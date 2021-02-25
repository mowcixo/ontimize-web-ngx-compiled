import { OPermissions } from '../types/o-permissions.type';
export declare class PermissionsUtils {
    static ACTION_REFRESH: string;
    static ACTION_INSERT: string;
    static ACTION_UPDATE: string;
    static ACTION_DELETE: string;
    static STANDARD_ACTIONS: string[];
    static checkEnabledPermission(permission: OPermissions): boolean;
    static registerDisabledChangesInDom(nativeElement: any, args?: any): MutationObserver;
    static setDisabledDOMElement(mutation: MutationRecord): void;
}
