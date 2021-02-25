import { Injector, QueryList } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { OMatErrorComponent } from '../../../../shared/material/o-mat-error/o-mat-error';
import { OMatErrorOptions } from '../../../../types/o-mat-error.type';
export declare class OTableBaseDialogClass {
    protected injector: Injector;
    protected errorOptions: OMatErrorOptions;
    protected oMatErrorChildren: QueryList<OMatErrorComponent>;
    protected formControl: AbstractControl;
    constructor(injector: Injector);
    protected setFormControl(formControl: AbstractControl): void;
    readonly tooltipClass: string;
    readonly tooltipText: string;
    protected formControlHasErrors(): boolean;
}
