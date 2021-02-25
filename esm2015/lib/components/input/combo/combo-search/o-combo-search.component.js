import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Inject, ViewChild, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
export class OComboSearchComponent {
    constructor(matSelect, changeDetectorRef) {
        this.matSelect = matSelect;
        this.changeDetectorRef = changeDetectorRef;
        this.placeholder = 'SEARCH';
        this.change = new EventEmitter();
        this._onDestroy = new Subject();
        this.onChange = (_) => {
        };
        this.onTouched = (_) => {
        };
    }
    get value() {
        return this._value;
    }
    ngOnInit() {
        this.matSelect.openedChange
            .pipe(takeUntil(this._onDestroy))
            .subscribe(opened => opened ? this.focus() : this.reset());
        this.matSelect.openedChange
            .pipe(take(1))
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
            if (this.matSelect.multiple) {
                this.previousSelectedValues = this.matSelect.value;
            }
            this._options = this.matSelect.options;
            this._options.changes
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                const keyManager = this.matSelect._keyManager;
                if (keyManager && this.matSelect.panelOpen) {
                    setTimeout(() => keyManager.setFirstItemActive(), 0);
                }
            });
        });
        this.change
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => this.changeDetectorRef.detectChanges());
        this.initMultipleHandling();
    }
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    handleKeydown(event) {
        if (event.keyCode === 32) {
            event.stopPropagation();
        }
    }
    onInputChange(value) {
        const valueChanged = value !== this._value;
        if (valueChanged) {
            this._value = value;
            this.onChange(value);
            this.change.emit(value);
        }
    }
    onBlur(value) {
        this.writeValue(value);
        this.onTouched();
    }
    writeValue(value) {
        const valueChanged = value !== this._value;
        if (valueChanged) {
            this._value = value;
            this.change.emit(value);
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    focus() {
        if (!this.searchSelectInput) {
            return;
        }
        const panel = this.matSelect.panel.nativeElement;
        const scrollTop = panel.scrollTop;
        this.searchSelectInput.nativeElement.focus();
        panel.scrollTop = scrollTop;
    }
    reset(focus) {
        if (!this.searchSelectInput) {
            return;
        }
        this.searchSelectInput.nativeElement.value = '';
        this.onInputChange('');
        if (focus) {
            this.focus();
        }
    }
    initMultipleHandling() {
        this.matSelect.valueChange
            .pipe(takeUntil(this._onDestroy))
            .subscribe(values => {
            if (this.matSelect.multiple) {
                let restoreSelectedValues = false;
                if (this._value && this._value.length
                    && this.previousSelectedValues && Array.isArray(this.previousSelectedValues)) {
                    if (!values || !Array.isArray(values)) {
                        values = [];
                    }
                    const optionValues = this.matSelect.options.map(option => option.value);
                    this.previousSelectedValues.forEach(previousValue => {
                        if (values.indexOf(previousValue) === -1 && optionValues.indexOf(previousValue) === -1) {
                            values.push(previousValue);
                            restoreSelectedValues = true;
                        }
                    });
                }
                if (restoreSelectedValues) {
                    this.matSelect._onChange(values);
                }
                this.previousSelectedValues = values;
            }
        });
    }
}
OComboSearchComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-combo-search',
                template: "<input matInput class=\"o-combo-search-hidden\" />\n\n<mat-form-field floatLabel=\"never\" class=\"o-combo-search-inner\">\n  <input matInput #searchSelectInput placeholder=\"{{ placeholder | oTranslate }}\" (keydown)=\"handleKeydown($event)\"\n    (input)=\"onInputChange($event.target.value)\" (blur)=\"onBlur($event.target.value)\" class=\"mat-select-search-input\" />\n  <button mat-icon-button matSuffix *ngIf=\"value\" (click)=\"reset(true)\" class=\"mat-select-search-clear\">\n    <mat-icon>close</mat-icon>\n  </button>\n</mat-form-field>\n\n<div *ngIf=\"value && _options?.length === 0\" fxLayoutAlign=\"center center\" class=\"o-combo-search-emmpty\">\n  <span>{{ 'INPUT.COMBO.EMPTY' | oTranslate }}</span>\n</div>\n",
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => OComboSearchComponent),
                        multi: true
                    }
                ],
                host: {
                    '[class.o-combo-search]': 'true'
                },
                styles: [":host{display:flex;flex-direction:column;padding:0 16px}:host .o-combo-search-hidden{display:none}:host .o-combo-search-inner{height:3em;width:100%}:host .o-combo-search-emmpty{height:3em;line-height:3em}"]
            }] }
];
OComboSearchComponent.ctorParameters = () => [
    { type: MatSelect, decorators: [{ type: Inject, args: [MatSelect,] }] },
    { type: ChangeDetectorRef }
];
OComboSearchComponent.propDecorators = {
    searchSelectInput: [{ type: ViewChild, args: ['searchSelectInput', { read: ElementRef, static: false },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb21iby1zZWFyY2guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L2NvbWJvL2NvbWJvLXNlYXJjaC9vLWNvbWJvLXNlYXJjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUlOLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRCxPQUFPLEVBQWEsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDekQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBaUJqRCxNQUFNLE9BQU8scUJBQXFCO0lBMEJoQyxZQUM0QixTQUFvQixFQUN0QyxpQkFBb0M7UUFEbEIsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUN0QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBMUJ2QyxnQkFBVyxHQUFXLFFBQVEsQ0FBQztRQW1CNUIsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFHcEMsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUE4Q3BDLGFBQVEsR0FBYSxDQUFDLENBQU0sRUFBRSxFQUFFO1FBRXZDLENBQUMsQ0FBQTtRQUVNLGNBQVMsR0FBYSxDQUFDLENBQU0sRUFBRSxFQUFFO1FBRXhDLENBQUMsQ0FBQTtJQS9DRyxDQUFDO0lBckJMLElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBcUJNLFFBQVE7UUFFYixJQUFJLENBQUMsU0FBUyxDQUFD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Ozs7WUFsQm1CLFNBQVMsdUJBOEN4QixNQUFNLFNBQUMsU0FBUztZQTFEbkIsaUJBQWlCOzs7Z0NBZ0RoQixTQUFTLFNBQUMsbUJBQW1CLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWF0T3B0aW9uLCBNYXRTZWxlY3QgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tY29tYm8tc2VhcmNoJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tY29tYm8tc2VhcmNoLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1jb21iby1zZWFyY2guY29tcG9uZW50LnNjc3MnXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBPQ29tYm9TZWFyY2hDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tY29tYm8tc2VhcmNoXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9Db21ib1NlYXJjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBwdWJsaWMgcGxhY2Vob2xkZXI6IHN0cmluZyA9ICdTRUFSQ0gnO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIE1hdFNlbGVjdCBvcHRpb25zICovXG4gIHB1YmxpYyBfb3B0aW9uczogUXVlcnlMaXN0PE1hdE9wdGlvbj47XG5cbiAgLyoqIEN1cnJlbnQgc2VhcmNoIHZhbHVlICovXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuICBwcm90ZWN0ZWQgX3ZhbHVlOiBzdHJpbmc7XG5cbiAgLyoqIFByZXZpb3VzbHkgc2VsZWN0ZWQgdmFsdWVzIHdoZW4gdXNpbmcgPG1hdC1zZWxlY3QgW211bHRpcGxlXT1cInRydWVcIj4gKi9cbiAgcHJvdGVjdGVkIHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXM6IGFueVtdO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHNlYXJjaCBpbnB1dCBmaWVsZCAqL1xuICBAVmlld0NoaWxkKCdzZWFyY2hTZWxlY3RJbnB1dCcsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICBwcm90ZWN0ZWQgc2VhcmNoU2VsZWN0SW5wdXQ6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIEV2ZW50IHRoYXQgZW1pdHMgd2hlbiB0aGUgY3VycmVudCB2YWx1ZSBjaGFuZ2VzICovXG4gIHByb3RlY3RlZCBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICAvKiogU3ViamVjdCB0aGF0IGVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByb3RlY3RlZCBfb25EZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE1hdFNlbGVjdCkgcHVibGljIG1hdFNlbGVjdDogTWF0U2VsZWN0LFxuICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmXG4gICkgeyB9XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIC8vIHdoZW4gdGhlIHNlbGVjdCBkcm9wZG93biBwYW5lbCBpcyBvcGVuZWQgb3IgY2xvc2VkLCBmb2N1cyB0aGUgc2VhcmNoIGZpZWxkIHdoZW4gb3BlbmluZyBhbmQgY2xlYXIgaXQgd2hlbiBjbG9zaW5nXG4gICAgdGhpcy5tYXRTZWxlY3Qub3BlbmVkQ2hhbmdlXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUob3BlbmVkID0+IG9wZW5lZCA/IHRoaXMuZm9jdXMoKSA6IHRoaXMucmVzZXQoKSk7XG5cbiAgICAvLyBzZXQgdGhlIGZpcnN0IGl0ZW0gYWN0aXZlIGFmdGVyIHRoZSBvcHRpb25zIGNoYW5nZWRcbiAgICB0aGlzLm1hdFNlbGVjdC5vcGVuZWRDaGFuZ2VcbiAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5tYXRTZWxlY3QubXVsdGlwbGUpIHtcbiAgICAgICAgICB0aGlzLnByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMgPSB0aGlzLm1hdFNlbGVjdC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vcHRpb25zID0gdGhpcy5tYXRTZWxlY3Qub3B0aW9ucztcbiAgICAgICAgdGhpcy5fb3B0aW9ucy5jaGFuZ2VzXG4gICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX29uRGVzdHJveSkpXG4gICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBrZXlNYW5hZ2VyID0gdGhpcy5tYXRTZWxlY3QuX2tleU1hbmFnZXI7XG4gICAgICAgICAgICBpZiAoa2V5TWFuYWdlciAmJiB0aGlzLm1hdFNlbGVjdC5wYW5lbE9wZW4pIHtcbiAgICAgICAgICAgICAgLy8gYXZvaWQgXCJleHByZXNzaW9uIGhhcyBiZWVuIGNoYW5nZWRcIiBlcnJvclxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGtleU1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCksIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAvLyBkZXRlY3QgY2hhbmdlcyB3aGVuIHRoZSBpbnB1dCBjaGFuZ2VzXG4gICAgdGhpcy5jaGFuZ2VcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9vbkRlc3Ryb3kpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKSk7XG5cbiAgICB0aGlzLmluaXRNdWx0aXBsZUhhbmRsaW5nKCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fb25EZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9vbkRlc3Ryb3kuY29tcGxldGUoKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNoYW5nZTogRnVuY3Rpb24gPSAoXzogYW55KSA9PiB7XG4gICAgLy8gZG8gbm90aGluZ1xuICB9XG5cbiAgcHVibGljIG9uVG91Y2hlZDogRnVuY3Rpb24gPSAoXzogYW55KSA9PiB7XG4gICAgLy8gZG8gbm90aGluZ1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlIGtleSBkb3duIGV2ZW50IHdpdGggTWF0U2VsZWN0LlxuICAgKiBBbGxvd3MgZS5nLiBzZWxlY3Rpbmcgd2l0aCBlbnRlciBrZXksIG5hdmlnYXRpb24gd2l0aCBhcnJvdyBrZXlzLCBldGMuXG4gICAqIEBwYXJhbSBldmVudFxuICAgKi9cbiAgcHVibGljIGhhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzIpIHtcbiAgICAgIC8vIGRvIG5vdCBwcm9wYWdhdGUgc3BhY2VzIHRvIE1hdFNlbGVjdCwgYXMgdGhpcyB3b3VsZCBzZWxlY3QgdGhlIGN1cnJlbnRseSBhY3RpdmUgb3B0aW9uXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25JbnB1dENoYW5nZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgdmFsdWVDaGFuZ2VkID0gdmFsdWUgIT09IHRoaXMuX3ZhbHVlO1xuICAgIGlmICh2YWx1ZUNoYW5nZWQpIHtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcbiAgICAgIHRoaXMuY2hhbmdlLmVtaXQodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkJsdXIodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMud3JpdGVWYWx1ZSh2YWx1ZSk7XG4gICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgfVxuXG4gIHB1YmxpYyB3cml0ZVZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCB2YWx1ZUNoYW5nZWQgPSB2YWx1ZSAhPT0gdGhpcy5fdmFsdWU7XG4gICAgaWYgKHZhbHVlQ2hhbmdlZCkge1xuICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuY2hhbmdlLmVtaXQodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgdGhlIHNlYXJjaCBpbnB1dCBmaWVsZFxuICAgKi9cbiAgcHVibGljIGZvY3VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zZWFyY2hTZWxlY3RJbnB1dCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBzYXZlIGFuZCByZXN0b3JlIHNjcm9sbFRvcCBvZiBwYW5lbCwgc2luY2UgaXQgd2lsbCBiZSByZXNldCBieSBmb2N1cygpXG4gICAgLy8gbm90ZTogdGhpcyBpcyBoYWNreVxuICAgIGNvbnN0IHBhbmVsID0gdGhpcy5tYXRTZWxlY3QucGFuZWwubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBzY3JvbGxUb3AgPSBwYW5lbC5zY3JvbGxUb3A7XG5cbiAgICAvLyBmb2N1c1xuICAgIHRoaXMuc2VhcmNoU2VsZWN0SW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuXG4gICAgcGFuZWwuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgY3VycmVudCBzZWFyY2ggdmFsdWVcbiAgICogQHBhcmFtIGZvY3VzIHdoZXRoZXIgdG8gZm9jdXMgYWZ0ZXIgcmVzZXR0aW5nXG4gICAqL1xuICBwdWJsaWMgcmVzZXQoZm9jdXM/OiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNlYXJjaFNlbGVjdElucHV0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc2VhcmNoU2VsZWN0SW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSA9ICcnO1xuICAgIHRoaXMub25JbnB1dENoYW5nZSgnJyk7XG4gICAgaWYgKGZvY3VzKSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIGhhbmRsaW5nIDxtYXQtc2VsZWN0IFttdWx0aXBsZV09XCJ0cnVlXCI+XG4gICAqIE5vdGU6IHRvIGltcHJvdmUgdGhpcyBjb2RlLCBtYXQtc2VsZWN0IHNob3VsZCBiZSBleHRlbmRlZCB0byBhbGxvdyBkaXNhYmxpbmcgcmVzZXR0aW5nIHRoZSBzZWxlY3Rpb24gd2hpbGUgZmlsdGVyaW5nLlxuICAgKi9cbiAgcHJvdGVjdGVkIGluaXRNdWx0aXBsZUhhbmRsaW5nKCk6IHZvaWQge1xuICAgIC8vIGlmIDxtYXQtc2VsZWN0IFttdWx0aXBsZV09XCJ0cnVlXCI+XG4gICAgLy8gc3RvcmUgcHJldmlvdXNseSBzZWxlY3RlZCB2YWx1ZXMgYW5kIHJlc3RvcmUgdGhlbSB3aGVuIHRoZXkgYXJlIGRlc2VsZWN0ZWRcbiAgICAvLyBiZWNhdXNlIHRoZSBvcHRpb24gaXMgbm90IGF2YWlsYWJsZSB3aGlsZSB3ZSBhcmUgY3VycmVudGx5IGZpbHRlcmluZ1xuICAgIHRoaXMubWF0U2VsZWN0LnZhbHVlQ2hhbmdlXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUodmFsdWVzID0+IHtcbiAgICAgICAgaWYgKHRoaXMubWF0U2VsZWN0Lm11bHRpcGxlKSB7XG4gICAgICAgICAgbGV0IHJlc3RvcmVTZWxlY3RlZFZhbHVlcyA9IGZhbHNlO1xuICAgICAgICAgIGlmICh0aGlzLl92YWx1ZSAmJiB0aGlzLl92YWx1ZS5sZW5ndGhcbiAgICAgICAgICAgICYmIHRoaXMucHJldmlvdXNTZWxlY3RlZFZhbHVlcyAmJiBBcnJheS5pc0FycmF5KHRoaXMucHJldmlvdXNTZWxlY3RlZFZhbHVlcykpIHtcbiAgICAgICAgICAgIGlmICghdmFsdWVzIHx8ICFBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcbiAgICAgICAgICAgICAgdmFsdWVzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBvcHRpb25WYWx1ZXMgPSB0aGlzLm1hdFNlbGVjdC5vcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNTZWxlY3RlZFZhbHVlcy5mb3JFYWNoKHByZXZpb3VzVmFsdWUgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsdWVzLmluZGV4T2YocHJldmlvdXNWYWx1ZSkgPT09IC0xICYmIG9wdGlvblZhbHVlcy5pbmRleE9mKHByZXZpb3VzVmFsdWUpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIGEgdmFsdWUgdGhhdCB3YXMgc2VsZWN0ZWQgYmVmb3JlIGlzIGRlc2VsZWN0ZWQgYW5kIG5vdCBmb3VuZCBpbiB0aGUgb3B0aW9ucywgaXQgd2FzIGRlc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICAvLyBkdWUgdG8gdGhlIGZpbHRlcmluZywgc28gd2UgcmVzdG9yZSBpdC5cbiAgICAgICAgICAgICAgICB2YWx1ZXMucHVzaChwcmV2aW91c1ZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXN0b3JlU2VsZWN0ZWRWYWx1ZXMgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocmVzdG9yZVNlbGVjdGVkVmFsdWVzKSB7XG4gICAgICAgICAgICB0aGlzLm1hdFNlbGVjdC5fb25DaGFuZ2UodmFsdWVzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMgPSB2YWx1ZXM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbn1cbiJdfQ==