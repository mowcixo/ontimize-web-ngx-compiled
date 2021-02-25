import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Inject, ViewChild, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
var OComboSearchComponent = (function () {
    function OComboSearchComponent(matSelect, changeDetectorRef) {
        this.matSelect = matSelect;
        this.changeDetectorRef = changeDetectorRef;
        this.placeholder = 'SEARCH';
        this.change = new EventEmitter();
        this._onDestroy = new Subject();
        this.onChange = function (_) {
        };
        this.onTouched = function (_) {
        };
    }
    Object.defineProperty(OComboSearchComponent.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    OComboSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.matSelect.openedChange
            .pipe(takeUntil(this._onDestroy))
            .subscribe(function (opened) { return opened ? _this.focus() : _this.reset(); });
        this.matSelect.openedChange
            .pipe(take(1))
            .pipe(takeUntil(this._onDestroy))
            .subscribe(function () {
            if (_this.matSelect.multiple) {
                _this.previousSelectedValues = _this.matSelect.value;
            }
            _this._options = _this.matSelect.options;
            _this._options.changes
                .pipe(takeUntil(_this._onDestroy))
                .subscribe(function () {
                var keyManager = _this.matSelect._keyManager;
                if (keyManager && _this.matSelect.panelOpen) {
                    setTimeout(function () { return keyManager.setFirstItemActive(); }, 0);
                }
            });
        });
        this.change
            .pipe(takeUntil(this._onDestroy))
            .subscribe(function () { return _this.changeDetectorRef.detectChanges(); });
        this.initMultipleHandling();
    };
    OComboSearchComponent.prototype.ngOnDestroy = function () {
        this._onDestroy.next();
        this._onDestroy.complete();
    };
    OComboSearchComponent.prototype.handleKeydown = function (event) {
        if (event.keyCode === 32) {
            event.stopPropagation();
        }
    };
    OComboSearchComponent.prototype.onInputChange = function (value) {
        var valueChanged = value !== this._value;
        if (valueChanged) {
            this._value = value;
            this.onChange(value);
            this.change.emit(value);
        }
    };
    OComboSearchComponent.prototype.onBlur = function (value) {
        this.writeValue(value);
        this.onTouched();
    };
    OComboSearchComponent.prototype.writeValue = function (value) {
        var valueChanged = value !== this._value;
        if (valueChanged) {
            this._value = value;
            this.change.emit(value);
        }
    };
    OComboSearchComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    OComboSearchComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    OComboSearchComponent.prototype.focus = function () {
        if (!this.searchSelectInput) {
            return;
        }
        var panel = this.matSelect.panel.nativeElement;
        var scrollTop = panel.scrollTop;
        this.searchSelectInput.nativeElement.focus();
        panel.scrollTop = scrollTop;
    };
    OComboSearchComponent.prototype.reset = function (focus) {
        if (!this.searchSelectInput) {
            return;
        }
        this.searchSelectInput.nativeElement.value = '';
        this.onInputChange('');
        if (focus) {
            this.focus();
        }
    };
    OComboSearchComponent.prototype.initMultipleHandling = function () {
        var _this = this;
        this.matSelect.valueChange
            .pipe(takeUntil(this._onDestroy))
            .subscribe(function (values) {
            if (_this.matSelect.multiple) {
                var restoreSelectedValues_1 = false;
                if (_this._value && _this._value.length
                    && _this.previousSelectedValues && Array.isArray(_this.previousSelectedValues)) {
                    if (!values || !Array.isArray(values)) {
                        values = [];
                    }
                    var optionValues_1 = _this.matSelect.options.map(function (option) { return option.value; });
                    _this.previousSelectedValues.forEach(function (previousValue) {
                        if (values.indexOf(previousValue) === -1 && optionValues_1.indexOf(previousValue) === -1) {
                            values.push(previousValue);
                            restoreSelectedValues_1 = true;
                        }
                    });
                }
                if (restoreSelectedValues_1) {
                    _this.matSelect._onChange(values);
                }
                _this.previousSelectedValues = values;
            }
        });
    };
    OComboSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-combo-search',
                    template: "<input matInput class=\"o-combo-search-hidden\" />\n\n<mat-form-field floatLabel=\"never\" class=\"o-combo-search-inner\">\n  <input matInput #searchSelectInput placeholder=\"{{ placeholder | oTranslate }}\" (keydown)=\"handleKeydown($event)\"\n    (input)=\"onInputChange($event.target.value)\" (blur)=\"onBlur($event.target.value)\" class=\"mat-select-search-input\" />\n  <button mat-icon-button matSuffix *ngIf=\"value\" (click)=\"reset(true)\" class=\"mat-select-search-clear\">\n    <mat-icon>close</mat-icon>\n  </button>\n</mat-form-field>\n\n<div *ngIf=\"value && _options?.length === 0\" fxLayoutAlign=\"center center\" class=\"o-combo-search-emmpty\">\n  <span>{{ 'INPUT.COMBO.EMPTY' | oTranslate }}</span>\n</div>\n",
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return OComboSearchComponent; }),
                            multi: true
                        }
                    ],
                    host: {
                        '[class.o-combo-search]': 'true'
                    },
                    styles: [":host{display:flex;flex-direction:column;padding:0 16px}:host .o-combo-search-hidden{display:none}:host .o-combo-search-inner{height:3em;width:100%}:host .o-combo-search-emmpty{height:3em;line-height:3em}"]
                }] }
    ];
    OComboSearchComponent.ctorParameters = function () { return [
        { type: MatSelect, decorators: [{ type: Inject, args: [MatSelect,] }] },
        { type: ChangeDetectorRef }
    ]; };
    OComboSearchComponent.propDecorators = {
        searchSelectInput: [{ type: ViewChild, args: ['searchSelectInput', { read: ElementRef, static: false },] }]
    };
    return OComboSearchComponent;
}());
export { OComboSearchComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb21iby1zZWFyY2guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L2NvbWJvL2NvbWJvLXNlYXJjaC9vLWNvbWJvLXNlYXJjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUlOLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRCxPQUFPLEVBQWEsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDekQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWpEO0lBeUNFLCtCQUM0QixTQUFvQixFQUN0QyxpQkFBb0M7UUFEbEIsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUN0QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBMUJ2QyxnQkFBVyxHQUFXLFFBQVEsQ0FBQztRQW1CNUIsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFHcEMsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUE4Q3BDLGFBQVEsR0FBYSxVQUFDLENBQU07UUFFbkMsQ0FBQyxDQUFBO1FBRU0sY0FBUyxHQUFhLFVBQUMsQ0FBTTtRQUVwQyxDQUFDLENBQUE7SUEvQ0csQ0FBQztJQXJCTCxzQkFBSSx3Q0FBSzthQUFUO1lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLENBQUM7OztPQUFBO0lBcUJNLHdDQUFRLEdBQWY7UUFBQSxpQkFnQ0M7UUE5QkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZ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Qzs0QkFDcEQsS0FBSyxFQUFFLElBQUk7eUJBQ1o7cUJBQ0Y7b0JBQ0QsSUFBSSxFQUFFO3dCQUNKLHdCQUF3QixFQUFFLE1BQU07cUJBQ2pDOztpQkFDRjs7O2dCQWxCbUIsU0FBUyx1QkE4Q3hCLE1BQU0sU0FBQyxTQUFTO2dCQTFEbkIsaUJBQWlCOzs7b0NBZ0RoQixTQUFTLFNBQUMsbUJBQW1CLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7O0lBOEtyRSw0QkFBQztDQUFBLEFBOU1ELElBOE1DO1NBL0xZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXRPcHRpb24sIE1hdFNlbGVjdCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2UsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1jb21iby1zZWFyY2gnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1jb21iby1zZWFyY2guY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWNvbWJvLXNlYXJjaC5jb21wb25lbnQuc2NzcyddLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE9Db21ib1NlYXJjaENvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1jb21iby1zZWFyY2hdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0NvbWJvU2VhcmNoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gIHB1YmxpYyBwbGFjZWhvbGRlcjogc3RyaW5nID0gJ1NFQVJDSCc7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgTWF0U2VsZWN0IG9wdGlvbnMgKi9cbiAgcHVibGljIF9vcHRpb25zOiBRdWVyeUxpc3Q8TWF0T3B0aW9uPjtcblxuICAvKiogQ3VycmVudCBzZWFyY2ggdmFsdWUgKi9cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHByb3RlY3RlZCBfdmFsdWU6IHN0cmluZztcblxuICAvKiogUHJldmlvdXNseSBzZWxlY3RlZCB2YWx1ZXMgd2hlbiB1c2luZyA8bWF0LXNlbGVjdCBbbXVsdGlwbGVdPVwidHJ1ZVwiPiAqL1xuICBwcm90ZWN0ZWQgcHJldmlvdXNTZWxlY3RlZFZhbHVlczogYW55W107XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgc2VhcmNoIGlucHV0IGZpZWxkICovXG4gIEBWaWV3Q2hpbGQoJ3NlYXJjaFNlbGVjdElucHV0JywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IGZhbHNlIH0pXG4gIHByb3RlY3RlZCBzZWFyY2hTZWxlY3RJbnB1dDogRWxlbWVudFJlZjtcblxuICAvKiogRXZlbnQgdGhhdCBlbWl0cyB3aGVuIHRoZSBjdXJyZW50IHZhbHVlIGNoYW5nZXMgKi9cbiAgcHJvdGVjdGVkIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIC8qKiBTdWJqZWN0IHRoYXQgZW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJvdGVjdGVkIF9vbkRlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoTWF0U2VsZWN0KSBwdWJsaWMgbWF0U2VsZWN0OiBNYXRTZWxlY3QsXG4gICAgcHJpdmF0ZSBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgKSB7IH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gd2hlbiB0aGUgc2VsZWN0IGRyb3Bkb3duIHBhbmVsIGlzIG9wZW5lZCBvciBjbG9zZWQsIGZvY3VzIHRoZSBzZWFyY2ggZmllbGQgd2hlbiBvcGVuaW5nIGFuZCBjbGVhciBpdCB3aGVuIGNsb3NpbmdcbiAgICB0aGlzLm1hdFNlbGVjdC5vcGVuZWRDaGFuZ2VcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9vbkRlc3Ryb3kpKVxuICAgICAgLnN1YnNjcmliZShvcGVuZWQgPT4gb3BlbmVkID8gdGhpcy5mb2N1cygpIDogdGhpcy5yZXNldCgpKTtcblxuICAgIC8vIHNldCB0aGUgZmlyc3QgaXRlbSBhY3RpdmUgYWZ0ZXIgdGhlIG9wdGlvbnMgY2hhbmdlZFxuICAgIHRoaXMubWF0U2VsZWN0Lm9wZW5lZENoYW5nZVxuICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9vbkRlc3Ryb3kpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm1hdFNlbGVjdC5tdWx0aXBsZSkge1xuICAgICAgICAgIHRoaXMucHJldmlvdXNTZWxlY3RlZFZhbHVlcyA9IHRoaXMubWF0U2VsZWN0LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB0aGlzLm1hdFNlbGVjdC5vcHRpb25zO1xuICAgICAgICB0aGlzLl9vcHRpb25zLmNoYW5nZXNcbiAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fb25EZXN0cm95KSlcbiAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleU1hbmFnZXIgPSB0aGlzLm1hdFNlbGVjdC5fa2V5TWFuYWdlcjtcbiAgICAgICAgICAgIGlmIChrZXlNYW5hZ2VyICYmIHRoaXMubWF0U2VsZWN0LnBhbmVsT3Blbikge1xuICAgICAgICAgICAgICAvLyBhdm9pZCBcImV4cHJlc3Npb24gaGFzIGJlZW4gY2hhbmdlZFwiIGVycm9yXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ga2V5TWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIC8vIGRldGVjdCBjaGFuZ2VzIHdoZW4gdGhlIGlucHV0IGNoYW5nZXNcbiAgICB0aGlzLmNoYW5nZVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX29uRGVzdHJveSkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpKTtcblxuICAgIHRoaXMuaW5pdE11bHRpcGxlSGFuZGxpbmcoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkRlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX29uRGVzdHJveS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHVibGljIG9uQ2hhbmdlOiBGdW5jdGlvbiA9IChfOiBhbnkpID0+IHtcbiAgICAvLyBkbyBub3RoaW5nXG4gIH1cblxuICBwdWJsaWMgb25Ub3VjaGVkOiBGdW5jdGlvbiA9IChfOiBhbnkpID0+IHtcbiAgICAvLyBkbyBub3RoaW5nXG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUga2V5IGRvd24gZXZlbnQgd2l0aCBNYXRTZWxlY3QuXG4gICAqIEFsbG93cyBlLmcuIHNlbGVjdGluZyB3aXRoIGVudGVyIGtleSwgbmF2aWdhdGlvbiB3aXRoIGFycm93IGtleXMsIGV0Yy5cbiAgICogQHBhcmFtIGV2ZW50XG4gICAqL1xuICBwdWJsaWMgaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzMikge1xuICAgICAgLy8gZG8gbm90IHByb3BhZ2F0ZSBzcGFjZXMgdG8gTWF0U2VsZWN0LCBhcyB0aGlzIHdvdWxkIHNlbGVjdCB0aGUgY3VycmVudGx5IGFjdGl2ZSBvcHRpb25cbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbklucHV0Q2hhbmdlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCB2YWx1ZUNoYW5nZWQgPSB2YWx1ZSAhPT0gdGhpcy5fdmFsdWU7XG4gICAgaWYgKHZhbHVlQ2hhbmdlZCkge1xuICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMub25DaGFuZ2UodmFsdWUpO1xuICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uQmx1cih2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy53cml0ZVZhbHVlKHZhbHVlKTtcbiAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICB9XG5cbiAgcHVibGljIHdyaXRlVmFsdWUodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHZhbHVlQ2hhbmdlZCA9IHZhbHVlICE9PSB0aGlzLl92YWx1ZTtcbiAgICBpZiAodmFsdWVDaGFuZ2VkKSB7XG4gICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogRm9jdXNlcyB0aGUgc2VhcmNoIGlucHV0IGZpZWxkXG4gICAqL1xuICBwdWJsaWMgZm9jdXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNlYXJjaFNlbGVjdElucHV0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIHNhdmUgYW5kIHJlc3RvcmUgc2Nyb2xsVG9wIG9mIHBhbmVsLCBzaW5jZSBpdCB3aWxsIGJlIHJlc2V0IGJ5IGZvY3VzKClcbiAgICAvLyBub3RlOiB0aGlzIGlzIGhhY2t5XG4gICAgY29uc3QgcGFuZWwgPSB0aGlzLm1hdFNlbGVjdC5wYW5lbC5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHBhbmVsLnNjcm9sbFRvcDtcblxuICAgIC8vIGZvY3VzXG4gICAgdGhpcy5zZWFyY2hTZWxlY3RJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG5cbiAgICBwYW5lbC5zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBjdXJyZW50IHNlYXJjaCB2YWx1ZVxuICAgKiBAcGFyYW0gZm9jdXMgd2hldGhlciB0byBmb2N1cyBhZnRlciByZXNldHRpbmdcbiAgICovXG4gIHB1YmxpYyByZXNldChmb2N1cz86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2VhcmNoU2VsZWN0SW5wdXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zZWFyY2hTZWxlY3RJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgdGhpcy5vbklucHV0Q2hhbmdlKCcnKTtcbiAgICBpZiAoZm9jdXMpIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgaGFuZGxpbmcgPG1hdC1zZWxlY3QgW211bHRpcGxlXT1cInRydWVcIj5cbiAgICogTm90ZTogdG8gaW1wcm92ZSB0aGlzIGNvZGUsIG1hdC1zZWxlY3Qgc2hvdWxkIGJlIGV4dGVuZGVkIHRvIGFsbG93IGRpc2FibGluZyByZXNldHRpbmcgdGhlIHNlbGVjdGlvbiB3aGlsZSBmaWx0ZXJpbmcuXG4gICAqL1xuICBwcm90ZWN0ZWQgaW5pdE11bHRpcGxlSGFuZGxpbmcoKTogdm9pZCB7XG4gICAgLy8gaWYgPG1hdC1zZWxlY3QgW211bHRpcGxlXT1cInRydWVcIj5cbiAgICAvLyBzdG9yZSBwcmV2aW91c2x5IHNlbGVjdGVkIHZhbHVlcyBhbmQgcmVzdG9yZSB0aGVtIHdoZW4gdGhleSBhcmUgZGVzZWxlY3RlZFxuICAgIC8vIGJlY2F1c2UgdGhlIG9wdGlvbiBpcyBub3QgYXZhaWxhYmxlIHdoaWxlIHdlIGFyZSBjdXJyZW50bHkgZmlsdGVyaW5nXG4gICAgdGhpcy5tYXRTZWxlY3QudmFsdWVDaGFuZ2VcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9vbkRlc3Ryb3kpKVxuICAgICAgLnN1YnNjcmliZSh2YWx1ZXMgPT4ge1xuICAgICAgICBpZiAodGhpcy5tYXRTZWxlY3QubXVsdGlwbGUpIHtcbiAgICAgICAgICBsZXQgcmVzdG9yZVNlbGVjdGVkVmFsdWVzID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHRoaXMuX3ZhbHVlICYmIHRoaXMuX3ZhbHVlLmxlbmd0aFxuICAgICAgICAgICAgJiYgdGhpcy5wcmV2aW91c1NlbGVjdGVkVmFsdWVzICYmIEFycmF5LmlzQXJyYXkodGhpcy5wcmV2aW91c1NlbGVjdGVkVmFsdWVzKSkge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZXMgfHwgIUFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgICAgICAgICAgICB2YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlcyA9IHRoaXMubWF0U2VsZWN0Lm9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24udmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5wcmV2aW91c1NlbGVjdGVkVmFsdWVzLmZvckVhY2gocHJldmlvdXNWYWx1ZSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZXMuaW5kZXhPZihwcmV2aW91c1ZhbHVlKSA9PT0gLTEgJiYgb3B0aW9uVmFsdWVzLmluZGV4T2YocHJldmlvdXNWYWx1ZSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgYSB2YWx1ZSB0aGF0IHdhcyBzZWxlY3RlZCBiZWZvcmUgaXMgZGVzZWxlY3RlZCBhbmQgbm90IGZvdW5kIGluIHRoZSBvcHRpb25zLCBpdCB3YXMgZGVzZWxlY3RlZFxuICAgICAgICAgICAgICAgIC8vIGR1ZSB0byB0aGUgZmlsdGVyaW5nLCBzbyB3ZSByZXN0b3JlIGl0LlxuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHByZXZpb3VzVmFsdWUpO1xuICAgICAgICAgICAgICAgIHJlc3RvcmVTZWxlY3RlZFZhbHVlcyA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChyZXN0b3JlU2VsZWN0ZWRWYWx1ZXMpIHtcbiAgICAgICAgICAgIHRoaXMubWF0U2VsZWN0Ll9vbkNoYW5nZSh2YWx1ZXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMucHJldmlvdXNTZWxlY3RlZFZhbHVlcyA9IHZhbHVlcztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxufVxuIl19