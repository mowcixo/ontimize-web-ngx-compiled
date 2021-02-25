import { HttpHeaders, HttpParams } from '@angular/common/http';
export declare type HttpRequestOptions = {
    body?: any;
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: any;
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    responseType?: any;
    reportProgress?: boolean;
    withCredentials?: boolean;
};
