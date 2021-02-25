import { PipeTransform } from '@angular/core';
export declare class OTableRowClassPipe implements PipeTransform {
    transform(rowData: any, rowIndex: number, rowClassFn?: (row: any, index: number) => string | string[]): string | string[];
}
