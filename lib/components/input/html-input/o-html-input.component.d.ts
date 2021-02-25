import { AfterViewInit, ChangeDetectorRef, ElementRef, Injector, OnInit } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { MatTab, MatTabGroup } from '@angular/material';
import { OFormComponent } from '../../form/o-form.component';
import { CKEditorComponent } from '../../material/ckeditor/ck-editor.component';
import { OFormDataComponent } from '../../o-form-data-component.class';
export declare const DEFAULT_INPUTS_O_HTML_INPUT: string[];
export declare const DEFAULT_OUTPUTS_O_HTML_INPUT: string[];
export declare class OHTMLInputComponent extends OFormDataComponent implements OnInit, AfterViewInit {
    protected _minLength: number;
    protected _maxLength: number;
    ckEditor: CKEditorComponent;
    protected tabGroupContainer: MatTabGroup;
    protected tabContainer: MatTab;
    _subscriptAnimationState: string;
    protected _changeDetectorRef: ChangeDetectorRef;
    constructor(form: OFormComponent, elRef: ElementRef, injector: Injector);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    hasError(error: string): boolean;
    isInActiveTab(): boolean;
    resolveValidators(): ValidatorFn[];
    clearValue(): void;
    destroyCKEditor(): void;
    getCKEditor(): any;
    minLength: number;
    maxLength: number;
}
