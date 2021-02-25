import { ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, OnInit, QueryList } from '@angular/core';
import { MatOption, MatSelect } from '@angular/material';
import { Subject } from 'rxjs';
export declare class OComboSearchComponent implements OnInit, OnDestroy {
    matSelect: MatSelect;
    private changeDetectorRef;
    placeholder: string;
    _options: QueryList<MatOption>;
    readonly value: string;
    protected _value: string;
    protected previousSelectedValues: any[];
    protected searchSelectInput: ElementRef;
    protected change: EventEmitter<string>;
    protected _onDestroy: Subject<void>;
    constructor(matSelect: MatSelect, changeDetectorRef: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    onChange: Function;
    onTouched: Function;
    handleKeydown(event: KeyboardEvent): void;
    onInputChange(value: any): void;
    onBlur(value: string): void;
    writeValue(value: string): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    focus(): void;
    reset(focus?: boolean): void;
    protected initMultipleHandling(): void;
}
