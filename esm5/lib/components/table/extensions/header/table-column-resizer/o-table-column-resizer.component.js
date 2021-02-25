import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, HostListener, Inject, NgZone, Renderer2, ViewEncapsulation, } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { Util } from '../../../../../util/util';
import { OTableComponent } from '../../../o-table.component';
export var DEFAULT_INPUTS_O_TABLE_COLUMN_RESIZER = [
    'column'
];
export var DEFAULT_OUTPUTS_O_TABLE_COLUMN_RESIZER = [];
var OTableColumnResizerComponent = (function () {
    function OTableColumnResizerComponent(table, elRef, ngZone, renderer) {
        this.table = table;
        this.elRef = elRef;
        this.ngZone = ngZone;
        this.renderer = renderer;
        this.disabled = false;
        this.dragListeners = [];
        this.isResizing = false;
        this.blockedMinCols = [];
        this.blockedMaxCols = [];
        this.columnsStartWidth = {};
    }
    OTableColumnResizerComponent.prototype.ngOnInit = function () {
        if (!this.isDisabled) {
            this.headerEl = this.getHeaderEL();
            if (this.headerEl) {
                this.nextOColumns = this.getFollowingOColumns();
            }
        }
    };
    OTableColumnResizerComponent.prototype.ngOnDestroy = function () {
        this.stopDragging();
    };
    OTableColumnResizerComponent.prototype.onClick = function (event) {
        event.stopPropagation();
        event.preventDefault();
    };
    Object.defineProperty(OTableColumnResizerComponent.prototype, "isDisabled", {
        get: function () {
            return this.column && !this.column.resizable;
        },
        enumerable: true,
        configurable: true
    });
    OTableColumnResizerComponent.prototype.onMousedown = function (e) {
        if (!this.isDisabled) {
            this.startResize(e);
        }
    };
    OTableColumnResizerComponent.prototype.onMouseup = function () {
        this.isResizing = false;
        this.stopDragging();
    };
    OTableColumnResizerComponent.prototype.stopDragging = function () {
        this.isResizing = false;
        this.columnsStartWidth = {};
        while (this.dragListeners.length > 0) {
            var fct = this.dragListeners.pop();
            if (fct) {
                fct();
            }
        }
    };
    OTableColumnResizerComponent.prototype.startResize = function (startEvent) {
        var _this = this;
        startEvent.preventDefault();
        startEvent.stopPropagation();
        if (!Util.isDefined(this.headerEl)) {
            return;
        }
        var DOMWidth = this.table.getClientWidthColumn(this.column);
        this.startX = startEvent.screenX;
        this.startWidth = DOMWidth;
        this.minWidth = this.column.getMinWidthValue();
        this.initializeWidthData();
        this.ngZone.runOutsideAngular(function () {
            _this.dragListeners.push(_this.renderer.listen('document', 'mouseup', function (e) { return _this.stopDragging(); }));
        });
        if (!(startEvent instanceof MouseEvent)) {
            return;
        }
        this.ngZone.runOutsideAngular(function () {
            _this.dragListeners.push(_this.renderer.listen('document', 'mousemove', function (e) { return _this.resizeEvent(e); }));
        });
        this.isResizing = true;
    };
    OTableColumnResizerComponent.prototype.resizeEvent = function (event) {
        if (!this.isResizing || !(event instanceof MouseEvent)) {
            return;
        }
        var movementX = (event.screenX - this.startX);
        if (movementX === 0) {
            return;
        }
        var newColumnWidth = this.startWidth + movementX;
        var lessThanMin = newColumnWidth < this.minWidth;
        var moreThanMax = newColumnWidth > this.maxWidth;
        if (lessThanMin || moreThanMax) {
            return;
        }
        if (!this.table.horizontalScroll) {
            this.calculateNewColumnsWidth(movementX, newColumnWidth);
            this.updateBlockedCols();
        }
        else {
            this.column.setWidth(newColumnWidth);
        }
        this.table.cd.detectChanges();
    };
    OTableColumnResizerComponent.prototype.getHeaderEL = function () {
        var element;
        var currentEl = this.elRef.nativeElement.parentElement;
        while (!element && currentEl) {
            if (currentEl.nodeName === 'TH') {
                element = currentEl;
            }
            else {
                currentEl = currentEl.parentElement;
            }
        }
        return currentEl;
    };
    OTableColumnResizerComponent.prototype.getFollowingOColumns = function () {
        var result = [];
        var nextTh = this.headerEl.nextSibling;
        var self = this;
        while (nextTh) {
            var oCol = self.table.getOColumnFromTh(nextTh);
            if (Util.isDefined(oCol)) {
                result.push(oCol);
            }
            nextTh = nextTh.nextSibling;
        }
        return result;
    };
    OTableColumnResizerComponent.prototype.updateBlockedCols = function () {
        var _this = this;
        var self = this;
        this.blockedMinCols = [];
        this.blockedMaxCols = [];
        var columns = tslib_1.__spread([this.column], this.nextOColumns);
        columns.forEach(function (oCol) {
            var DOMWidth = _this.table.getClientWidthColumn(oCol);
            if (DOMWidth <= oCol.getMinWidthValue()) {
                self.blockedMinCols.push(oCol.attr);
            }
            var maxW = oCol.getMaxWidthValue();
            if (Util.isDefined(maxW) && DOMWidth >= maxW) {
                self.blockedMaxCols.push(oCol.attr);
            }
        });
    };
    OTableColumnResizerComponent.prototype.calculateNewColumnsWidth = function (movementX, newColumnWidth) {
        var positive = (movementX > 0);
        if (positive) {
            this.calculateUsingNextColumnsRestrictions(movementX, newColumnWidth);
        }
        else {
            this.calculateUsingOwnColumnRestriction(movementX, newColumnWidth);
        }
    };
    OTableColumnResizerComponent.prototype.calculateUsingNextColumnsRestrictions = function (movementX, newColumnWidth) {
        var _this = this;
        var availableCols = this.nextOColumns.length - this.blockedMinCols.length;
        if (availableCols <= 0) {
            return;
        }
        var widthRatio = movementX / availableCols;
        var cols = this.nextOColumns.filter(function (oCol) { return _this.blockedMinCols.indexOf(oCol.attr) === -1; });
        cols.forEach(function (oCol) {
            var newWidth = (_this.columnsStartWidth[oCol.attr] - widthRatio);
            var minWidth = oCol.getMinWidthValue();
            if (newWidth <= minWidth) {
                newWidth = minWidth;
                _this.blockedMinCols.push(oCol.attr);
            }
            oCol.setWidth(newWidth);
        });
        this.column.setWidth(newColumnWidth);
    };
    OTableColumnResizerComponent.prototype.calculateUsingOwnColumnRestriction = function (movementX, newColumnWidth) {
        var _this = this;
        var widthRatio = Math.abs(movementX) / this.nextOColumns.length;
        var widthDifference = 0;
        if (widthRatio > 0 && this.blockedMaxCols.length < this.nextOColumns.length) {
            var cols = this.nextOColumns.filter(function (oCol) { return _this.blockedMaxCols.indexOf(oCol.attr) === -1; });
            cols.forEach(function (oCol) {
                var newWidthValue = (_this.columnsStartWidth[oCol.attr] + widthRatio);
                var maxWidth = oCol.getMaxWidthValue();
                if (maxWidth && newWidthValue > maxWidth) {
                    var diff = newWidthValue - maxWidth;
                    newWidthValue = maxWidth;
                    _this.blockedMaxCols.push(oCol.attr);
                    var notBlocked = _this.nextOColumns.length - _this.blockedMaxCols.length;
                    widthRatio += notBlocked > 0 ? Math.floor(diff / notBlocked) : 0;
                }
                var DOMWidth = _this.table.getClientWidthColumn(oCol);
                widthDifference += newWidthValue - DOMWidth;
                oCol.setWidth(newWidthValue);
            });
        }
        var newWidth = Math.min(this.startWidth - widthDifference, newColumnWidth);
        this.column.setWidth(newWidth);
    };
    OTableColumnResizerComponent.prototype.initializeWidthData = function () {
        var _this = this;
        var maxWidth = this.column.getMaxWidthValue();
        var nextColMinWidthAcum = 0;
        var nextColWidthAcum = 0;
        this.nextOColumns.forEach(function (col) {
            nextColMinWidthAcum += col.getMinWidthValue();
            var DOMWidth = _this.table.getClientWidthColumn(col);
            nextColWidthAcum += DOMWidth;
            _this.columnsStartWidth[col.attr] = DOMWidth;
        });
        var calcMaxWidth = this.headerEl.clientWidth + (nextColWidthAcum - nextColMinWidthAcum);
        if (Util.isDefined(maxWidth)) {
            maxWidth = Math.min(maxWidth, calcMaxWidth);
        }
        else {
            maxWidth = calcMaxWidth;
        }
        this.maxWidth = maxWidth;
    };
    OTableColumnResizerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-column-resizer',
                    inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_RESIZER,
                    outputs: DEFAULT_OUTPUTS_O_TABLE_COLUMN_RESIZER,
                    template: "<span class=\"resizer\" (click)=\"onClick($event)\"></span>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-table-column-resizer]': 'true',
                        '[class.disabled]': 'isDisabled',
                    },
                    styles: [".o-table-column-resizer{display:inline-block;width:13px;position:absolute;right:0;top:6px;bottom:6px}.o-table-column-resizer:not(.disabled){cursor:col-resize}.o-table-column-resizer span{height:100%;width:1px;display:block;margin-left:auto;margin-right:auto}.o-table-column-resizer.disabled{cursor:default}"]
                }] }
    ];
    OTableColumnResizerComponent.ctorParameters = function () { return [
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] },
        { type: ElementRef },
        { type: NgZone },
        { type: Renderer2 }
    ]; };
    OTableColumnResizerComponent.propDecorators = {
        onMousedown: [{ type: HostListener, args: ['mousedown', ['$event'],] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableColumnResizerComponent.prototype, "disabled", void 0);
    return OTableColumnResizerComponent;
}());
export { OTableColumnResizerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jb2x1bW4tcmVzaXplci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9oZWFkZXIvdGFibGUtY29sdW1uLXJlc2l6ZXIvby10YWJsZS1jb2x1bW4tcmVzaXplci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixNQUFNLEVBR04sU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDM0UsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRWhELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUU3RCxNQUFNLENBQUMsSUFBTSxxQ0FBcUMsR0FBRztJQUNuRCxRQUFRO0NBQ1QsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLHNDQUFzQyxHQUFHLEVBR3JELENBQUM7QUFFRjtJQXNDRSxzQ0FDb0QsS0FBc0IsRUFDOUQsS0FBaUIsRUFDakIsTUFBYyxFQUNkLFFBQW1CO1FBSHFCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBQzlELFVBQUssR0FBTCxLQUFLLENBQVk7UUFDakIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQVc7UUF6Qi9CLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFjaEIsa0JBQWEsR0FBc0IsRUFBRSxDQUFDO1FBQ3RDLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUIsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFDcEIsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFFcEIsc0JBQWlCLEdBQUcsRUFB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QkFDakM7O2lCQUNGOzs7Z0JBdkJRLGVBQWUsdUJBa0RuQixNQUFNLFNBQUMsVUFBVSxDQUFDLGNBQU0sT0FBQSxlQUFlLEVBQWYsQ0FBZSxDQUFDO2dCQWhFM0MsVUFBVTtnQkFJVixNQUFNO2dCQUdOLFNBQVM7Ozs4QkFxRlIsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7SUFsRHJDO1FBREMsY0FBYyxFQUFFOztrRUFDUztJQTZPNUIsbUNBQUM7Q0FBQSxBQTlQRCxJQThQQztTQWpQWSw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPQ29sdW1uIH0gZnJvbSAnLi4vLi4vLi4vY29sdW1uL28tY29sdW1uLmNsYXNzJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL28tdGFibGUuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ09MVU1OX1JFU0laRVIgPSBbXG4gICdjb2x1bW4nXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ09MVU1OX1JFU0laRVIgPSBbXG4gIC8vICdyZXNpemluZycsXG4gIC8vICdyZXNpemVkJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1jb2x1bW4tcmVzaXplcicsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DT0xVTU5fUkVTSVpFUixcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ09MVU1OX1JFU0laRVIsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWNvbHVtbi1yZXNpemVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS1jb2x1bW4tcmVzaXplci5jb21wb25lbnQuc2NzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby10YWJsZS1jb2x1bW4tcmVzaXplcl0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5kaXNhYmxlZF0nOiAnaXNEaXNhYmxlZCcsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlQ29sdW1uUmVzaXplckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBjb2x1bW46IE9Db2x1bW47XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLy8gcmVzaXppbmcgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIC8vIHJlc2l6ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcbiAgcHJvdGVjdGVkIHN0YXJ0V2lkdGg6IGFueTtcbiAgcHJvdGVjdGVkIG1pbldpZHRoOiBhbnk7XG4gIHByb3RlY3RlZCBtYXhXaWR0aDogYW55O1xuXG4gIHByb3RlY3RlZCBzdGFydFg6IGFueTtcblxuICBwcm90ZWN0ZWQgaGVhZGVyRWw6IGFueTtcblxuICBwcm90ZWN0ZWQgbmV4dE9Db2x1bW5zOiBPQ29sdW1uW107XG5cbiAgcHJvdGVjdGVkIGRyYWdMaXN0ZW5lcnM6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG4gIHByb3RlY3RlZCBpc1Jlc2l6aW5nOiBib29sZWFuID0gZmFsc2U7XG4gIHByb3RlY3RlZCBibG9ja2VkTWluQ29scyA9IFtdO1xuICBwcm90ZWN0ZWQgYmxvY2tlZE1heENvbHMgPSBbXTtcblxuICBwcm90ZWN0ZWQgY29sdW1uc1N0YXJ0V2lkdGggPSB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT1RhYmxlQ29tcG9uZW50KSkgcHVibGljIHRhYmxlOiBPVGFibGVDb21wb25lbnQsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHsgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc0Rpc2FibGVkKSB7XG4gICAgICB0aGlzLmhlYWRlckVsID0gdGhpcy5nZXRIZWFkZXJFTCgpO1xuICAgICAgaWYgKHRoaXMuaGVhZGVyRWwpIHtcbiAgICAgICAgdGhpcy5uZXh0T0NvbHVtbnMgPSB0aGlzLmdldEZvbGxvd2luZ09Db2x1bW5zKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdG9wRHJhZ2dpbmcoKTtcbiAgfVxuXG4gIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgZ2V0IGlzRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1uICYmICF0aGlzLmNvbHVtbi5yZXNpemFibGU7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nLCBbJyRldmVudCddKVxuICBvbk1vdXNlZG93bihlOiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmlzRGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRSZXNpemUoZSk7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZXVwKCkge1xuICAgIHRoaXMuaXNSZXNpemluZyA9IGZhbHNlO1xuICAgIHRoaXMuc3RvcERyYWdnaW5nKCk7XG4gICAgLy8gdGhpcy5yZXNpemUuZW1pdCh0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0b3BEcmFnZ2luZygpIHtcbiAgICB0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcbiAgICB0aGlzLmNvbHVtbnNTdGFydFdpZHRoID0ge307XG4gICAgd2hpbGUgKHRoaXMuZHJhZ0xpc3RlbmVycy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmY3QgPSB0aGlzLmRyYWdMaXN0ZW5lcnMucG9wKCk7XG4gICAgICBpZiAoZmN0KSB7XG4gICAgICAgIGZjdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXJ0UmVzaXplKHN0YXJ0RXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBzdGFydEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgc3RhcnRFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMuaGVhZGVyRWwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IERPTVdpZHRoID0gdGhpcy50YWJsZS5nZXRDbGllbnRXaWR0aENvbHVtbih0aGlzLmNvbHVtbik7XG4gICAgdGhpcy5zdGFydFggPSBzdGFydEV2ZW50LnNjcmVlblg7XG4gICAgdGhpcy5zdGFydFdpZHRoID0gRE9NV2lkdGg7XG4gICAgdGhpcy5taW5XaWR0aCA9IHRoaXMuY29sdW1uLmdldE1pbldpZHRoVmFsdWUoKTtcbiAgICB0aGlzLmluaXRpYWxpemVXaWR0aERhdGEoKTtcbiAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLmRyYWdMaXN0ZW5lcnMucHVzaCh0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2V1cCcsIChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnN0b3BEcmFnZ2luZygpKSk7XG4gICAgfSk7XG5cbiAgICBpZiAoIShzdGFydEV2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5kcmFnTGlzdGVuZXJzLnB1c2godGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNlbW92ZScsIChlOiBNb3VzZUV2ZW50KSA9PiB0aGlzLnJlc2l6ZUV2ZW50KGUpKSk7XG4gICAgfSk7XG4gICAgdGhpcy5pc1Jlc2l6aW5nID0gdHJ1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZXNpemVFdmVudChldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1Jlc2l6aW5nIHx8ICEoZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBtb3ZlbWVudFggPSAoZXZlbnQuc2NyZWVuWCAtIHRoaXMuc3RhcnRYKTtcbiAgICBpZiAobW92ZW1lbnRYID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5ld0NvbHVtbldpZHRoID0gdGhpcy5zdGFydFdpZHRoICsgbW92ZW1lbnRYO1xuXG4gICAgY29uc3QgbGVzc1RoYW5NaW4gPSBuZXdDb2x1bW5XaWR0aCA8IHRoaXMubWluV2lkdGg7XG4gICAgY29uc3QgbW9yZVRoYW5NYXggPSBuZXdDb2x1bW5XaWR0aCA+IHRoaXMubWF4V2lkdGg7XG4gICAgaWYgKGxlc3NUaGFuTWluIHx8IG1vcmVUaGFuTWF4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy50YWJsZS5ob3Jpem9udGFsU2Nyb2xsKSB7XG4gICAgICB0aGlzLmNhbGN1bGF0ZU5ld0NvbHVtbnNXaWR0aChtb3ZlbWVudFgsIG5ld0NvbHVtbldpZHRoKTtcbiAgICAgIHRoaXMudXBkYXRlQmxvY2tlZENvbHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb2x1bW4uc2V0V2lkdGgobmV3Q29sdW1uV2lkdGgpO1xuICAgIH1cbiAgICB0aGlzLnRhYmxlLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRIZWFkZXJFTCgpOiBOb2RlIHtcbiAgICBsZXQgZWxlbWVudDtcbiAgICBsZXQgY3VycmVudEVsOiBOb2RlID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgd2hpbGUgKCFlbGVtZW50ICYmIGN1cnJlbnRFbCkge1xuICAgICAgaWYgKGN1cnJlbnRFbC5ub2RlTmFtZSA9PT0gJ1RIJykge1xuICAgICAgICBlbGVtZW50ID0gY3VycmVudEVsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudEVsID0gY3VycmVudEVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjdXJyZW50RWw7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Rm9sbG93aW5nT0NvbHVtbnMoKTogT0NvbHVtbltdIHtcbiAgICBjb25zdCByZXN1bHQ6IE9Db2x1bW5bXSA9IFtdO1xuICAgIGxldCBuZXh0VGg6IGFueSA9IHRoaXMuaGVhZGVyRWwubmV4dFNpYmxpbmc7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgd2hpbGUgKG5leHRUaCkge1xuICAgICAgY29uc3Qgb0NvbDogT0NvbHVtbiA9IHNlbGYudGFibGUuZ2V0T0NvbHVtbkZyb21UaChuZXh0VGgpO1xuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKG9Db2wpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKG9Db2wpO1xuICAgICAgfVxuICAgICAgbmV4dFRoID0gbmV4dFRoLm5leHRTaWJsaW5nO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZUJsb2NrZWRDb2xzKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuYmxvY2tlZE1pbkNvbHMgPSBbXTtcbiAgICB0aGlzLmJsb2NrZWRNYXhDb2xzID0gW107XG4gICAgY29uc3QgY29sdW1ucyA9IFt0aGlzLmNvbHVtbiwgLi4udGhpcy5uZXh0T0NvbHVtbnNdO1xuICAgIGNvbHVtbnMuZm9yRWFjaChvQ29sID0+IHtcbiAgICAgIGNvbnN0IERPTVdpZHRoID0gdGhpcy50YWJsZS5nZXRDbGllbnRXaWR0aENvbHVtbihvQ29sKTtcbiAgICAgIGlmIChET01XaWR0aCA8PSBvQ29sLmdldE1pbldpZHRoVmFsdWUoKSkge1xuICAgICAgICBzZWxmLmJsb2NrZWRNaW5Db2xzLnB1c2gob0NvbC5hdHRyKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1heFcgPSBvQ29sLmdldE1heFdpZHRoVmFsdWUoKTtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChtYXhXKSAmJiBET01XaWR0aCA+PSBtYXhXKSB7XG4gICAgICAgIHNlbGYuYmxvY2tlZE1heENvbHMucHVzaChvQ29sLmF0dHIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNhbGN1bGF0ZU5ld0NvbHVtbnNXaWR0aChtb3ZlbWVudFg6IG51bWJlciwgbmV3Q29sdW1uV2lkdGg6IG51bWJlcikge1xuICAgIGNvbnN0IHBvc2l0aXZlID0gKG1vdmVtZW50WCA+IDApO1xuICAgIGlmIChwb3NpdGl2ZSkge1xuICAgICAgdGhpcy5jYWxjdWxhdGVVc2luZ05leHRDb2x1bW5zUmVzdHJpY3Rpb25zKG1vdmVtZW50WCwgbmV3Q29sdW1uV2lkdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNhbGN1bGF0ZVVzaW5nT3duQ29sdW1uUmVzdHJpY3Rpb24obW92ZW1lbnRYLCBuZXdDb2x1bW5XaWR0aCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNhbGN1bGF0ZVVzaW5nTmV4dENvbHVtbnNSZXN0cmljdGlvbnMobW92ZW1lbnRYOiBudW1iZXIsIG5ld0NvbHVtbldpZHRoOiBudW1iZXIpIHtcbiAgICBjb25zdCBhdmFpbGFibGVDb2xzID0gdGhpcy5uZXh0T0NvbHVtbnMubGVuZ3RoIC0gdGhpcy5ibG9ja2VkTWluQ29scy5sZW5ndGg7XG4gICAgaWYgKGF2YWlsYWJsZUNvbHMgPD0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB3aWR0aFJhdGlvID0gbW92ZW1lbnRYIC8gYXZhaWxhYmxlQ29scztcbiAgICBjb25zdCBjb2xzID0gdGhpcy5uZXh0T0NvbHVtbnMuZmlsdGVyKChvQ29sOiBPQ29sdW1uKSA9PiB0aGlzLmJsb2NrZWRNaW5Db2xzLmluZGV4T2Yob0NvbC5hdHRyKSA9PT0gLTEpO1xuICAgIGNvbHMuZm9yRWFjaChvQ29sID0+IHtcbiAgICAgIGxldCBuZXdXaWR0aCA9ICh0aGlzLmNvbHVtbnNTdGFydFdpZHRoW29Db2wuYXR0cl0gLSB3aWR0aFJhdGlvKTtcbiAgICAgIGNvbnN0IG1pbldpZHRoID0gb0NvbC5nZXRNaW5XaWR0aFZhbHVlKCk7XG4gICAgICBpZiAobmV3V2lkdGggPD0gbWluV2lkdGgpIHtcbiAgICAgICAgbmV3V2lkdGggPSBtaW5XaWR0aDtcbiAgICAgICAgdGhpcy5ibG9ja2VkTWluQ29scy5wdXNoKG9Db2wuYXR0cik7XG4gICAgICB9XG4gICAgICBvQ29sLnNldFdpZHRoKG5ld1dpZHRoKTtcbiAgICB9KTtcbiAgICB0aGlzLmNvbHVtbi5zZXRXaWR0aChuZXdDb2x1bW5XaWR0aCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY2FsY3VsYXRlVXNpbmdPd25Db2x1bW5SZXN0cmljdGlvbihtb3ZlbWVudFg6IG51bWJlciwgbmV3Q29sdW1uV2lkdGg6IG51bWJlcikge1xuICAgIGxldCB3aWR0aFJhdGlvID0gTWF0aC5hYnMobW92ZW1lbnRYKSAvIHRoaXMubmV4dE9Db2x1bW5zLmxlbmd0aDtcbiAgICBsZXQgd2lkdGhEaWZmZXJlbmNlID0gMDtcbiAgICBpZiAod2lkdGhSYXRpbyA+IDAgJiYgdGhpcy5ibG9ja2VkTWF4Q29scy5sZW5ndGggPCB0aGlzLm5leHRPQ29sdW1ucy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNvbHMgPSB0aGlzLm5leHRPQ29sdW1ucy5maWx0ZXIoKG9Db2w6IE9Db2x1bW4pID0+IHRoaXMuYmxvY2tlZE1heENvbHMuaW5kZXhPZihvQ29sLmF0dHIpID09PSAtMSk7XG4gICAgICBjb2xzLmZvckVhY2gob0NvbCA9PiB7XG4gICAgICAgIGxldCBuZXdXaWR0aFZhbHVlID0gKHRoaXMuY29sdW1uc1N0YXJ0V2lkdGhbb0NvbC5hdHRyXSArIHdpZHRoUmF0aW8pO1xuICAgICAgICBjb25zdCBtYXhXaWR0aCA9IG9Db2wuZ2V0TWF4V2lkdGhWYWx1ZSgpO1xuICAgICAgICBpZiAobWF4V2lkdGggJiYgbmV3V2lkdGhWYWx1ZSA+IG1heFdpZHRoKSB7XG4gICAgICAgICAgY29uc3QgZGlmZiA9IG5ld1dpZHRoVmFsdWUgLSBtYXhXaWR0aDtcbiAgICAgICAgICBuZXdXaWR0aFZhbHVlID0gbWF4V2lkdGg7XG4gICAgICAgICAgdGhpcy5ibG9ja2VkTWF4Q29scy5wdXNoKG9Db2wuYXR0cik7XG4gICAgICAgICAgY29uc3Qgbm90QmxvY2tlZCA9IHRoaXMubmV4dE9Db2x1bW5zLmxlbmd0aCAtIHRoaXMuYmxvY2tlZE1heENvbHMubGVuZ3RoO1xuICAgICAgICAgIHdpZHRoUmF0aW8gKz0gbm90QmxvY2tlZCA+IDAgPyBNYXRoLmZsb29yKGRpZmYgLyBub3RCbG9ja2VkKSA6IDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgRE9NV2lkdGggPSB0aGlzLnRhYmxlLmdldENsaWVudFdpZHRoQ29sdW1uKG9Db2wpO1xuICAgICAgICB3aWR0aERpZmZlcmVuY2UgKz0gbmV3V2lkdGhWYWx1ZSAtIERPTVdpZHRoO1xuICAgICAgICBvQ29sLnNldFdpZHRoKG5ld1dpZHRoVmFsdWUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IG5ld1dpZHRoID0gTWF0aC5taW4odGhpcy5zdGFydFdpZHRoIC0gd2lkdGhEaWZmZXJlbmNlLCBuZXdDb2x1bW5XaWR0aCk7XG4gICAgdGhpcy5jb2x1bW4uc2V0V2lkdGgobmV3V2lkdGgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGluaXRpYWxpemVXaWR0aERhdGEoKSB7XG4gICAgbGV0IG1heFdpZHRoID0gdGhpcy5jb2x1bW4uZ2V0TWF4V2lkdGhWYWx1ZSgpO1xuICAgIGxldCBuZXh0Q29sTWluV2lkdGhBY3VtID0gMDtcbiAgICBsZXQgbmV4dENvbFdpZHRoQWN1bSA9IDA7XG4gICAgdGhpcy5uZXh0T0NvbHVtbnMuZm9yRWFjaCgoY29sOiBPQ29sdW1uKSA9PiB7XG4gICAgICBuZXh0Q29sTWluV2lkdGhBY3VtICs9IGNvbC5nZXRNaW5XaWR0aFZhbHVlKCk7XG4gICAgICBjb25zdCBET01XaWR0aCA9IHRoaXMudGFibGUuZ2V0Q2xpZW50V2lkdGhDb2x1bW4oY29sKTtcbiAgICAgIG5leHRDb2xXaWR0aEFjdW0gKz0gRE9NV2lkdGg7XG4gICAgICB0aGlzLmNvbHVtbnNTdGFydFdpZHRoW2NvbC5hdHRyXSA9IERPTVdpZHRoO1xuICAgIH0pO1xuICAgIGNvbnN0IGNhbGNNYXhXaWR0aCA9IHRoaXMuaGVhZGVyRWwuY2xpZW50V2lkdGggKyAobmV4dENvbFdpZHRoQWN1bSAtIG5leHRDb2xNaW5XaWR0aEFjdW0pO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChtYXhXaWR0aCkpIHtcbiAgICAgIG1heFdpZHRoID0gTWF0aC5taW4obWF4V2lkdGgsIGNhbGNNYXhXaWR0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1heFdpZHRoID0gY2FsY01heFdpZHRoO1xuICAgIH1cbiAgICB0aGlzLm1heFdpZHRoID0gbWF4V2lkdGg7XG4gIH1cblxufVxuIl19