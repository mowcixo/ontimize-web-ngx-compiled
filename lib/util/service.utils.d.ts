import { Router } from '@angular/router';
import { OFormComponent } from '../components/form/o-form.component';
import { SQLOrder } from '../types/sql-order.type';
import { OExpandableContainerComponent } from '../components/expandable-container/o-expandable-container.component';
export declare class ServiceUtils {
    static getParentKeysFromExpandableContainer(parentKeysObject: object, expandableContainer: OExpandableContainerComponent): {};
    static getParentKeysFromForm(parentKeysObject: object, form: OFormComponent): {};
    static filterContainsAllParentKeys(parentKeysFilter: any, parentKeys: any): boolean;
    static getFilterUsingParentKeys(parentItem: any, parentKeysObject: object): {};
    static getArrayProperties(array: any[], properties: any[]): any[];
    static getObjectProperties(object: any, properties: any[]): any;
    static parseSortColumns(sortColumns: string): Array<SQLOrder>;
    static redirectLogin(router: Router, sessionExpired?: boolean): void;
}
