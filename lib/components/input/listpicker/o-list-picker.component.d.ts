import { AfterViewInit, ElementRef, EventEmitter, Injector, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MatInput } from '@angular/material';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { OFormComponent } from '../../form/o-form.component';
import { OFormControl } from '../o-form-control.class';
import { OFormServiceComponent } from '../o-form-service-component.class';
import { OListPickerDialogComponent } from './o-list-picker-dialog.component';
export declare const DEFAULT_INPUTS_O_LIST_PICKER: string[];
export declare const DEFAULT_OUTPUTS_O_LIST_PICKER: string[];
export declare class OListPickerComponent extends OFormServiceComponent implements AfterViewInit, OnChanges, OnInit {
    onDialogAccept: EventEmitter<any>;
    onDialogCancel: EventEmitter<any>;
    stateCtrl: FormControl;
    textInputEnabled: boolean;
    dialogDisableClose: boolean;
    protected filter: boolean;
    protected dialogWidth: string;
    protected dialogHeight: string;
    protected dialogClass: string;
    protected queryRows: number;
    protected matDialog: MatDialog;
    protected dialogRef: MatDialogRef<OListPickerDialogComponent>;
    protected inputModel: MatInput;
    protected visibleInput: ElementRef;
    protected visibleInputValue: any;
    protected blurTimer: any;
    protected blurDelay: number;
    protected blurPrevent: boolean;
    constructor(form: OFormComponent, elRef: ElementRef, injector: Injector);
    ngOnInit(): void;
    ngOnChanges(changes: {
        [propName: string]: SimpleChange;
    }): void;
    createFormControl(): OFormControl;
    ensureOFormValue(value: any): void;
    setEnabled(value: boolean): void;
    ngAfterViewInit(): void;
    getDescriptionValue(): string;
    onClickClear(e: Event): void;
    onClickInput(e: Event): void;
    onClickListpicker(e: Event): void;
    onDialogClose(evt: any): void;
    innerOnBlur(evt: any): void;
    onVisibleInputChange(event: any): void;
    onKeydownEnter(val: any): void;
    protected setFormValue(val: any, options?: FormValueOptions, setDirty?: boolean): void;
    protected openDialog(): void;
    protected getDialogDataArray(dataArray: any[]): any[];
}
