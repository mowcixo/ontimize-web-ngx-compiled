import { PipeTransform } from '@angular/core';
export declare class ColumnsFilterPipe implements PipeTransform {
    filterValue: string;
    filterColumns: Array<string>;
    transform(value: Array<any>, args: any): any;
    _isBlank(value: string): boolean;
}
