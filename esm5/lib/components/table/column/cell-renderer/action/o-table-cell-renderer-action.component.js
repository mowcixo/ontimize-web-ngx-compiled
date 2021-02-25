import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, EventEmitter, Injector, TemplateRef, ViewChild } from '@angular/core';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export var DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION = tslib_1.__spread(DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, [
    'icon',
    'svgIcon:svg-icon',
    'action',
    'text',
    'iconPosition: icon-position'
]);
export var DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION = [
    'onClick'
];
var OTableCellRendererActionComponent = (function (_super) {
    tslib_1.__extends(OTableCellRendererActionComponent, _super);
    function OTableCellRendererActionComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.onClick = new EventEmitter();
        _this.tableColumn.type = 'action';
        _this.tableColumn.orderable = false;
        _this.tableColumn.searchable = false;
        return _this;
    }
    OTableCellRendererActionComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        if (this.table) {
            var oCol = this.table.getOColumn(this.tableColumn.attr);
            oCol.title = Util.isDefined(this.tableColumn.title) ? this.tableColumn.title : undefined;
        }
        this.iconPosition = Util.parseIconPosition(this.iconPosition);
    };
    OTableCellRendererActionComponent.prototype.getCellData = function (value) {
        return value;
    };
    OTableCellRendererActionComponent.prototype.innerOnClick = function (event, rowData) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        if (Util.isDefined(this.action)) {
            switch (this.action.toLowerCase()) {
                case 'detail':
                    this.table.viewDetail(rowData);
                    break;
                case 'edit':
                    this.table.editDetail(rowData);
                    break;
                default:
                    break;
            }
        }
        else {
            this.onClick.emit(rowData);
        }
    };
    Object.defineProperty(OTableCellRendererActionComponent.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        set: function (arg) {
            this._icon = arg;
        },
        enumerable: true,
        configurable: true
    });
    OTableCellRendererActionComponent.prototype.isIconPositionLeft = function () {
        return Util.isDefined(this.icon) && this.iconPosition === Codes.ICON_POSITION_LEFT;
    };
    OTableCellRendererActionComponent.prototype.isIconPositionRight = function () {
        return Util.isDefined(this.icon) && this.iconPosition === Codes.ICON_POSITION_RIGHT;
    };
    OTableCellRendererActionComponent.prototype.isSvgIconPositionRight = function () {
        return Util.isDefined(this.svgIcon) && this.iconPosition === Codes.ICON_POSITION_RIGHT;
    };
    OTableCellRendererActionComponent.prototype.isSvgIconPositionLeft = function () {
        return Util.isDefined(this.svgIcon) && this.iconPosition === Codes.ICON_POSITION_LEFT;
    };
    OTableCellRendererActionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-renderer-action',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\" let-rowvalue=\"rowvalue\">\n  <span class=\"o-action-cell-renderer\" (click)=\"innerOnClick($event, rowvalue)\">\n    <mat-icon *ngIf=\"isIconPositionLeft()\">{{ icon }}</mat-icon>\n    <mat-icon *ngIf=\"isSvgIconPositionLeft()\" [svgIcon]=\"svgIcon\"></mat-icon>\n    <span *ngIf=\"text !== undefined\">{{ text | oTranslate }}</span>\n    <mat-icon *ngIf=\"isIconPositionRight()\">{{ icon }}</mat-icon>\n    <mat-icon *ngIf=\"isSvgIconPositionRight()\" [svgIcon]=\"svgIcon\"></mat-icon>\n  </span>\n</ng-template>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION,
                    outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION,
                    styles: [":host .mat-icon{margin:0 4px}"]
                }] }
    ];
    OTableCellRendererActionComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OTableCellRendererActionComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
    };
    return OTableCellRendererActionComponent;
}(OBaseTableCellRenderer));
export { OTableCellRendererActionComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLWFjdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvY29sdW1uL2NlbGwtcmVuZGVyZXIvYWN0aW9uL28tdGFibGUtY2VsbC1yZW5kZXJlci1hY3Rpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQVUsV0FBVyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzSCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hELE9BQU8sRUFBRSx5Q0FBeUMsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRXhILE1BQU0sQ0FBQyxJQUFNLDJDQUEyQyxvQkFDbkQseUNBQXlDO0lBQzVDLE1BQU07SUFDTixrQkFBa0I7SUFDbEIsUUFBUTtJQUNSLE1BQU07SUFDTiw2QkFBNkI7RUFDOUIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLDRDQUE0QyxHQUFHO0lBQzFELFNBQVM7Q0FDVixDQUFDO0FBRUY7SUFRdUQsNkRBQXNCO0lBVzNFLDJDQUFzQixRQUFrQjtRQUF4QyxZQUNFLGtCQUFNLFFBQVEsQ0FBQyxTQUloQjtRQUxxQixjQUFRLEdBQVIsUUFBUSxDQUFVO1FBVHhDLGFBQU8sR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQVd6RCxLQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDakMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ25DLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQzs7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SUFBSSxFQUFFOztJQWtFL0Qsd0NBQUM7Q0FBQSxBQW5GRCxDQVF1RCxzQkFBc0IsR0EyRTVFO1NBM0VZLGlDQUFpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5qZWN0b3IsIE9uSW5pdCwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0JBU0VfVEFCTEVfQ0VMTF9SRU5ERVJFUiwgT0Jhc2VUYWJsZUNlbGxSZW5kZXJlciB9IGZyb20gJy4uL28tYmFzZS10YWJsZS1jZWxsLXJlbmRlcmVyLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9BQ1RJT04gPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQkFTRV9UQUJMRV9DRUxMX1JFTkRFUkVSLFxuICAnaWNvbicsXG4gICdzdmdJY29uOnN2Zy1pY29uJyxcbiAgJ2FjdGlvbicsXG4gICd0ZXh0JyxcbiAgJ2ljb25Qb3NpdGlvbjogaWNvbi1wb3NpdGlvbidcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX0FDVElPTiA9IFtcbiAgJ29uQ2xpY2snXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWNlbGwtcmVuZGVyZXItYWN0aW9uJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY2VsbC1yZW5kZXJlci1hY3Rpb24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXRhYmxlLWNlbGwtcmVuZGVyZXItYWN0aW9uLmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9BQ1RJT04sXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfQUNUSU9OXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUNlbGxSZW5kZXJlckFjdGlvbkNvbXBvbmVudCBleHRlbmRzIE9CYXNlVGFibGVDZWxsUmVuZGVyZXIgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIG9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gIGFjdGlvbjogc3RyaW5nO1xuICBfaWNvbjogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG4gIGljb25Qb3NpdGlvbjogc3RyaW5nO1xuICBwdWJsaWMgc3ZnSWNvbjogc3RyaW5nO1xuXG4gIEBWaWV3Q2hpbGQoJ3RlbXBsYXRlcmVmJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyB0ZW1wbGF0ZXJlZjogVGVtcGxhdGVSZWY8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IpO1xuICAgIHRoaXMudGFibGVDb2x1bW4udHlwZSA9ICdhY3Rpb24nO1xuICAgIHRoaXMudGFibGVDb2x1bW4ub3JkZXJhYmxlID0gZmFsc2U7XG4gICAgdGhpcy50YWJsZUNvbHVtbi5zZWFyY2hhYmxlID0gZmFsc2U7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICBpZiAodGhpcy50YWJsZSkge1xuICAgICAgY29uc3Qgb0NvbCA9IHRoaXMudGFibGUuZ2V0T0NvbHVtbih0aGlzLnRhYmxlQ29sdW1uLmF0dHIpO1xuICAgICAgb0NvbC50aXRsZSA9IFV0aWwuaXNEZWZpbmVkKHRoaXMudGFibGVDb2x1bW4udGl0bGUpID8gdGhpcy50YWJsZUNvbHVtbi50aXRsZSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5pY29uUG9zaXRpb24gPSBVdGlsLnBhcnNlSWNvblBvc2l0aW9uKHRoaXMuaWNvblBvc2l0aW9uKTtcbiAgfVxuXG4gIGdldENlbGxEYXRhKHZhbHVlOiBhbnkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBpbm5lck9uQ2xpY2soZXZlbnQsIHJvd0RhdGEpIHtcbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuYWN0aW9uKSkge1xuICAgICAgc3dpdGNoICh0aGlzLmFjdGlvbi50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIGNhc2UgJ2RldGFpbCc6XG4gICAgICAgICAgdGhpcy50YWJsZS52aWV3RGV0YWlsKHJvd0RhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdlZGl0JzpcbiAgICAgICAgICB0aGlzLnRhYmxlLmVkaXREZXRhaWwocm93RGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25DbGljay5lbWl0KHJvd0RhdGEpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBpY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2ljb247XG4gIH1cblxuICBzZXQgaWNvbihhcmc6IHN0cmluZykge1xuICAgIHRoaXMuX2ljb24gPSBhcmc7XG4gIH1cblxuICBpc0ljb25Qb3NpdGlvbkxlZnQoKSB7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKHRoaXMuaWNvbikgJiYgdGhpcy5pY29uUG9zaXRpb24gPT09IENvZGVzLklDT05fUE9TSVRJT05fTEVGVDtcbiAgfVxuXG4gIGlzSWNvblBvc2l0aW9uUmlnaHQoKSB7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKHRoaXMuaWNvbikgJiYgdGhpcy5pY29uUG9zaXRpb24gPT09IENvZGVzLklDT05fUE9TSVRJT05fUklHSFQ7XG4gIH1cblxuICBpc1N2Z0ljb25Qb3NpdGlvblJpZ2h0KCkge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLnN2Z0ljb24pICYmIHRoaXMuaWNvblBvc2l0aW9uID09PSBDb2Rlcy5JQ09OX1BPU0lUSU9OX1JJR0hUO1xuICB9XG5cbiAgaXNTdmdJY29uUG9zaXRpb25MZWZ0KCkge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLnN2Z0ljb24pICYmIHRoaXMuaWNvblBvc2l0aW9uID09PSBDb2Rlcy5JQ09OX1BPU0lUSU9OX0xFRlQ7XG4gIH1cbn1cbiJdfQ==