import { MenuRootItem } from './menu-root-item.type';
import { OntimizeEEPermissionsConfig } from './ontimize-ee-permissions-config.type';
import { OntimizePermissionsConfig } from './ontimize-permissions-config.type';
import { ORemoteConfiguration } from './remote-configuration.type';
export declare type Config = {
    apiEndpoint?: string;
    bundle?: {
        endpoint?: string;
        path?: string;
    };
    remoteConfig?: ORemoteConfiguration;
    startSessionPath?: string;
    uuid?: string;
    title: string;
    locale?: string;
    assets?: {
        i18n?: {
            path?: string;
            extension?: string;
        };
        css?: string;
        images?: string;
        js?: string;
    };
    applicationLocales?: string[];
    defaultLocale?: string;
    serviceType?: any;
    exportServiceType?: any;
    servicesConfiguration?: object;
    appMenuConfiguration?: MenuRootItem[];
    permissionsConfiguration?: OntimizePermissionsConfig | OntimizeEEPermissionsConfig;
    permissionsServiceType?: any;
};
