import { InjectionToken, Injector } from '@angular/core';
import { IExportService } from '../interfaces/export-service.interface';
import { IFileService } from '../interfaces/file-service.interface';
import { IPermissionsService } from '../interfaces/permissions-service.interface';
import { OntimizeExportService } from './ontimize/ontimize-export.service';
import { OntimizeService } from './ontimize/ontimize.service';
export declare const O_DATA_SERVICE: InjectionToken<unknown>;
export declare const O_TRANSLATE_SERVICE: InjectionToken<unknown>;
export declare const O_FILE_SERVICE: InjectionToken<IFileService>;
export declare const O_EXPORT_SERVICE: InjectionToken<IExportService>;
export declare const O_PERMISSION_SERVICE: InjectionToken<IPermissionsService>;
export declare function dataServiceFactory(injector: Injector): any;
export declare function fileServiceFactory(injector: Injector): IFileService;
export declare function exportServiceFactory(injector: Injector): IExportService;
export declare function permissionsServiceFactory(injector: Injector): IPermissionsService;
export declare let OntimizeServiceProvider: {
    provide: typeof OntimizeService;
    useFactory: typeof dataServiceFactory;
    deps: (typeof Injector)[];
};
export declare let OntimizeExportServiceProvider: {
    provide: typeof OntimizeExportService;
    useFactory: typeof exportServiceFactory;
    deps: (typeof Injector)[];
};
export declare function _getInjectionTokenValue<T>(token: InjectionToken<T>, injector: Injector): T;
export declare function _createServiceInstance(clazz: any, injector: Injector): any;
