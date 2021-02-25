import { ServiceResponse } from '../interfaces/service-response.interface';
export declare abstract class BaseServiceResponse implements ServiceResponse {
    code: number;
    data: any;
    message: string;
    sqlTypes?: {
        [key: string]: number;
    };
    startRecordIndex?: number;
    totalQueryRecordsNumber?: number;
    constructor(code: number, data: any, message: string, sqlTypes?: {
        [key: string]: number;
    }, startRecordIndex?: number, totalQueryRecordsNumber?: number);
    isSuccessful(): boolean;
    isFailed(): boolean;
    isUnauthorized(): boolean;
}
