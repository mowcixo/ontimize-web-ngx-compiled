import { InjectionToken } from '@angular/core';
import { Config } from '../types/config.type';
import { MenuRootItem } from '../types/menu-root-item.type';
import { OInputsOptions } from '../types/o-inputs-options.type';
import { ORemoteConfiguration } from '../types/remote-configuration.type';
export declare const O_INPUTS_OPTIONS: InjectionToken<OInputsOptions>;
export declare const APP_CONFIG: InjectionToken<Config>;
export declare class AppConfig {
    private _config;
    constructor(config?: any);
    getConfiguration(): Config;
    getServiceConfiguration(): any;
    getMenuConfiguration(): MenuRootItem[];
    useRemoteBundle(): boolean;
    getBundleEndpoint(): string;
    getI18nAssetsConfiguration(): any;
    getCssAssetsConfiguration(): any;
    getImagesAssetsConfiguration(): any;
    getJsAssetsConfiguration(): any;
    getRemoteConfigurationConfig(): ORemoteConfiguration;
    useRemoteConfiguration(): boolean;
    getRemoteConfigurationEndpoint(): string;
}
