export declare type ORemoteConfiguration = {
    timeout?: number;
    endpoint?: string;
    path: string;
    columns?: ORemoteConfigurationColumns;
};
export declare type ORemoteConfigurationColumns = {
    user?: string;
    appId?: string;
    configuration?: string;
};
