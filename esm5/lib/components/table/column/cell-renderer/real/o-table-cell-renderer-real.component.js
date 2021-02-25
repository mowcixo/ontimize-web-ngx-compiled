import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { ORealPipe } from '../../../../../pipes/o-real.pipe';
import { NumberService } from '../../../../../services/number.service';
import { DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER, OTableCellRendererIntegerComponent, } from '../integer/o-table-cell-renderer-integer.component';
export var DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL = tslib_1.__spread(DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER, [
    'decimalSeparator: decimal-separator',
    'minDecimalDigits: min-decimal-digits',
    'maxDecimalDigits: max-decimal-digits'
]);
var OTableCellRendererRealComponent = (function (_super) {
    tslib_1.__extends(OTableCellRendererRealComponent, _super);
    function OTableCellRendererRealComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.minDecimalDigits = 2;
        _this.maxDecimalDigits = 2;
        _this.decimalSeparator = '.';
        _this.tableColumn.type = 'real';
        _this.numberService = _this.injector.get(NumberService);
        _this.setComponentPipe();
        return _this;
    }
    OTableCellRendererRealComponent.prototype.setComponentPipe = function () {
        this.componentPipe = new ORealPipe(this.injector);
    };
    OTableCellRendererRealComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.pipeArguments = {
            minDecimalDigits: this.minDecimalDigits,
            maxDecimalDigits: this.maxDecimalDigits,
            decimalSeparator: this.decimalSeparator,
            grouping: this.grouping,
            thousandSeparator: this.thousandSeparator
        };
    };
    OTableCellRendererRealComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-renderer-real',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\">\n        {{ getCellData(cellvalue)}}\n</ng-template>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL
                }] }
    ];
    OTableCellRendererRealComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OTableCellRendererRealComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OTableCellRendererRealComponent.prototype, "minDecimalDigits", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OTableCellRendererRealComponent.prototype, "maxDecimalDigits", void 0);
    return OTableCellRendererRealComponent;
}(OTableCellRendererIntegerComponent));
export { OTableCellRendererRealComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLXJlYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9jZWxsLXJlbmRlcmVyL3JlYWwvby10YWJsZS1jZWxsLXJlbmRlcmVyLXJlYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUMzRSxPQUFPLEVBQXFCLFNBQVMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUN2RSxPQUFPLEVBQ0wsNENBQTRDLEVBQzVDLGtDQUFrQyxHQUNuQyxNQUFNLG9EQUFvRCxDQUFDO0FBRTVELE1BQU0sQ0FBQyxJQUFNLHlDQUF5QyxvQkFDakQsNENBQTRDO0lBRS9DLHFDQUFxQztJQUNyQyxzQ0FBc0M7SUFDdEMsc0NBQXNDO0VBQ3ZDLENBQUM7QUFFRjtJQU1xRCwyREFBa0M7SUFlckYseUNBQXNCLFFBQWtCO1FBQXhDLFlBQ0Usa0JBQU0sUUFBUSxDQUFDLFNBSWhCO1FBTHFCLGNBQVEsR0FBUixRQUFRLENBQVU7UUFaeEMsc0JBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBRTdCLHNCQUFnQixHQUFXLENBQUMsQ0FBQztRQUVuQixzQkFBZ0IsR0FBVyxHQUFHLENBQUM7UUFVdkMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQy9CLEtBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdEQsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7O0lBQzFCLENBQUM7SUFFRCwwREFBZ0IsR0FBaEI7UUFDRSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsb0RBQVUsR0FBVjtRQUNFLGlCQUFNLFVBQVUsV0FBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUc7WUFDbkIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtZQUN2QyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ3ZDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7WUFDdkMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLGlCQUFpQixFQUFFLElBQUksQ0FBQyxpQkFBaUI7U0FDMUMsQ0FBQztJQUNKLENBQUM7O2dCQXpDRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtvQkFDdEMsdUhBQTBEO29CQUMxRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsTUFBTSxFQUFFLHlDQUF5QztpQkFDbEQ7OztnQkF2QjRDLFFBQVE7Ozs4QkFxQ2xELFNBQVMsU0FBQyxhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7O0lBVjdEO1FBREMsY0FBYyxFQUFFOzs2RUFDWTtJQUU3QjtRQURDLGNBQWMsRUFBRTs7NkVBQ1k7SUFnQy9CLHNDQUFDO0NBQUEsQUEzQ0QsQ0FNcUQsa0NBQWtDLEdBcUN0RjtTQXJDWSwrQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbmplY3RvciwgT25Jbml0LCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgSVJlYWxQaXBlQXJndW1lbnQsIE9SZWFsUGlwZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3BpcGVzL28tcmVhbC5waXBlJztcbmltcG9ydCB7IE51bWJlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2aWNlcy9udW1iZXIuc2VydmljZSc7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfSU5URUdFUixcbiAgT1RhYmxlQ2VsbFJlbmRlcmVySW50ZWdlckNvbXBvbmVudCxcbn0gZnJvbSAnLi4vaW50ZWdlci9vLXRhYmxlLWNlbGwtcmVuZGVyZXItaW50ZWdlci5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX1JFQUwgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9JTlRFR0VSLFxuICAvLyBkZWNpbWFsLXNlcGFyYXRvciBbc3RyaW5nXTogZGVjaW1hbCBzZXBhcmF0b3IuIERlZmF1bHQ6IGRvdCAoLikuXG4gICdkZWNpbWFsU2VwYXJhdG9yOiBkZWNpbWFsLXNlcGFyYXRvcicsXG4gICdtaW5EZWNpbWFsRGlnaXRzOiBtaW4tZGVjaW1hbC1kaWdpdHMnLFxuICAnbWF4RGVjaW1hbERpZ2l0czogbWF4LWRlY2ltYWwtZGlnaXRzJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1jZWxsLXJlbmRlcmVyLXJlYWwnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1jZWxsLXJlbmRlcmVyLXJlYWwuY29tcG9uZW50Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfUkVBTFxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVDZWxsUmVuZGVyZXJSZWFsQ29tcG9uZW50IGV4dGVuZHMgT1RhYmxlQ2VsbFJlbmRlcmVySW50ZWdlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgbWluRGVjaW1hbERpZ2l0czogbnVtYmVyID0gMjtcbiAgQElucHV0Q29udmVydGVyKClcbiAgbWF4RGVjaW1hbERpZ2l0czogbnVtYmVyID0gMjtcblxuICBwcm90ZWN0ZWQgZGVjaW1hbFNlcGFyYXRvcjogc3RyaW5nID0gJy4nO1xuICBwcm90ZWN0ZWQgbnVtYmVyU2VydmljZTogTnVtYmVyU2VydmljZTtcblxuICBwcm90ZWN0ZWQgY29tcG9uZW50UGlwZTogT1JlYWxQaXBlO1xuICBwcm90ZWN0ZWQgcGlwZUFyZ3VtZW50czogSVJlYWxQaXBlQXJndW1lbnQ7XG5cbiAgQFZpZXdDaGlsZCgndGVtcGxhdGVyZWYnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSkgcHVibGljIHRlbXBsYXRlcmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gICAgdGhpcy50YWJsZUNvbHVtbi50eXBlID0gJ3JlYWwnO1xuICAgIHRoaXMubnVtYmVyU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE51bWJlclNlcnZpY2UpO1xuICAgIHRoaXMuc2V0Q29tcG9uZW50UGlwZSgpO1xuICB9XG5cbiAgc2V0Q29tcG9uZW50UGlwZSgpIHtcbiAgICB0aGlzLmNvbXBvbmVudFBpcGUgPSBuZXcgT1JlYWxQaXBlKHRoaXMuaW5qZWN0b3IpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5waXBlQXJndW1lbnRzID0ge1xuICAgICAgbWluRGVjaW1hbERpZ2l0czogdGhpcy5taW5EZWNpbWFsRGlnaXRzLFxuICAgICAgbWF4RGVjaW1hbERpZ2l0czogdGhpcy5tYXhEZWNpbWFsRGlnaXRzLFxuICAgICAgZGVjaW1hbFNlcGFyYXRvcjogdGhpcy5kZWNpbWFsU2VwYXJhdG9yLFxuICAgICAgZ3JvdXBpbmc6IHRoaXMuZ3JvdXBpbmcsXG4gICAgICB0aG91c2FuZFNlcGFyYXRvcjogdGhpcy50aG91c2FuZFNlcGFyYXRvclxuICAgIH07XG4gIH1cblxufVxuIl19