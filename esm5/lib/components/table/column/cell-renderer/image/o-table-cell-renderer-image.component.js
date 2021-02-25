import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { Util } from '../../../../../util/util';
import { DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export var DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_IMAGE = tslib_1.__spread(DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, [
    'imageType: image-type',
    'emptyImage: empty-image',
    'avatar'
]);
export var DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_IMAGE = [
    'onClick'
];
var OTableCellRendererImageComponent = (function (_super) {
    tslib_1.__extends(OTableCellRendererImageComponent, _super);
    function OTableCellRendererImageComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.tableColumn.type = 'image';
        _this.tableColumn.orderable = false;
        _this.tableColumn.searchable = false;
        return _this;
    }
    OTableCellRendererImageComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        if (this.table) {
            var oCol = this.table.getOColumn(this.tableColumn.attr);
            oCol.title = Util.isDefined(this.tableColumn.title) ? this.tableColumn.title : undefined;
            oCol.definition.contentAlign = oCol.definition.contentAlign ? oCol.definition.contentAlign : 'center';
        }
    };
    OTableCellRendererImageComponent.prototype.getSource = function (cellData) {
        this._source = '';
        switch (this.imageType) {
            case 'base64':
                this._source = cellData ? ('data:image/png;base64,' + ((typeof (cellData.bytes) !== 'undefined') ? cellData.bytes : cellData)) : this.emptyImage;
                break;
            case 'url':
                this._source = cellData ? cellData : this.emptyImage;
                break;
            default:
                this._source = this.emptyImage;
                break;
        }
        return this._source;
    };
    OTableCellRendererImageComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-renderer-image',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\">\n  <div [ngClass]=\"{'image-avatar':avatar,'image-plain':!avatar} \">\n    <img [src]=\"getSource(cellvalue)\">\n  </div>\n</ng-template>\n",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_IMAGE
                }] }
    ];
    OTableCellRendererImageComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OTableCellRendererImageComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
    };
    return OTableCellRendererImageComponent;
}(OBaseTableCellRenderer));
export { OTableCellRendererImageComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLWltYWdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9jb2x1bW4vY2VsbC1yZW5kZXJlci9pbWFnZS9vLXRhYmxlLWNlbGwtcmVuZGVyZXItaW1hZ2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdHLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVoRCxPQUFPLEVBQUUseUNBQXlDLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUV4SCxNQUFNLENBQUMsSUFBTSwwQ0FBMEMsb0JBQ2xELHlDQUF5QztJQUU1Qyx1QkFBdUI7SUFFdkIseUJBQXlCO0lBRXpCLFFBQVE7RUFDVCxDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sMkNBQTJDLEdBQUc7SUFDekQsU0FBUztDQUNWLENBQUM7QUFFRjtJQU1zRCw0REFBc0I7SUFRMUUsMENBQXNCLFFBQWtCO1FBQXhDLFlBQ0Usa0JBQU0sUUFBUSxDQUFDLFNBSWhCO1FBTHFCLGNBQVEsR0FBUixRQUFRLENBQVU7UUFFdEMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ2hDLEtBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUNuQyxLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7O0lBQ3RDLENBQUM7SUFFRCxxREFBVSxHQUFWO1FBQ0UsaUJBQU0sVUFBVSxXQUFFLENBQUM7UUFDbkIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2QsSUFBTSxJQUFJLEdBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUN6RixJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztTQUN2RztJQUNILENBQUM7SUFFRCxvREFBUyxHQUFULFVBQVUsUUFBYTtRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixRQUFRLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDdEIsS0FBSyxRQUFRO2dCQUNYLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUNqSixNQUFNO1lBQ1IsS0FBSyxLQUFLO2dCQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ3JELE1BQU07WUFDUjtnQkFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQy9CLE1BQU07U0FDVDtRQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDOztnQkE1Q0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSw2QkFBNkI7b0JBQ3ZDLDhNQUEyRDtvQkFDM0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLE1BQU0sRUFBRSwwQ0FBMEM7aUJBQ25EOzs7Z0JBekI0QyxRQUFROzs7OEJBZ0NsRCxTQUFTLFNBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOztJQWtDL0QsdUNBQUM7Q0FBQSxBQTlDRCxDQU1zRCxzQkFBc0IsR0F3QzNFO1NBeENZLGdDQUFnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEluamVjdG9yLCBPbkluaXQsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPQ29sdW1uIH0gZnJvbSAnLi4vLi4vby1jb2x1bW4uY2xhc3MnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19CQVNFX1RBQkxFX0NFTExfUkVOREVSRVIsIE9CYXNlVGFibGVDZWxsUmVuZGVyZXIgfSBmcm9tICcuLi9vLWJhc2UtdGFibGUtY2VsbC1yZW5kZXJlci5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfSU1BR0UgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQkFTRV9UQUJMRV9DRUxMX1JFTkRFUkVSLFxuICAvLyBpbWFnZS10eXBlIFtiYXNlNjR8dXJsXTogaW1hZ2UgdHlwZSAoZXh0ZXJuIHVybCBvciBiYXNlNjQpLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ2ltYWdlVHlwZTogaW1hZ2UtdHlwZScsXG4gIC8vIGVtcHR5LWltYWdlIFtzdHJpbmddOiB1cmwgb2YgdGhlIGltYWdlIHRvIGJlIHNob3duIGlmIHRoZSBjb2x1bW4gaGFzIG5vdCBhbnkgdmFsdWUuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnZW1wdHlJbWFnZTogZW1wdHktaW1hZ2UnLFxuICAvLyBhdmF0YXIgW25vfHllc106IHZpZXcgaW1hZ2UgYXMgYXZhdGFyIChjaXJjbGUpLCBvbmx5IGF0IHByZXNlbnRhdGlvbiBsZXZlbC4gRGVmYXVsdDogbm8uXG4gICdhdmF0YXInXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9JTUFHRSA9IFtcbiAgJ29uQ2xpY2snXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWNlbGwtcmVuZGVyZXItaW1hZ2UnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1jZWxsLXJlbmRlcmVyLWltYWdlLmNvbXBvbmVudC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX0lNQUdFXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUNlbGxSZW5kZXJlckltYWdlQ29tcG9uZW50IGV4dGVuZHMgT0Jhc2VUYWJsZUNlbGxSZW5kZXJlciBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHVibGljIGltYWdlVHlwZTogc3RyaW5nO1xuICBwdWJsaWMgZW1wdHlJbWFnZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX3NvdXJjZTogc3RyaW5nO1xuICBhdmF0YXI6IHN0cmluZztcbiAgQFZpZXdDaGlsZCgndGVtcGxhdGVyZWYnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSkgcHVibGljIHRlbXBsYXRlcmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gICAgdGhpcy50YWJsZUNvbHVtbi50eXBlID0gJ2ltYWdlJztcbiAgICB0aGlzLnRhYmxlQ29sdW1uLm9yZGVyYWJsZSA9IGZhbHNlO1xuICAgIHRoaXMudGFibGVDb2x1bW4uc2VhcmNoYWJsZSA9IGZhbHNlO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgaWYgKHRoaXMudGFibGUpIHtcbiAgICAgIGNvbnN0IG9Db2w6IE9Db2x1bW4gPSB0aGlzLnRhYmxlLmdldE9Db2x1bW4odGhpcy50YWJsZUNvbHVtbi5hdHRyKTtcbiAgICAgIG9Db2wudGl0bGUgPSBVdGlsLmlzRGVmaW5lZCh0aGlzLnRhYmxlQ29sdW1uLnRpdGxlKSA/IHRoaXMudGFibGVDb2x1bW4udGl0bGUgOiB1bmRlZmluZWQ7XG4gICAgICBvQ29sLmRlZmluaXRpb24uY29udGVudEFsaWduID0gb0NvbC5kZWZpbml0aW9uLmNvbnRlbnRBbGlnbiA/IG9Db2wuZGVmaW5pdGlvbi5jb250ZW50QWxpZ24gOiAnY2VudGVyJztcbiAgICB9XG4gIH1cblxuICBnZXRTb3VyY2UoY2VsbERhdGE6IGFueSkge1xuICAgIHRoaXMuX3NvdXJjZSA9ICcnO1xuICAgIHN3aXRjaCAodGhpcy5pbWFnZVR5cGUpIHtcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IGNlbGxEYXRhID8gKCdkYXRhOmltYWdlL3BuZztiYXNlNjQsJyArICgodHlwZW9mIChjZWxsRGF0YS5ieXRlcykgIT09ICd1bmRlZmluZWQnKSA/IGNlbGxEYXRhLmJ5dGVzIDogY2VsbERhdGEpKSA6IHRoaXMuZW1wdHlJbWFnZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1cmwnOlxuICAgICAgICB0aGlzLl9zb3VyY2UgPSBjZWxsRGF0YSA/IGNlbGxEYXRhIDogdGhpcy5lbXB0eUltYWdlO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHRoaXMuZW1wdHlJbWFnZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9zb3VyY2U7XG4gIH1cblxufVxuIl19