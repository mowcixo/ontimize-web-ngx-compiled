import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';
import { AppConfig } from '../../config/app-config';
export declare class OTranslateHttpLoader extends TranslateHttpLoader {
    protected injector: Injector;
    static BUNDLE_KEY: string;
    static BUNDLE_VALUE: string;
    protected appConfig: AppConfig;
    protected httpClient: HttpClient;
    constructor(httpClient: HttpClient, prefix: string, suffix: string, injector: Injector);
    getAssetsPath(): string;
    getAssetsExtension(): string;
    getLocalTranslation(lang: string): Observable<any>;
    getTranslation(lang: string): any;
    getRemoteBundle(lang: string): Observable<any>;
    protected parseBundleResponse(data: any[]): any;
}
