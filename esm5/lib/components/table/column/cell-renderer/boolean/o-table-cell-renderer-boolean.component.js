import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { Util } from '../../../../../util/util';
import { DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export var DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN = tslib_1.__spread(DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, [
    'trueValue: true-value',
    'falseValue: false-value',
    'booleanType: boolean-type',
    'renderTrueValue: render-true-value',
    'renderFalseValue: render-false-value',
    'renderType: render-type'
]);
var OTableCellRendererBooleanComponent = (function (_super) {
    tslib_1.__extends(OTableCellRendererBooleanComponent, _super);
    function OTableCellRendererBooleanComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this._renderType = 'string';
        _this._booleanType = 'boolean';
        _this.tableColumn.type = 'boolean';
        _this.translateService = _this.injector.get(OTranslateService);
        return _this;
    }
    OTableCellRendererBooleanComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.parseInputs();
    };
    OTableCellRendererBooleanComponent.prototype.parseInputs = function () {
        switch (this.booleanType) {
            case 'string':
                this.parseStringInputs();
                break;
            case 'number':
                this.parseNumberInputs();
                break;
            default:
                this.trueValue = true;
                this.falseValue = false;
                break;
        }
    };
    OTableCellRendererBooleanComponent.prototype.parseStringInputs = function () {
        if ((this.trueValue || '').length === 0) {
            this.trueValue = undefined;
        }
        if ((this.falseValue || '').length === 0) {
            this.falseValue = undefined;
        }
    };
    OTableCellRendererBooleanComponent.prototype.parseNumberInputs = function () {
        this.trueValue = parseInt(this.trueValue, 10);
        if (isNaN(this.trueValue)) {
            this.trueValue = 1;
        }
        this.falseValue = parseInt(this.falseValue, 10);
        if (isNaN(this.falseValue)) {
            this.falseValue = 0;
        }
    };
    OTableCellRendererBooleanComponent.prototype.hasCellDataTrueValue = function (cellData) {
        var result;
        if (Util.isDefined(cellData)) {
            result = (cellData === this.trueValue);
            if (this.booleanType === 'string' && !Util.isDefined(this.trueValue)) {
                result = Util.parseBoolean(cellData, false);
            }
        }
        return result;
    };
    OTableCellRendererBooleanComponent.prototype.getCellData = function (cellvalue, rowvalue) {
        var result = cellvalue;
        var cellIsTrue = this.hasCellDataTrueValue(cellvalue);
        var value = cellIsTrue ? this.trueValue : this.falseValue;
        switch (this.renderType) {
            case 'string':
                result = this.translateService.get(value);
                break;
            case 'number':
                result = value;
                break;
            default:
                break;
        }
        return result;
    };
    Object.defineProperty(OTableCellRendererBooleanComponent.prototype, "booleanType", {
        get: function () {
            return this._booleanType;
        },
        set: function (arg) {
            arg = (arg || '').toLowerCase();
            if (['number', 'boolean', 'string'].indexOf(arg) === -1) {
                arg = 'boolean';
            }
            this._booleanType = arg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableCellRendererBooleanComponent.prototype, "renderType", {
        get: function () {
            return this._renderType;
        },
        set: function (arg) {
            arg = (arg || '').toLowerCase();
            if (['string', 'number', 'icon', 'image'].indexOf(arg) === -1) {
                arg = 'string';
            }
            this._renderType = arg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableCellRendererBooleanComponent.prototype, "renderTrueValue", {
        get: function () {
            return this._renderTrueValue || this.trueValue;
        },
        set: function (arg) {
            this._renderTrueValue = arg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableCellRendererBooleanComponent.prototype, "renderFalseValue", {
        get: function () {
            return this._renderFalseValue || this.falseValue;
        },
        set: function (arg) {
            this._renderFalseValue = arg;
        },
        enumerable: true,
        configurable: true
    });
    OTableCellRendererBooleanComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-renderer-boolean',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\">\n  <ng-container *ngIf=\"hasCellDataTrueValue(cellvalue)\">\n    <ng-container [ngSwitch]=\"renderType\">\n      <ng-container *ngSwitchCase=\"'number'\">{{ renderTrueValue }}</ng-container>\n      <ng-container *ngSwitchCase=\"'icon'\">\n        <mat-icon class=\"material-icons\"> {{ renderTrueValue }}</mat-icon>\n      </ng-container>\n      <ng-container *ngSwitchCase=\"'image'\">\n        <img [src]=\"renderTrueValue\" />\n      </ng-container>\n      <span *ngSwitchDefault>{{ renderTrueValue | oTranslate }}</span>\n    </ng-container>\n  </ng-container>\n  <ng-container *ngIf=\"!hasCellDataTrueValue(cellvalue)\">\n    <ng-container [ngSwitch]=\"renderType\">\n      <ng-container *ngSwitchCase=\"'number'\">{{ renderFalseValue }}</ng-container>\n      <ng-container *ngSwitchCase=\"'icon'\">\n        <mat-icon class=\"material-icons\"> {{ renderFalseValue }}</mat-icon>\n      </ng-container>\n      <ng-container *ngSwitchCase=\"'image'\">\n        <img [src]=\"renderFalseValue\" />\n      </ng-container>\n      <ng-container *ngSwitchDefault>{{ renderFalseValue | oTranslate}}</ng-container>\n    </ng-container>\n  </ng-container>\n</ng-template>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN
                }] }
    ];
    OTableCellRendererBooleanComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OTableCellRendererBooleanComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
    };
    return OTableCellRendererBooleanComponent;
}(OBaseTableCellRenderer));
export { OTableCellRendererBooleanComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLWJvb2xlYW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9jZWxsLXJlbmRlcmVyL2Jvb2xlYW4vby10YWJsZS1jZWxsLXJlbmRlcmVyLWJvb2xlYW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdHLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQzFGLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRCxPQUFPLEVBQUUseUNBQXlDLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUV4SCxNQUFNLENBQUMsSUFBTSw0Q0FBNEMsb0JBQ3BELHlDQUF5QztJQUU1Qyx1QkFBdUI7SUFFdkIseUJBQXlCO0lBRXpCLDJCQUEyQjtJQUUzQixvQ0FBb0M7SUFDcEMsc0NBQXNDO0lBRXRDLHlCQUF5QjtFQUMxQixDQUFDO0FBRUY7SUFNd0QsOERBQXNCO0lBYzVFLDRDQUFzQixRQUFrQjtRQUF4QyxZQUNFLGtCQUFNLFFBQVEsQ0FBQyxTQUdoQjtRQUpxQixjQUFRLEdBQVIsUUFBUSxDQUFVO1FBUDlCLGlCQUFXLEdBQVcsUUFBUSxDQUFDO1FBQy9CLGtCQUFZLEdBQVcsU0FBUyxDQUFDO1FBUXpDLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztRQUNsQyxLQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7SUFDL0QsQ0FBQztJQUVELHVEQUFVLEdBQVY7UUFDRSxpQkFB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LFFBQVEsRUFBRSwrQkFBK0I7b0JBQ3pDLGd0Q0FBNkQ7b0JBQzdELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxNQUFNLEVBQUUsNENBQTRDO2lCQUNyRDs7O2dCQTFCNEMsUUFBUTs7OzhCQXNDbEQsU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7SUFvSC9ELHlDQUFDO0NBQUEsQUFySUQsQ0FNd0Qsc0JBQXNCLEdBK0g3RTtTQS9IWSxrQ0FBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbmplY3RvciwgT25Jbml0LCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9UcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvdHJhbnNsYXRlL28tdHJhbnNsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0JBU0VfVEFCTEVfQ0VMTF9SRU5ERVJFUiwgT0Jhc2VUYWJsZUNlbGxSZW5kZXJlciB9IGZyb20gJy4uL28tYmFzZS10YWJsZS1jZWxsLXJlbmRlcmVyLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9CT09MRUFOID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX0JBU0VfVEFCTEVfQ0VMTF9SRU5ERVJFUixcbiAgLy8gdHJ1ZS12YWx1ZSBbc3RyaW5nXTogdHJ1ZSB2YWx1ZS4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICd0cnVlVmFsdWU6IHRydWUtdmFsdWUnLFxuICAvLyBmYWxzZS12YWx1ZSBbc3RyaW5nXTogZmFsc2UgdmFsdWUuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnZmFsc2VWYWx1ZTogZmFsc2UtdmFsdWUnLFxuICAvLyBmYWxzZS12YWx1ZSBbbnVtYmVyfGJvb2xlYW58c3RyaW5nXTogY2VsbERhdGEgdmFsdWUgdHlwZS4gRGVmYXVsdDogYm9vbGVhblxuICAnYm9vbGVhblR5cGU6IGJvb2xlYW4tdHlwZScsXG5cbiAgJ3JlbmRlclRydWVWYWx1ZTogcmVuZGVyLXRydWUtdmFsdWUnLFxuICAncmVuZGVyRmFsc2VWYWx1ZTogcmVuZGVyLWZhbHNlLXZhbHVlJyxcbiAgLy8gW3N0cmluZ3xudW1iZXJ8aWNvbnxpbWFnZV1cbiAgJ3JlbmRlclR5cGU6IHJlbmRlci10eXBlJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1jZWxsLXJlbmRlcmVyLWJvb2xlYW4nLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1jZWxsLXJlbmRlcmVyLWJvb2xlYW4uY29tcG9uZW50Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfQk9PTEVBTlxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVDZWxsUmVuZGVyZXJCb29sZWFuQ29tcG9uZW50IGV4dGVuZHMgT0Jhc2VUYWJsZUNlbGxSZW5kZXJlciBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgdHJ1ZVZhbHVlOiBhbnk7XG4gIGZhbHNlVmFsdWU6IGFueTtcbiAgcHJvdGVjdGVkIF9yZW5kZXJUcnVlVmFsdWU6IGFueTtcbiAgcHJvdGVjdGVkIF9yZW5kZXJGYWxzZVZhbHVlOiBhbnk7XG5cbiAgcHJvdGVjdGVkIF9yZW5kZXJUeXBlOiBzdHJpbmcgPSAnc3RyaW5nJztcbiAgcHJvdGVjdGVkIF9ib29sZWFuVHlwZTogc3RyaW5nID0gJ2Jvb2xlYW4nO1xuICBwcm90ZWN0ZWQgdHJhbnNsYXRlU2VydmljZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG5cbiAgQFZpZXdDaGlsZCgndGVtcGxhdGVyZWYnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgdGVtcGxhdGVyZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGluamVjdG9yKTtcbiAgICB0aGlzLnRhYmxlQ29sdW1uLnR5cGUgPSAnYm9vbGVhbic7XG4gICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RyYW5zbGF0ZVNlcnZpY2UpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5wYXJzZUlucHV0cygpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlSW5wdXRzKCkge1xuICAgIHN3aXRjaCAodGhpcy5ib29sZWFuVHlwZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgdGhpcy5wYXJzZVN0cmluZ0lucHV0cygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHRoaXMucGFyc2VOdW1iZXJJbnB1dHMoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnRydWVWYWx1ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuZmFsc2VWYWx1ZSA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VTdHJpbmdJbnB1dHMoKSB7XG4gICAgaWYgKCh0aGlzLnRydWVWYWx1ZSB8fCAnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnRydWVWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKCh0aGlzLmZhbHNlVmFsdWUgfHwgJycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5mYWxzZVZhbHVlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBwYXJzZU51bWJlcklucHV0cygpIHtcbiAgICB0aGlzLnRydWVWYWx1ZSA9IHBhcnNlSW50KHRoaXMudHJ1ZVZhbHVlLCAxMCk7XG4gICAgaWYgKGlzTmFOKHRoaXMudHJ1ZVZhbHVlKSkge1xuICAgICAgdGhpcy50cnVlVmFsdWUgPSAxO1xuICAgIH1cbiAgICB0aGlzLmZhbHNlVmFsdWUgPSBwYXJzZUludCh0aGlzLmZhbHNlVmFsdWUsIDEwKTtcbiAgICBpZiAoaXNOYU4odGhpcy5mYWxzZVZhbHVlKSkge1xuICAgICAgdGhpcy5mYWxzZVZhbHVlID0gMDtcbiAgICB9XG4gIH1cblxuICBoYXNDZWxsRGF0YVRydWVWYWx1ZShjZWxsRGF0YTogYW55KTogYm9vbGVhbiB7XG4gICAgbGV0IHJlc3VsdDogYm9vbGVhbjtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoY2VsbERhdGEpKSB7XG4gICAgICByZXN1bHQgPSAoY2VsbERhdGEgPT09IHRoaXMudHJ1ZVZhbHVlKTtcbiAgICAgIGlmICh0aGlzLmJvb2xlYW5UeXBlID09PSAnc3RyaW5nJyAmJiAhVXRpbC5pc0RlZmluZWQodGhpcy50cnVlVmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdCA9IFV0aWwucGFyc2VCb29sZWFuKGNlbGxEYXRhLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRDZWxsRGF0YShjZWxsdmFsdWU6IGFueSwgcm93dmFsdWU/OiBhbnkpIHtcbiAgICBsZXQgcmVzdWx0ID0gY2VsbHZhbHVlO1xuICAgIGNvbnN0IGNlbGxJc1RydWUgPSB0aGlzLmhhc0NlbGxEYXRhVHJ1ZVZhbHVlKGNlbGx2YWx1ZSk7XG4gICAgY29uc3QgdmFsdWUgPSBjZWxsSXNUcnVlID8gdGhpcy50cnVlVmFsdWUgOiB0aGlzLmZhbHNlVmFsdWU7XG4gICAgc3dpdGNoICh0aGlzLnJlbmRlclR5cGUpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIHJlc3VsdCA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQodmFsdWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0IGJvb2xlYW5UeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2Jvb2xlYW5UeXBlO1xuICB9XG5cbiAgc2V0IGJvb2xlYW5UeXBlKGFyZzogc3RyaW5nKSB7XG4gICAgYXJnID0gKGFyZyB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoWydudW1iZXInLCAnYm9vbGVhbicsICdzdHJpbmcnXS5pbmRleE9mKGFyZykgPT09IC0xKSB7XG4gICAgICBhcmcgPSAnYm9vbGVhbic7XG4gICAgfVxuICAgIHRoaXMuX2Jvb2xlYW5UeXBlID0gYXJnO1xuICB9XG5cbiAgZ2V0IHJlbmRlclR5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyVHlwZTtcbiAgfVxuXG4gIHNldCByZW5kZXJUeXBlKGFyZzogc3RyaW5nKSB7XG4gICAgYXJnID0gKGFyZyB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoWydzdHJpbmcnLCAnbnVtYmVyJywgJ2ljb24nLCAnaW1hZ2UnXS5pbmRleE9mKGFyZykgPT09IC0xKSB7XG4gICAgICBhcmcgPSAnc3RyaW5nJztcbiAgICB9XG4gICAgdGhpcy5fcmVuZGVyVHlwZSA9IGFyZztcbiAgfVxuXG4gIGdldCByZW5kZXJUcnVlVmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyVHJ1ZVZhbHVlIHx8IHRoaXMudHJ1ZVZhbHVlO1xuICB9XG5cbiAgc2V0IHJlbmRlclRydWVWYWx1ZShhcmc6IHN0cmluZykge1xuICAgIHRoaXMuX3JlbmRlclRydWVWYWx1ZSA9IGFyZztcbiAgfVxuXG4gIGdldCByZW5kZXJGYWxzZVZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlckZhbHNlVmFsdWUgfHwgdGhpcy5mYWxzZVZhbHVlO1xuICB9XG5cbiAgc2V0IHJlbmRlckZhbHNlVmFsdWUoYXJnOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9yZW5kZXJGYWxzZVZhbHVlID0gYXJnO1xuICB9XG59XG4iXX0=