import { AfterViewInit, ElementRef, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material';
import { Subscription } from 'rxjs';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { OFormServiceComponent } from '../o-form-service-component.class';
export declare const DEFAULT_INPUTS_O_COMBO: string[];
export declare const DEFAULT_OUTPUTS_O_COMBO: string[];
export declare class OComboComponent extends OFormServiceComponent implements OnInit, AfterViewInit, OnDestroy {
    value: OFormValue;
    searchControl: FormControl;
    multiple: boolean;
    multipleTriggerLabel: boolean;
    searchable: boolean;
    protected translate: boolean;
    protected nullSelection: boolean;
    protected inputModel: ElementRef;
    protected selectModel: MatSelect;
    protected _filteredDataArray: any[];
    filteredDataArray: any;
    protected subscription: Subscription;
    constructor(form: OFormComponent, elRef: ElementRef, injector: Injector);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    initialize(): void;
    ensureOFormValue(value: any): void;
    setDataArray(data: any): void;
    getDataArray(): any[];
    getFilteredDataArray(): any[];
    hasNullSelection(): boolean;
    syncDataIndex(queryIfNotFound?: boolean): void;
    getValue(): any;
    getEmptyValue(): any;
    isEmpty(): boolean;
    clearValue(options?: FormValueOptions, setDirty?: boolean): void;
    readonly showClearButton: boolean;
    getMultiple(): boolean;
    onSelectionChange(event: MatSelectChange): void;
    getOptionDescriptionValue(item?: any): string;
    getValueColumn(item: any): any;
    isSelected(item: any, rowIndex: number): boolean;
    setValue(val: any, options?: FormValueOptions, setDirty?: boolean): void;
    getSelectedItems(): any[];
    setSelectedItems(values: any[]): void;
    getFirstSelectedValue(): void;
    protected setIsReadOnly(value: boolean): void;
    protected parseByValueColumnType(val: any): any;
    protected searchFilter(): void;
}
