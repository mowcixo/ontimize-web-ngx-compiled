import { ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectorRef, Directive, ElementRef, EventEmitter, forwardRef, Input, KeyValueDiffers, NgZone, Output, ViewContainerRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as _moment from 'moment';
import { merge } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DaterangepickerComponent } from './o-daterange-picker.component';
var moment = _moment;
var ODaterangepickerDirective = (function () {
    function ODaterangepickerDirective(_dialog, _ngZone, _overlay, _viewContainerRef, _changeDetectorRef, _el, differs, scrollStrategy) {
        this._dialog = _dialog;
        this._ngZone = _ngZone;
        this._overlay = _overlay;
        this._viewContainerRef = _viewContainerRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._el = _el;
        this.differs = differs;
        this.scrollStrategy = scrollStrategy;
        this._onChange = Function.prototype;
        this._onTouched = Function.prototype;
        this._validatorChange = Function.prototype;
        this.minDate = null;
        this.maxDate = null;
        this.dateLimit = null;
        this.showCancel = false;
        this.timePicker = false;
        this.showRanges = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        this._endKey = 'endDate';
        this._startKey = 'startDate';
        this.ranges = {
            'DATERANGE.today': [moment(), moment()],
            'DATERANGE.yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'DATERANGE.last_7days': [moment().subtract(6, 'days'), moment()],
            'DATERANGE.last_30days': [moment().subtract(29, 'days'), moment()],
            'DATERANGE.this_month': [moment().startOf('month'), moment().endOf('month')],
            'DATERANGE.last_month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'DATERANGE.this_year': [moment().startOf('year'), moment().endOf('year')]
        };
        this.oTouchUi = false;
        this.notForChangesProperty = [
            'locale',
            'endKey',
            'startKey'
        ];
        this.onChange = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.drops = 'down';
        this.opens = 'right';
    }
    Object.defineProperty(ODaterangepickerDirective.prototype, "separator", {
        set: function (value) {
            if (value !== null) {
                this._separator = value;
                if (this._locale) {
                    this._locale.separator = value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODaterangepickerDirective.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        set: function (value) {
            if (value !== null) {
                this._locale = value;
                if (this._separator) {
                    this._locale.separator = this._separator;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODaterangepickerDirective.prototype, "startKey", {
        get: function () {
            return this._startKey;
        },
        set: function (value) {
            if (value && value !== null) {
                this._startKey = value;
            }
            else {
                this._startKey = 'startDate';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODaterangepickerDirective.prototype, "endKey", {
        get: function () {
            return this._endKey;
        },
        set: function (value) {
            if (value && value !== null) {
                this._endKey = value;
            }
            else {
                this._endKey = 'endDate';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODaterangepickerDirective.prototype, "value", {
        get: function () {
            return this._value || null;
        },
        set: function (val) {
            this._value = val;
            this._onChange(val);
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    ODaterangepickerDirective.prototype.initializeListeners = function (instance) {
        var _this = this;
        instance.rangeClicked.asObservable().subscribe(function (range) {
            _this.rangeClicked.emit(range);
        });
        instance.datesUpdated.asObservable().subscribe(function (range) {
            _this.datesUpdated.emit(range);
        });
        instance.choosedDate.asObservable().subscribe(function (change) {
            if (change) {
                var value = {};
                value[_this._startKey] = change.startDate;
                value[_this._endKey] = change.endDate;
                _this.value = value;
                _this.onChange.emit(value);
                if (typeof change.chosenLabel === 'string') {
                    _this._el.nativeElement.value = change.chosenLabel;
                }
            }
        });
        instance.firstMonthDayClass = this.firstMonthDayClass;
        instance.lastMonthDayClass = this.lastMonthDayClass;
        instance.emptyWeekRowClass = this.emptyWeekRowClass;
        instance.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
        instance.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
        instance.drops = this.drops;
        instance.opens = this.opens;
        instance.minDate = this.minDate;
        instance.maxDate = this.maxDate;
        instance.locale = this.locale;
        instance.showWeekNumbers = this.showWeekNumbers;
        if (this.showRanges) {
            instance.ranges = this.ranges;
            instance.keepCalendarOpeningWithRange = true;
            instance.alwaysShowCalendars = true;
        }
        this.localeDiffer = this.differs.find(this.locale).create();
    };
    ODaterangepickerDirective.prototype.onBlur = function () {
        this._onTouched();
    };
    ODaterangepickerDirective.prototype.open = function () {
        if (!this.oTouchUi) {
            this.openAsPopup();
        }
        else {
            this.openAsDialog();
        }
    };
    ODaterangepickerDirective.prototype.ngOnDestroy = function () {
        this.close();
        if (this._popupRef) {
            this._popupRef.dispose();
            this._popupComponentRef = null;
        }
    };
    ODaterangepickerDirective.prototype.clear = function () {
        this._popupComponentRef.instance.clear();
    };
    ODaterangepickerDirective.prototype.writeValue = function (value) {
        this.setValue(value);
    };
    ODaterangepickerDirective.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    ODaterangepickerDirective.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    ODaterangepickerDirective.prototype.setValueInDateComponent = function (instance, val) {
        if (val) {
            if (val[this._startKey]) {
                instance.setStartDate(val[this._startKey]);
            }
            if (val[this._endKey]) {
                instance.setEndDate(val[this._endKey]);
            }
            instance.calculateChosenLabel();
            if (instance.chosenLabel) {
                this._el.nativeElement.value = instance.chosenLabel;
            }
        }
        else {
            instance.clear();
        }
    };
    ODaterangepickerDirective.prototype.setValue = function (val) {
        if (val) {
            this.value = val;
        }
    };
    ODaterangepickerDirective.prototype.openAsPopup = function () {
        var _this = this;
        if (!this._calendarPortal) {
            this._calendarPortal = new ComponentPortal(DaterangepickerComponent, this._viewContainerRef);
        }
        if (!this._popupRef) {
            this._createPopup();
        }
        if (!this._popupRef.hasAttached()) {
            this._popupComponentRef = this._popupRef.attach(this._calendarPortal);
            this.initializeListeners(this._popupComponentRef.instance);
            if (this.value) {
                this.setValueInDateComponent(this._popupComponentRef.instance, this.value);
            }
            this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(function () {
                _this._popupRef.updatePosition();
            });
        }
    };
    ODaterangepickerDirective.prototype._createPopup = function () {
        var _this = this;
        var overlayConfig = new OverlayConfig({
            positionStrategy: this._createPopupPositionStrategy(),
            hasBackdrop: true,
            backdropClass: 'mat-overlay-transparent-backdrop',
            direction: 'ltr',
            panelClass: 'o-daterangepicker-popup',
            scrollStrategy: this.scrollStrategy.close()
        });
        this._popupRef = this._overlay.create(overlayConfig);
        this._popupRef.overlayElement.setAttribute('role', 'dialog');
        merge(this._popupRef.backdropClick(), this._popupRef.detachments(), this._popupRef.keydownEvents().pipe(filter(function (event) {
            return event.keyCode === ESCAPE ||
                (_this._el && event.altKey && event.keyCode === UP_ARROW);
        }))).subscribe(function () { return _this.close(); });
    };
    ODaterangepickerDirective.prototype._createPopupPositionStrategy = function () {
        return this._overlay.position()
            .flexibleConnectedTo(this._el)
            .withViewportMargin(8)
            .withPositions([
            {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top'
            },
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'bottom'
            },
            {
                originX: 'end',
                originY: 'bottom',
                overlayX: 'end',
                overlayY: 'top'
            },
            {
                originX: 'end',
                originY: 'top',
                overlayX: 'end',
                overlayY: 'bottom'
            }
        ]);
    };
    ODaterangepickerDirective.prototype.openAsDialog = function () {
        var _this = this;
        if (this._dialogRef) {
            this._dialogRef.close();
        }
        this._dialogRef = this._dialog.open(DaterangepickerComponent, {
            direction: 'ltr',
            viewContainerRef: this._viewContainerRef,
            panelClass: 'mat-datepicker-dialog',
        });
        this.initializeListeners(this._dialogRef.componentInstance);
        if (this.value) {
            this.setValueInDateComponent(this._dialogRef.componentInstance, this.value);
        }
        this._dialogRef.afterClosed().subscribe(function () { return _this.close(); });
    };
    ODaterangepickerDirective.prototype.close = function () {
        if (this._popupRef && this._popupRef.hasAttached()) {
            this._popupRef.detach();
        }
        if (this._dialogRef) {
            this._dialogRef.close();
        }
        if (this._calendarPortal && this._calendarPortal.isAttached) {
            this._calendarPortal.detach();
        }
    };
    ODaterangepickerDirective.decorators = [
        { type: Directive, args: [{
                    selector: 'input[o-daterange-input]',
                    host: {
                        '(keyup.esc)': 'close()',
                        '(blur)': 'onBlur()'
                    },
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return ODaterangepickerDirective; }), multi: true
                        }
                    ]
                },] }
    ];
    ODaterangepickerDirective.ctorParameters = function () { return [
        { type: MatDialog },
        { type: NgZone },
        { type: Overlay },
        { type: ViewContainerRef },
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: KeyValueDiffers },
        { type: ScrollStrategyOptions }
    ]; };
    ODaterangepickerDirective.propDecorators = {
        minDate: [{ type: Input }],
        maxDate: [{ type: Input }],
        showCustomRangeLabel: [{ type: Input }],
        linkedCalendars: [{ type: Input }],
        dateLimit: [{ type: Input }],
        singleDatePicker: [{ type: Input }],
        showWeekNumbers: [{ type: Input }],
        showISOWeekNumbers: [{ type: Input }],
        showDropdowns: [{ type: Input }],
        isInvalidDate: [{ type: Input }],
        isCustomDate: [{ type: Input }],
        opens: [{ type: Input }],
        drops: [{ type: Input }],
        lastMonthDayClass: [{ type: Input }],
        emptyWeekRowClass: [{ type: Input }],
        firstDayOfNextMonthClass: [{ type: Input }],
        lastDayOfPreviousMonthClass: [{ type: Input }],
        keepCalendarOpeningWithRange: [{ type: Input }],
        showRangeLabelOnInput: [{ type: Input }],
        showCancel: [{ type: Input }],
        timePicker: [{ type: Input }],
        showRanges: [{ type: Input }],
        timePicker24Hour: [{ type: Input }],
        timePickerIncrement: [{ type: Input }],
        timePickerSeconds: [{ type: Input }],
        separator: [{ type: Input }],
        locale: [{ type: Input }],
        _endKey: [{ type: Input }],
        oTouchUi: [{ type: Input }],
        startKey: [{ type: Input }],
        endKey: [{ type: Input }],
        onChange: [{ type: Output }],
        rangeClicked: [{ type: Output }],
        datesUpdated: [{ type: Output }]
    };
    return ODaterangepickerDirective;
}());
export { ODaterangepickerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1kYXRlcmFuZ2UtaW5wdXQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L2RhdGUtcmFuZ2Uvby1kYXRlcmFuZ2UtaW5wdXQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDekQsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQWdDLHFCQUFxQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbkgsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxpQkFBaUIsRUFBZ0IsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBa0IsZUFBZSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFDdE0sT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFNBQVMsRUFBZ0IsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUNsQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDMUUsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBRXZCO0lBa0tFLG1DQUNVLE9BQWtCLEVBQ2xCLE9BQWUsRUFDZixRQUFpQixFQUNsQixpQkFBbUMsRUFDbkMsa0JBQXFDLEVBQ3JDLEdBQWUsRUFDZCxPQUF3QixFQUN4QixjQUFxQztRQVByQyxZQUFP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S0FBSzttQ0FFTCxLQUFLO2tDQUVMLEtBQUs7cUNBRUwsS0FBSztnQ0FFTCxLQUFLO2dDQUVMLEtBQUs7K0JBRUwsS0FBSzt3QkFNTCxLQUFLO3dCQUVMLEtBQUs7b0NBR0wsS0FBSztvQ0FFTCxLQUFLOzJDQUVMLEtBQUs7OENBRUwsS0FBSzsrQ0FFTCxLQUFLO3dDQUVMLEtBQUs7NkJBRUwsS0FBSzs2QkFHTCxLQUFLOzZCQUVMLEtBQUs7bUNBRUwsS0FBSztzQ0FFTCxLQUFLO29DQUVMLEtBQUs7NEJBS0wsS0FBSzt5QkFTTCxLQUFLOzBCQVlMLEtBQUs7MkJBY0wsS0FBSzsyQkFHTCxLQUFLO3lCQVVMLEtBQUs7MkJBd0JMLE1BQU07K0JBQ04sTUFBTTsrQkFDTixNQUFNOztJQW1VVCxnQ0FBQztDQUFBLEFBOWRELElBOGRDO1NBamRZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVTQ0FQRSwgVVBfQVJST1cgfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHsgT3ZlcmxheSwgT3ZlcmxheUNvbmZpZywgT3ZlcmxheVJlZiwgUG9zaXRpb25TdHJhdGVneSwgU2Nyb2xsU3RyYXRlZ3lPcHRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgQ29tcG9uZW50UG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50UmVmLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5wdXQsIEtleVZhbHVlRGlmZmVyLCBLZXlWYWx1ZURpZmZlcnMsIE5nWm9uZSwgT3V0cHV0LCBWaWV3Q29udGFpbmVyUmVmLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWF0RGlhbG9nLCBNYXREaWFsb2dSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9vLWRhdGVyYW5nZS1waWNrZXIuY29tcG9uZW50JztcbmNvbnN0IG1vbWVudCA9IF9tb21lbnQ7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W28tZGF0ZXJhbmdlLWlucHV0XScsXG4gIGhvc3Q6IHtcbiAgICAnKGtleXVwLmVzYyknOiAnY2xvc2UoKScsXG4gICAgJyhibHVyKSc6ICdvbkJsdXIoKSdcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBPRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlKSwgbXVsdGk6IHRydWVcbiAgICB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgT0RhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG5cbiAgcHJpdmF0ZSBfb25DaGFuZ2UgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4gIHByaXZhdGUgX29uVG91Y2hlZCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbiAgcHVibGljIF92YWxpZGF0b3JDaGFuZ2UgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4gIHByaXZhdGUgX3ZhbHVlOiBhbnk7XG5cbiAgcHVibGljIGxvY2FsZURpZmZlcjogS2V5VmFsdWVEaWZmZXI8c3RyaW5nLCBhbnk+O1xuXG4gIEBJbnB1dCgpXG4gIG1pbkRhdGU6IF9tb21lbnQuTW9tZW50ID0gbnVsbDtcbiAgQElucHV0KClcbiAgbWF4RGF0ZTogX21vbWVudC5Nb21lbnQgPSBudWxsO1xuICBASW5wdXQoKVxuICBzaG93Q3VzdG9tUmFuZ2VMYWJlbDogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgbGlua2VkQ2FsZW5kYXJzOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBkYXRlTGltaXQ6IG51bWJlciA9IG51bGw7XG4gIEBJbnB1dCgpXG4gIHNpbmdsZURhdGVQaWNrZXI6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIHNob3dXZWVrTnVtYmVyczogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgc2hvd0lTT1dlZWtOdW1iZXJzOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBzaG93RHJvcGRvd25zOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBpc0ludmFsaWREYXRlOiAoKSA9PiBib29sZWFuO1xuICBASW5wdXQoKVxuICBpc0N1c3RvbURhdGU6ICgpID0+IGJvb2xlYW47XG4gIC8vIEBJbnB1dCgpXG4gIC8vIHNob3dDbGVhckJ1dHRvbjogYm9vbGVhbjtcblxuXG4gIEBJbnB1dCgpXG4gIG9wZW5zOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGRyb3BzOiBzdHJpbmc7XG4gIGZpcnN0TW9udGhEYXlDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBsYXN0TW9udGhEYXlDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBlbXB0eVdlZWtSb3dDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBmaXJzdERheU9mTmV4dE1vbnRoQ2xhc3M6IHN0cmluZztcbiAgQElucHV0KClcbiAgbGFzdERheU9mUHJldmlvdXNNb250aENsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2U6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIHNob3dSYW5nZUxhYmVsT25JbnB1dDogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgc2hvd0NhbmNlbDogYm9vbGVhbiA9IGZhbHNlO1xuICAvLyB0aW1lcGlja2VyIHZhcmlhYmxlc1xuICBASW5wdXQoKVxuICB0aW1lUGlja2VyOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIHNob3dSYW5nZXM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KClcbiAgdGltZVBpY2tlcjI0SG91cjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICB0aW1lUGlja2VySW5jcmVtZW50OiBudW1iZXIgPSAxO1xuICBASW5wdXQoKVxuICB0aW1lUGlja2VyU2Vjb25kczogYm9vbGVhbiA9IGZhbHNlO1xuICBfbG9jYWxlOiBhbnk7XG4gIF9zZXBhcmF0b3I6IHN0cmluZztcblxuICBASW5wdXQoKSBzZXQgc2VwYXJhdG9yKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zZXBhcmF0b3IgPSB2YWx1ZTtcbiAgICAgIGlmICh0aGlzLl9sb2NhbGUpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxlLnNlcGFyYXRvciA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBsb2NhbGUodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2xvY2FsZSA9IHZhbHVlO1xuICAgICAgaWYgKHRoaXMuX3NlcGFyYXRvcikge1xuICAgICAgICB0aGlzLl9sb2NhbGUuc2VwYXJhdG9yID0gdGhpcy5fc2VwYXJhdG9yO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgbG9jYWxlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHByaXZhdGUgX2VuZEtleTogc3RyaW5nID0gJ2VuZERhdGUnO1xuICBwcml2YXRlIF9zdGFydEtleTogc3RyaW5nID0gJ3N0YXJ0RGF0ZSc7XG5cbiAgcHVibGljIHJhbmdlczogYW55ID0ge1xuICAgICdEQVRFUkFOR0UudG9kYXknOiBbbW9tZW50KCksIG1vbWVudCgpXSxcbiAgICAnREFURVJBTkdFLnllc3RlcmRheSc6IFttb21lbnQoKS5zdWJ0cmFjdCgxLCAnZGF5cycpLCBtb21lbnQoKS5zdWJ0cmFjdCgxLCAnZGF5cycpXSxcbiAgICAnREFURVJBTkdFLmxhc3RfN2RheXMnOiBbbW9tZW50KCkuc3VidHJhY3QoNiwgJ2RheXMnKSwgbW9tZW50KCldLFxuICAgICdEQVRFUkFOR0UubGFzdF8zMGRheXMnOiBbbW9tZW50KCkuc3VidHJhY3QoMjksICdkYXlzJyksIG1vbWVudCgpXSxcbiAgICAnREFURVJBTkdFLnRoaXNfbW9udGgnOiBbbW9tZW50KCkuc3RhcnRPZignbW9udGgnKSwgbW9tZW50KCkuZW5kT2YoJ21vbnRoJyldLFxuICAgICdEQVRFUkFOR0UubGFzdF9tb250aCc6IFttb21lbnQoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS5zdGFydE9mKCdtb250aCcpLCBtb21lbnQoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS5lbmRPZignbW9udGgnKV0sXG4gICAgJ0RBVEVSQU5HRS50aGlzX3llYXInOiBbbW9tZW50KCkuc3RhcnRPZigneWVhcicpLCBtb21lbnQoKS5lbmRPZigneWVhcicpXVxuICB9O1xuXG4gIEBJbnB1dCgpXG4gIG9Ub3VjaFVpOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0KCkgc2V0IHN0YXJ0S2V5KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zdGFydEtleSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zdGFydEtleSA9ICdzdGFydERhdGUnO1xuICAgIH1cbiAgfVxuICBnZXQgc3RhcnRLZXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnRLZXk7XG4gIH1cbiAgQElucHV0KCkgc2V0IGVuZEtleSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fZW5kS2V5ID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VuZEtleSA9ICdlbmREYXRlJztcbiAgICB9XG4gIH1cbiAgZ2V0IGVuZEtleSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9lbmRLZXk7XG4gIH1cbiAgbm90Rm9yQ2hhbmdlc1Byb3BlcnR5OiBBcnJheTxzdHJpbmc+ID0gW1xuICAgICdsb2NhbGUnLFxuICAgICdlbmRLZXknLFxuICAgICdzdGFydEtleSdcbiAgXTtcblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlIHx8IG51bGw7XG4gIH1cbiAgc2V0IHZhbHVlKHZhbCkge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsO1xuICAgIHRoaXMuX29uQ2hhbmdlKHZhbCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgQE91dHB1dCgpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHJhbmdlQ2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkYXRlc1VwZGF0ZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgX3BvcHVwQ29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8RGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50PiB8IG51bGw7XG4gIHByaXZhdGUgX2NhbGVuZGFyUG9ydGFsOiBDb21wb25lbnRQb3J0YWw8RGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50PjtcbiAgX3BvcHVwUmVmOiBPdmVybGF5UmVmO1xuICBwcml2YXRlIF9kaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQ+IHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9kaWFsb2c6IE1hdERpYWxvZyxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHB1YmxpYyBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwdWJsaWMgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwdWJsaWMgX2VsOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLFxuICAgIHByaXZhdGUgc2Nyb2xsU3RyYXRlZ3k6IFNjcm9sbFN0cmF0ZWd5T3B0aW9uc1xuICApIHtcbiAgICB0aGlzLmRyb3BzID0gJ2Rvd24nO1xuICAgIHRoaXMub3BlbnMgPSAncmlnaHQnO1xuICB9XG5cbiAgaW5pdGlhbGl6ZUxpc3RlbmVycyhpbnN0YW5jZSkge1xuICAgIGluc3RhbmNlLnJhbmdlQ2xpY2tlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKHJhbmdlOiBhbnkpID0+IHtcbiAgICAgIHRoaXMucmFuZ2VDbGlja2VkLmVtaXQocmFuZ2UpO1xuICAgIH0pO1xuICAgIGluc3RhbmNlLmRhdGVzVXBkYXRlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKHJhbmdlOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuZGF0ZXNVcGRhdGVkLmVtaXQocmFuZ2UpO1xuICAgIH0pO1xuICAgIGluc3RhbmNlLmNob29zZWREYXRlLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoY2hhbmdlOiBhbnkpID0+IHtcbiAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB7fTtcbiAgICAgICAgdmFsdWVbdGhpcy5fc3RhcnRLZXldID0gY2hhbmdlLnN0YXJ0RGF0ZTtcbiAgICAgICAgdmFsdWVbdGhpcy5fZW5kS2V5XSA9IGNoYW5nZS5lbmREYXRlO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMub25DaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gICAgICAgIGlmICh0eXBlb2YgY2hhbmdlLmNob3NlbkxhYmVsID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBjaGFuZ2UuY2hvc2VuTGFiZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBpbnN0YW5jZS5maXJzdE1vbnRoRGF5Q2xhc3MgPSB0aGlzLmZpcnN0TW9udGhEYXlDbGFzcztcbiAgICBpbnN0YW5jZS5sYXN0TW9udGhEYXlDbGFzcyA9IHRoaXMubGFzdE1vbnRoRGF5Q2xhc3M7XG4gICAgaW5zdGFuY2UuZW1wdHlXZWVrUm93Q2xhc3MgPSB0aGlzLmVtcHR5V2Vla1Jvd0NsYXNzO1xuICAgIGluc3RhbmNlLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcyA9IHRoaXMuZmlyc3REYXlPZk5leHRNb250aENsYXNzO1xuICAgIGluc3RhbmNlLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcyA9IHRoaXMubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzO1xuICAgIGluc3RhbmNlLmRyb3BzID0gdGhpcy5kcm9wcztcbiAgICBpbnN0YW5jZS5vcGVucyA9IHRoaXMub3BlbnM7XG4gICAgaW5zdGFuY2UubWluRGF0ZSA9IHRoaXMubWluRGF0ZTtcbiAgICBpbnN0YW5jZS5tYXhEYXRlID0gdGhpcy5tYXhEYXRlO1xuICAgIGluc3RhbmNlLmxvY2FsZSA9IHRoaXMubG9jYWxlO1xuICAgIGluc3RhbmNlLnNob3dXZWVrTnVtYmVycyA9IHRoaXMuc2hvd1dlZWtOdW1iZXJzO1xuXG4gICAgaWYgKHRoaXMuc2hvd1Jhbmdlcykge1xuICAgICAgaW5zdGFuY2UucmFuZ2VzID0gdGhpcy5yYW5nZXM7XG4gICAgICBpbnN0YW5jZS5rZWVwQ2FsZW5kYXJPcGVuaW5nV2l0aFJhbmdlID0gdHJ1ZTtcbiAgICAgIGluc3RhbmNlLmFsd2F5c1Nob3dDYWxlbmRhcnMgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLmxvY2FsZURpZmZlciA9IHRoaXMuZGlmZmVycy5maW5kKHRoaXMubG9jYWxlKS5jcmVhdGUoKTtcbiAgfVxuXG4gIC8vIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkICB7XG4gIC8vICAgZm9yIChsZXQgY2hhbmdlIGluIGNoYW5nZXMpIHtcbiAgLy8gICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KGNoYW5nZSkpIHtcbiAgLy8gICAgICAgaWYgKHRoaXMubm90Rm9yQ2hhbmdlc1Byb3BlcnR5LmluZGV4T2YoY2hhbmdlKSA9PT0gLTEpIHtcbiAgLy8gICAgICAgICB0aGlzLnBpY2tlcltjaGFuZ2VdID0gY2hhbmdlc1tjaGFuZ2VdLmN1cnJlbnRWYWx1ZTtcbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIG5nRG9DaGVjaygpIHtcbiAgLy8gICBpZiAodGhpcy5sb2NhbGVEaWZmZXIpIHtcbiAgLy8gICAgIGNvbnN0IGNoYW5nZXMgPSB0aGlzLmxvY2FsZURpZmZlci5kaWZmKHRoaXMubG9jYWxlKTtcbiAgLy8gICAgIGlmIChjaGFuZ2VzKSB7XG4gIC8vICAgICAgIHRoaXMucGlja2VyLnVwZGF0ZUxvY2FsZSh0aGlzLmxvY2FsZSk7XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgb25CbHVyKCkge1xuICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICB9XG5cbiAgb3BlbigpIHtcbiAgICBpZiAoIXRoaXMub1RvdWNoVWkpIHtcbiAgICAgIHRoaXMub3BlbkFzUG9wdXAoKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW5Bc0RpYWxvZygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY2xvc2UoKTtcblxuICAgIGlmICh0aGlzLl9wb3B1cFJlZikge1xuICAgICAgdGhpcy5fcG9wdXBSZWYuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fcG9wdXBDb21wb25lbnRSZWYgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX3BvcHVwQ29tcG9uZW50UmVmLmluc3RhbmNlLmNsZWFyKCk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG4gIH1cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbikge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm4pIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIHNldFZhbHVlSW5EYXRlQ29tcG9uZW50KGluc3RhbmNlLCB2YWwpIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICBpZiAodmFsW3RoaXMuX3N0YXJ0S2V5XSkge1xuICAgICAgICBpbnN0YW5jZS5zZXRTdGFydERhdGUodmFsW3RoaXMuX3N0YXJ0S2V5XSk7XG4gICAgICB9XG4gICAgICBpZiAodmFsW3RoaXMuX2VuZEtleV0pIHtcbiAgICAgICAgaW5zdGFuY2Uuc2V0RW5kRGF0ZSh2YWxbdGhpcy5fZW5kS2V5XSk7XG4gICAgICB9XG4gICAgICBpbnN0YW5jZS5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuICAgICAgaWYgKGluc3RhbmNlLmNob3NlbkxhYmVsKSB7XG4gICAgICAgIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBpbnN0YW5jZS5jaG9zZW5MYWJlbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaW5zdGFuY2UuY2xlYXIoKTtcbiAgICB9XG5cbiAgfVxuICBwcml2YXRlIHNldFZhbHVlKHZhbDogYW55KSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcblxuICAgIH1cbiAgfVxuICAvKipcbiAgICogU2V0IHBvc2l0aW9uIG9mIHRoZSBjYWxlbmRhclxuICAgKi9cbiAgLy8gc2V0UG9zaXRpb24oKSB7XG4gIC8vICAgbGV0IHN0eWxlO1xuICAvLyAgIGxldCBjb250YWluZXJUb3A7XG4gIC8vICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5waWNrZXIucGlja2VyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XG4gIC8vICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQ7XG4gIC8vICAgaWYgKHRoaXMuZHJvcHMgJiYgdGhpcy5kcm9wcyA9PSAndXAnKSB7XG4gIC8vICAgICBjb250YWluZXJUb3AgPSAoZWxlbWVudC5vZmZzZXRUb3AgLSBjb250YWluZXIuY2xpZW50SGVpZ2h0KSArICdweCc7XG4gIC8vICAgfSBlbHNlIHtcbiAgLy8gICAgIGNvbnRhaW5lclRvcCA9ICdhdXRvJztcbiAgLy8gICB9XG4gIC8vICAgaWYgKHRoaXMub3BlbnMgPT0gJ2xlZnQnKSB7XG4gIC8vICAgICBzdHlsZSA9IHtcbiAgLy8gICAgICAgICB0b3A6IGNvbnRhaW5lclRvcCxcbiAgLy8gICAgICAgICBsZWZ0OiAoZWxlbWVudC5vZmZzZXRMZWZ0IC0gY29udGFpbmVyLmNsaWVudFdpZHRoICsgZWxlbWVudC5jbGllbnRXaWR0aCkgKyAncHgnLFxuICAvLyAgICAgICAgIHJpZ2h0OiAnYXV0bydcbiAgLy8gICAgIH07XG4gIC8vICAgfSBlbHNlIGlmICh0aGlzLm9wZW5zID09ICdjZW50ZXInKSB7XG4gIC8vICAgICAgIHN0eWxlID0ge1xuICAvLyAgICAgICAgIHRvcDogY29udGFpbmVyVG9wLFxuICAvLyAgICAgICAgIGxlZnQ6IChlbGVtZW50Lm9mZnNldExlZnQgICsgIGVsZW1lbnQuY2xpZW50V2lkdGggLyAyXG4gIC8vICAgICAgICAgICAgICAgICAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIDIpICsgJ3B4JyxcbiAgLy8gICAgICAgICByaWdodDogJ2F1dG8nXG4gIC8vICAgICAgIH07XG4gIC8vICAgfSBlbHNlIHtcbiAgLy8gICAgICAgc3R5bGUgPSB7XG4gIC8vICAgICAgICAgdG9wOiBjb250YWluZXJUb3AsXG4gIC8vICAgICAgICAgbGVmdDogZWxlbWVudC5vZmZzZXRMZWZ0ICArICdweCcsXG4gIC8vICAgICAgICAgcmlnaHQ6ICdhdXRvJ1xuICAvLyAgICAgICB9XG4gIC8vICAgfVxuICAvLyAgIGlmIChzdHlsZSkge1xuICAvLyAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAndG9wJywgc3R5bGUudG9wKTtcbiAgLy8gICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ2xlZnQnLCBzdHlsZS5sZWZ0KTtcbiAgLy8gICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3JpZ2h0Jywgc3R5bGUucmlnaHQpO1xuICAvLyAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAncG9zaXRpb24nLCAnZml4ZWQnKTtcbiAgLy8gICB9XG4gIC8vIH1cbiAgLyoqXG4gICAqIEZvciBjbGljayBvdXRzaWRlIG9mIHRoZSBjYWxlbmRhcidzIGNvbnRhaW5lclxuICAgKiBAcGFyYW0gZXZlbnQgZXZlbnQgb2JqZWN0XG4gICAqIEBwYXJhbSB0YXJnZXRFbGVtZW50IHRhcmdldCBlbGVtZW50IG9iamVjdFxuICAgKi9cbiAgLy8gQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCcsICckZXZlbnQudGFyZ2V0J10pXG4gIC8vIG91dHNpZGVDbGljayhldmVudCwgdGFyZ2V0RWxlbWVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgLy8gICAgIGlmICghdGFyZ2V0RWxlbWVudCkge1xuICAvLyAgICAgICByZXR1cm47XG4gIC8vICAgICB9XG4gIC8vICAgICBpZiAodGFyZ2V0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25neC1kYXRlcmFuZ2VwaWNrZXItYWN0aW9uJykpIHtcbiAgLy8gICAgICAgcmV0dXJuO1xuICAvLyAgICAgfVxuICAvLyAgICAgY29uc3QgY2xpY2tlZEluc2lkZSA9IHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQuY29udGFpbnModGFyZ2V0RWxlbWVudCk7XG4gIC8vICAgICBpZiAoIWNsaWNrZWRJbnNpZGUpIHtcbiAgLy8gICAgICAgIHRoaXMuaGlkZSgpXG4gIC8vICAgICB9XG4gIC8vIH1cblxuXG5cbiAgLyoqICovXG4gIHB1YmxpYyBvcGVuQXNQb3B1cCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2NhbGVuZGFyUG9ydGFsKSB7XG4gICAgICB0aGlzLl9jYWxlbmRhclBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWw8RGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50PihEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQsXG4gICAgICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fcG9wdXBSZWYpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVBvcHVwKCk7XG4gICAgfVxuXG5cbiAgICBpZiAoIXRoaXMuX3BvcHVwUmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuX3BvcHVwQ29tcG9uZW50UmVmID0gdGhpcy5fcG9wdXBSZWYuYXR0YWNoKHRoaXMuX2NhbGVuZGFyUG9ydGFsKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUxpc3RlbmVycyh0aGlzLl9wb3B1cENvbXBvbmVudFJlZi5pbnN0YW5jZSk7XG4gICAgICBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgICB0aGlzLnNldFZhbHVlSW5EYXRlQ29tcG9uZW50KHRoaXMuX3BvcHVwQ29tcG9uZW50UmVmLmluc3RhbmNlLCB0aGlzLnZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gVXBkYXRlIHRoZSBwb3NpdGlvbiBvbmNlIHRoZSBjYWxlbmRhciBoYXMgcmVuZGVyZWQuXG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUuYXNPYnNlcnZhYmxlKCkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9wb3B1cFJlZi51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIC8qKiBDcmVhdGUgdGhlIHBvcHVwLiAqL1xuICBwcml2YXRlIF9jcmVhdGVQb3B1cCgpOiB2b2lkIHtcbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fY3JlYXRlUG9wdXBQb3NpdGlvblN0cmF0ZWd5KCksXG4gICAgICBoYXNCYWNrZHJvcDogdHJ1ZSxcbiAgICAgIGJhY2tkcm9wQ2xhc3M6ICdtYXQtb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsXG4gICAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgICAgcGFuZWxDbGFzczogJ28tZGF0ZXJhbmdlcGlja2VyLXBvcHVwJyxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLnNjcm9sbFN0cmF0ZWd5LmNsb3NlKClcbiAgICB9KTtcblxuICAgIHRoaXMuX3BvcHVwUmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUob3ZlcmxheUNvbmZpZyk7XG4gICAgdGhpcy5fcG9wdXBSZWYub3ZlcmxheUVsZW1lbnQuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2RpYWxvZycpO1xuXG4gICAgbWVyZ2UoXG4gICAgICB0aGlzLl9wb3B1cFJlZi5iYWNrZHJvcENsaWNrKCksXG4gICAgICB0aGlzLl9wb3B1cFJlZi5kZXRhY2htZW50cygpLFxuICAgICAgdGhpcy5fcG9wdXBSZWYua2V5ZG93bkV2ZW50cygpLnBpcGUoZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgLy8gQ2xvc2luZyBvbiBhbHQgKyB1cCBpcyBvbmx5IHZhbGlkIHdoZW4gdGhlcmUncyBhbiBpbnB1dCBhc3NvY2lhdGVkIHdpdGggdGhlIGRhdGVwaWNrZXIuXG4gICAgICAgIHJldHVybiBldmVudC5rZXlDb2RlID09PSBFU0NBUEUgfHxcbiAgICAgICAgICAodGhpcy5fZWwgJiYgZXZlbnQuYWx0S2V5ICYmIGV2ZW50LmtleUNvZGUgPT09IFVQX0FSUk9XKTtcbiAgICAgIH0pKVxuICAgICkuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2xvc2UoKSk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVQb3B1cFBvc2l0aW9uU3RyYXRlZ3koKTogUG9zaXRpb25TdHJhdGVneSB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXkucG9zaXRpb24oKVxuICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5fZWwpXG4gICAgICAvLyAud2l0aFRyYW5zZm9ybU9yaWdpbk9uKCcubWF0LWRhdGVwaWNrZXItY29udGVudCcpXG4gICAgICAvLyAud2l0aEZsZXhpYmxlRGltZW5zaW9ucyhmYWxzZSlcbiAgICAgIC53aXRoVmlld3BvcnRNYXJnaW4oOClcbiAgICAgIC8vIC53aXRoTG9ja2VkUG9zaXRpb24oKVxuICAgICAgLndpdGhQb3NpdGlvbnMoW1xuICAgICAgICB7XG4gICAgICAgICAgb3JpZ2luWDogJ3N0YXJ0JyxcbiAgICAgICAgICBvcmlnaW5ZOiAnYm90dG9tJyxcbiAgICAgICAgICBvdmVybGF5WDogJ3N0YXJ0JyxcbiAgICAgICAgICBvdmVybGF5WTogJ3RvcCdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG9yaWdpblg6ICdzdGFydCcsXG4gICAgICAgICAgb3JpZ2luWTogJ3RvcCcsXG4gICAgICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICAgICAgb3ZlcmxheVk6ICdib3R0b20nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5YOiAnZW5kJyxcbiAgICAgICAgICBvcmlnaW5ZOiAnYm90dG9tJyxcbiAgICAgICAgICBvdmVybGF5WDogJ2VuZCcsXG4gICAgICAgICAgb3ZlcmxheVk6ICd0b3AnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5YOiAnZW5kJyxcbiAgICAgICAgICBvcmlnaW5ZOiAndG9wJyxcbiAgICAgICAgICBvdmVybGF5WDogJ2VuZCcsXG4gICAgICAgICAgb3ZlcmxheVk6ICdib3R0b20nXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICB9XG5cblxuICAvKiogT3BlbiB0aGUgY2FsZW5kYXIgYXMgYSBkaWFsb2cuICovXG4gIHB1YmxpYyBvcGVuQXNEaWFsb2coKTogdm9pZCB7XG4gICAgLy8gVXN1YWxseSB0aGlzIHdvdWxkIGJlIGhhbmRsZWQgYnkgYG9wZW5gIHdoaWNoIGVuc3VyZXMgdGhhdCB3ZSBjYW4gb25seSBoYXZlIG9uZSBvdmVybGF5XG4gICAgLy8gb3BlbiBhdCBhIHRpbWUsIGhvd2V2ZXIgc2luY2Ugd2UgcmVzZXQgdGhlIHZhcmlhYmxlcyBpbiBhc3luYyBoYW5kbGVycyBzb21lIG92ZXJsYXlzXG4gICAgLy8gbWF5IHNsaXAgdGhyb3VnaCBpZiB0aGUgdXNlciBvcGVucyBhbmQgY2xvc2VzIG11bHRpcGxlIHRpbWVzIGluIHF1aWNrIHN1Y2Nlc3Npb24gKGUuZy5cbiAgICAvLyBieSBob2xkaW5nIGRvd24gdGhlIGVudGVyIGtleSkuXG4gICAgaWYgKHRoaXMuX2RpYWxvZ1JlZikge1xuICAgICAgdGhpcy5fZGlhbG9nUmVmLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fZGlhbG9nUmVmID0gdGhpcy5fZGlhbG9nLm9wZW48RGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50PihEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQsIHtcbiAgICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgICB2aWV3Q29udGFpbmVyUmVmOiB0aGlzLl92aWV3Q29udGFpbmVyUmVmLFxuICAgICAgcGFuZWxDbGFzczogJ21hdC1kYXRlcGlja2VyLWRpYWxvZycsXG4gICAgfSk7XG5cbiAgICB0aGlzLmluaXRpYWxpemVMaXN0ZW5lcnModGhpcy5fZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlKTtcbiAgICBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy5zZXRWYWx1ZUluRGF0ZUNvbXBvbmVudCh0aGlzLl9kaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UsIHRoaXMudmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLl9kaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZSgpKTtcbiAgICAvLyB0aGlzLl9kaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuID0gdGhpcztcblxuICB9XG5cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3BvcHVwUmVmICYmIHRoaXMuX3BvcHVwUmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuX3BvcHVwUmVmLmRldGFjaCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9kaWFsb2dSZWYpIHtcbiAgICAgIHRoaXMuX2RpYWxvZ1JlZi5jbG9zZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9jYWxlbmRhclBvcnRhbCAmJiB0aGlzLl9jYWxlbmRhclBvcnRhbC5pc0F0dGFjaGVkKSB7XG4gICAgICB0aGlzLl9jYWxlbmRhclBvcnRhbC5kZXRhY2goKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==