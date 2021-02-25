import { ChangeDetectionStrategy, Component, EventEmitter, Injector, TemplateRef, ViewChild } from '@angular/core';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION = [
    ...DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER,
    'icon',
    'svgIcon:svg-icon',
    'action',
    'text',
    'iconPosition: icon-position'
];
export const DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION = [
    'onClick'
];
export class OTableCellRendererActionComponent extends OBaseTableCellRenderer {
    constructor(injector) {
        super(injector);
        this.injector = injector;
        this.onClick = new EventEmitter();
        this.tableColumn.type = 'action';
        this.tableColumn.orderable = false;
        this.tableColumn.searchable = false;
    }
    initialize() {
        super.initialize();
        if (this.table) {
            const oCol = this.table.getOColumn(this.tableColumn.attr);
            oCol.title = Util.isDefined(this.tableColumn.title) ? this.tableColumn.title : undefined;
        }
        this.iconPosition = Util.parseIconPosition(this.iconPosition);
    }
    getCellData(value) {
        return value;
    }
    innerOnClick(event, rowData) {
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
    }
    get icon() {
        return this._icon;
    }
    set icon(arg) {
        this._icon = arg;
    }
    isIconPositionLeft() {
        return Util.isDefined(this.icon) && this.iconPosition === Codes.ICON_POSITION_LEFT;
    }
    isIconPositionRight() {
        return Util.isDefined(this.icon) && this.iconPosition === Codes.ICON_POSITION_RIGHT;
    }
    isSvgIconPositionRight() {
        return Util.isDefined(this.svgIcon) && this.iconPosition === Codes.ICON_POSITION_RIGHT;
    }
    isSvgIconPositionLeft() {
        return Util.isDefined(this.svgIcon) && this.iconPosition === Codes.ICON_POSITION_LEFT;
    }
}
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
OTableCellRendererActionComponent.ctorParameters = () => [
    { type: Injector }
];
OTableCellRendererActionComponent.propDecorators = {
    templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLWFjdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvY29sdW1uL2NlbGwtcmVuZGVyZXIvYWN0aW9uL28tdGFibGUtY2VsbC1yZW5kZXJlci1hY3Rpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNILE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEQsT0FBTyxFQUFFLHlDQUF5QyxFQUFFLHNCQUFzQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFeEgsTUFBTSxDQUFDLE1BQU0sMkNBQTJDLEdBQUc7SUFDekQsR0FBRyx5Q0FBeUM7SUFDNUMsTUFBTTtJQUNOLGtCQUFrQjtJQUNsQixRQUFRO0lBQ1IsTUFBTTtJQUNOLDZCQUE2QjtDQUM5QixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sNENBQTRDLEdBQUc7SUFDMUQsU0FBUztDQUNWLENBQUM7QUFVRixNQUFNLE9BQU8saUNBQWtDLFNBQVEsc0JBQXNCO0lBVzNFLFlBQXNCLFFBQWtCO1FBQ3RDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQURJLGFBQVEsR0FBUixRQUFRLENBQVU7UUFUeEMsWUFBTyxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBV3pELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxV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bnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3RvciwgT25Jbml0LCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fQkFTRV9UQUJMRV9DRUxMX1JFTkRFUkVSLCBPQmFzZVRhYmxlQ2VsbFJlbmRlcmVyIH0gZnJvbSAnLi4vby1iYXNlLXRhYmxlLWNlbGwtcmVuZGVyZXIuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX0FDVElPTiA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19CQVNFX1RBQkxFX0NFTExfUkVOREVSRVIsXG4gICdpY29uJyxcbiAgJ3N2Z0ljb246c3ZnLWljb24nLFxuICAnYWN0aW9uJyxcbiAgJ3RleHQnLFxuICAnaWNvblBvc2l0aW9uOiBpY29uLXBvc2l0aW9uJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfQUNUSU9OID0gW1xuICAnb25DbGljaydcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtY2VsbC1yZW5kZXJlci1hY3Rpb24nLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1jZWxsLXJlbmRlcmVyLWFjdGlvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tdGFibGUtY2VsbC1yZW5kZXJlci1hY3Rpb24uY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX0FDVElPTixcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9BQ1RJT05cbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlQ2VsbFJlbmRlcmVyQWN0aW9uQ29tcG9uZW50IGV4dGVuZHMgT0Jhc2VUYWJsZUNlbGxSZW5kZXJlciBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgb25DbGljazogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgYWN0aW9uOiBzdHJpbmc7XG4gIF9pY29uOiBzdHJpbmc7XG4gIHRleHQ6IHN0cmluZztcbiAgaWNvblBvc2l0aW9uOiBzdHJpbmc7XG4gIHB1YmxpYyBzdmdJY29uOiBzdHJpbmc7XG5cbiAgQFZpZXdDaGlsZCgndGVtcGxhdGVyZWYnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSkgcHVibGljIHRlbXBsYXRlcmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gICAgdGhpcy50YWJsZUNvbHVtbi50eXBlID0gJ2FjdGlvbic7XG4gICAgdGhpcy50YWJsZUNvbHVtbi5vcmRlcmFibGUgPSBmYWxzZTtcbiAgICB0aGlzLnRhYmxlQ29sdW1uLnNlYXJjaGFibGUgPSBmYWxzZTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIGlmICh0aGlzLnRhYmxlKSB7XG4gICAgICBjb25zdCBvQ29sID0gdGhpcy50YWJsZS5nZXRPQ29sdW1uKHRoaXMudGFibGVDb2x1bW4uYXR0cik7XG4gICAgICBvQ29sLnRpdGxlID0gVXRpbC5pc0RlZmluZWQodGhpcy50YWJsZUNvbHVtbi50aXRsZSkgPyB0aGlzLnRhYmxlQ29sdW1uLnRpdGxlIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLmljb25Qb3NpdGlvbiA9IFV0aWwucGFyc2VJY29uUG9zaXRpb24odGhpcy5pY29uUG9zaXRpb24pO1xuICB9XG5cbiAgZ2V0Q2VsbERhdGEodmFsdWU6IGFueSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGlubmVyT25DbGljayhldmVudCwgcm93RGF0YSkge1xuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5hY3Rpb24pKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuYWN0aW9uLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgY2FzZSAnZGV0YWlsJzpcbiAgICAgICAgICB0aGlzLnRhYmxlLnZpZXdEZXRhaWwocm93RGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2VkaXQnOlxuICAgICAgICAgIHRoaXMudGFibGUuZWRpdERldGFpbChyb3dEYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbkNsaWNrLmVtaXQocm93RGF0YSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faWNvbjtcbiAgfVxuXG4gIHNldCBpY29uKGFyZzogc3RyaW5nKSB7XG4gICAgdGhpcy5faWNvbiA9IGFyZztcbiAgfVxuXG4gIGlzSWNvblBvc2l0aW9uTGVmdCgpIHtcbiAgICByZXR1cm4gVXRpbC5pc0RlZmluZWQodGhpcy5pY29uKSAmJiB0aGlzLmljb25Qb3NpdGlvbiA9PT0gQ29kZXMuSUNPTl9QT1NJVElPTl9MRUZUO1xuICB9XG5cbiAgaXNJY29uUG9zaXRpb25SaWdodCgpIHtcbiAgICByZXR1cm4gVXRpbC5pc0RlZmluZWQodGhpcy5pY29uKSAmJiB0aGlzLmljb25Qb3NpdGlvbiA9PT0gQ29kZXMuSUNPTl9QT1NJVElPTl9SSUdIVDtcbiAgfVxuXG4gIGlzU3ZnSWNvblBvc2l0aW9uUmlnaHQoKSB7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKHRoaXMuc3ZnSWNvbikgJiYgdGhpcy5pY29uUG9zaXRpb24gPT09IENvZGVzLklDT05fUE9TSVRJT05fUklHSFQ7XG4gIH1cblxuICBpc1N2Z0ljb25Qb3NpdGlvbkxlZnQoKSB7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKHRoaXMuc3ZnSWNvbikgJiYgdGhpcy5pY29uUG9zaXRpb24gPT09IENvZGVzLklDT05fUE9TSVRJT05fTEVGVDtcbiAgfVxufVxuIl19