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
        this.startX = startEvent.screenX;
        this.startWidth = this.column.DOMWidth;
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
        var self = this;
        this.blockedMinCols = [];
        this.blockedMaxCols = [];
        var columns = tslib_1.__spread([this.column], this.nextOColumns);
        columns.forEach(function (oCol) {
            if (oCol.DOMWidth <= oCol.getMinWidthValue()) {
                self.blockedMinCols.push(oCol.attr);
            }
            var maxW = oCol.getMaxWidthValue();
            if (Util.isDefined(maxW) && oCol.DOMWidth >= maxW) {
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
                widthDifference += newWidthValue - oCol.DOMWidth;
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
            nextColWidthAcum += col.DOMWidth;
            _this.columnsStartWidth[col.attr] = col.DOMWidth;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jb2x1bW4tcmVzaXplci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9oZWFkZXIvdGFibGUtY29sdW1uLXJlc2l6ZXIvby10YWJsZS1jb2x1bW4tcmVzaXplci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixNQUFNLEVBR04sU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDM0UsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRWhELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUU3RCxNQUFNLENBQUMsSUFBTSxxQ0FBcUMsR0FBRztJQUNuRCxRQUFRO0NBQ1QsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLHNDQUFzQyxHQUFHLEVBR3JELENBQUM7QUFFRjtJQXNDRSxzQ0FDb0QsS0FBc0IsRUFDOUQsS0FBaUIsRUFDakIsTUFBYyxFQUNkLFFBQW1CO1FBSHFCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBQzlELFVBQUssR0FBTCxLQUFLLENBQVk7UUFDakIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQVc7UUF6Qi9CLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFjaEIsa0JBQWEsR0FBc0IsRUFBRSxDQUFDO1FBQ3RDLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUIsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFDcEIsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFFcEIsc0JBQWlCLEdBQUcsRUFB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QTVPWSw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPQ29sdW1uIH0gZnJvbSAnLi4vLi4vLi4vY29sdW1uL28tY29sdW1uLmNsYXNzJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL28tdGFibGUuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ09MVU1OX1JFU0laRVIgPSBbXG4gICdjb2x1bW4nXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ09MVU1OX1JFU0laRVIgPSBbXG4gIC8vICdyZXNpemluZycsXG4gIC8vICdyZXNpemVkJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1jb2x1bW4tcmVzaXplcicsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DT0xVTU5fUkVTSVpFUixcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ09MVU1OX1JFU0laRVIsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWNvbHVtbi1yZXNpemVyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS1jb2x1bW4tcmVzaXplci5jb21wb25lbnQuc2NzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby10YWJsZS1jb2x1bW4tcmVzaXplcl0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5kaXNhYmxlZF0nOiAnaXNEaXNhYmxlZCcsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlQ29sdW1uUmVzaXplckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBjb2x1bW46IE9Db2x1bW47XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLy8gcmVzaXppbmcgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIC8vIHJlc2l6ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcbiAgcHJvdGVjdGVkIHN0YXJ0V2lkdGg6IGFueTtcbiAgcHJvdGVjdGVkIG1pbldpZHRoOiBhbnk7XG4gIHByb3RlY3RlZCBtYXhXaWR0aDogYW55O1xuXG4gIHByb3RlY3RlZCBzdGFydFg6IGFueTtcblxuICBwcm90ZWN0ZWQgaGVhZGVyRWw6IGFueTtcblxuICBwcm90ZWN0ZWQgbmV4dE9Db2x1bW5zOiBPQ29sdW1uW107XG5cbiAgcHJvdGVjdGVkIGRyYWdMaXN0ZW5lcnM6IEFycmF5PCgpID0+IHZvaWQ+ID0gW107XG4gIHByb3RlY3RlZCBpc1Jlc2l6aW5nOiBib29sZWFuID0gZmFsc2U7XG4gIHByb3RlY3RlZCBibG9ja2VkTWluQ29scyA9IFtdO1xuICBwcm90ZWN0ZWQgYmxvY2tlZE1heENvbHMgPSBbXTtcblxuICBwcm90ZWN0ZWQgY29sdW1uc1N0YXJ0V2lkdGggPSB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT1RhYmxlQ29tcG9uZW50KSkgcHVibGljIHRhYmxlOiBPVGFibGVDb21wb25lbnQsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHsgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc0Rpc2FibGVkKSB7XG4gICAgICB0aGlzLmhlYWRlckVsID0gdGhpcy5nZXRIZWFkZXJFTCgpO1xuICAgICAgaWYgKHRoaXMuaGVhZGVyRWwpIHtcbiAgICAgICAgdGhpcy5uZXh0T0NvbHVtbnMgPSB0aGlzLmdldEZvbGxvd2luZ09Db2x1bW5zKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdG9wRHJhZ2dpbmcoKTtcbiAgfVxuXG4gIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgZ2V0IGlzRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1uICYmICF0aGlzLmNvbHVtbi5yZXNpemFibGU7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nLCBbJyRldmVudCddKVxuICBvbk1vdXNlZG93bihlOiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmlzRGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRSZXNpemUoZSk7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZXVwKCkge1xuICAgIHRoaXMuaXNSZXNpemluZyA9IGZhbHNlO1xuICAgIHRoaXMuc3RvcERyYWdnaW5nKCk7XG4gICAgLy8gdGhpcy5yZXNpemUuZW1pdCh0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0b3BEcmFnZ2luZygpIHtcbiAgICB0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcbiAgICB0aGlzLmNvbHVtbnNTdGFydFdpZHRoID0ge307XG4gICAgd2hpbGUgKHRoaXMuZHJhZ0xpc3RlbmVycy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmY3QgPSB0aGlzLmRyYWdMaXN0ZW5lcnMucG9wKCk7XG4gICAgICBpZiAoZmN0KSB7XG4gICAgICAgIGZjdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXJ0UmVzaXplKHN0YXJ0RXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBzdGFydEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgc3RhcnRFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMuaGVhZGVyRWwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3RhcnRYID0gc3RhcnRFdmVudC5zY3JlZW5YO1xuICAgIHRoaXMuc3RhcnRXaWR0aCA9IHRoaXMuY29sdW1uLkRPTVdpZHRoO1xuICAgIHRoaXMubWluV2lkdGggPSB0aGlzLmNvbHVtbi5nZXRNaW5XaWR0aFZhbHVlKCk7XG4gICAgdGhpcy5pbml0aWFsaXplV2lkdGhEYXRhKCk7XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5kcmFnTGlzdGVuZXJzLnB1c2godGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNldXAnLCAoZTogTW91c2VFdmVudCkgPT4gdGhpcy5zdG9wRHJhZ2dpbmcoKSkpO1xuICAgIH0pO1xuXG4gICAgaWYgKCEoc3RhcnRFdmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuZHJhZ0xpc3RlbmVycy5wdXNoKHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZW1vdmUnLCAoZTogTW91c2VFdmVudCkgPT4gdGhpcy5yZXNpemVFdmVudChlKSkpO1xuICAgIH0pO1xuICAgIHRoaXMuaXNSZXNpemluZyA9IHRydWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVzaXplRXZlbnQoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNSZXNpemluZyB8fCAhKGV2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbW92ZW1lbnRYID0gKGV2ZW50LnNjcmVlblggLSB0aGlzLnN0YXJ0WCk7XG4gICAgaWYgKG1vdmVtZW50WCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBuZXdDb2x1bW5XaWR0aCA9IHRoaXMuc3RhcnRXaWR0aCArIG1vdmVtZW50WDtcblxuICAgIGNvbnN0IGxlc3NUaGFuTWluID0gbmV3Q29sdW1uV2lkdGggPCB0aGlzLm1pbldpZHRoO1xuICAgIGNvbnN0IG1vcmVUaGFuTWF4ID0gbmV3Q29sdW1uV2lkdGggPiB0aGlzLm1heFdpZHRoO1xuICAgIGlmIChsZXNzVGhhbk1pbiB8fCBtb3JlVGhhbk1heCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMudGFibGUuaG9yaXpvbnRhbFNjcm9sbCkge1xuICAgICAgdGhpcy5jYWxjdWxhdGVOZXdDb2x1bW5zV2lkdGgobW92ZW1lbnRYLCBuZXdDb2x1bW5XaWR0aCk7XG4gICAgICB0aGlzLnVwZGF0ZUJsb2NrZWRDb2xzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29sdW1uLnNldFdpZHRoKG5ld0NvbHVtbldpZHRoKTtcbiAgICB9XG4gICAgdGhpcy50YWJsZS5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0SGVhZGVyRUwoKTogTm9kZSB7XG4gICAgbGV0IGVsZW1lbnQ7XG4gICAgbGV0IGN1cnJlbnRFbDogTm9kZSA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgIHdoaWxlICghZWxlbWVudCAmJiBjdXJyZW50RWwpIHtcbiAgICAgIGlmIChjdXJyZW50RWwubm9kZU5hbWUgPT09ICdUSCcpIHtcbiAgICAgICAgZWxlbWVudCA9IGN1cnJlbnRFbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnRFbCA9IGN1cnJlbnRFbC5wYXJlbnRFbGVtZW50O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY3VycmVudEVsO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldEZvbGxvd2luZ09Db2x1bW5zKCk6IE9Db2x1bW5bXSB7XG4gICAgY29uc3QgcmVzdWx0OiBPQ29sdW1uW10gPSBbXTtcbiAgICBsZXQgbmV4dFRoOiBhbnkgPSB0aGlzLmhlYWRlckVsLm5leHRTaWJsaW5nO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHdoaWxlIChuZXh0VGgpIHtcbiAgICAgIGNvbnN0IG9Db2w6IE9Db2x1bW4gPSBzZWxmLnRhYmxlLmdldE9Db2x1bW5Gcm9tVGgobmV4dFRoKTtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChvQ29sKSkge1xuICAgICAgICByZXN1bHQucHVzaChvQ29sKTtcbiAgICAgIH1cbiAgICAgIG5leHRUaCA9IG5leHRUaC5uZXh0U2libGluZztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVCbG9ja2VkQ29scygpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmJsb2NrZWRNaW5Db2xzID0gW107XG4gICAgdGhpcy5ibG9ja2VkTWF4Q29scyA9IFtdO1xuICAgIGNvbnN0IGNvbHVtbnMgPSBbdGhpcy5jb2x1bW4sIC4uLnRoaXMubmV4dE9Db2x1bW5zXTtcbiAgICBjb2x1bW5zLmZvckVhY2gob0NvbCA9PiB7XG4gICAgICBpZiAob0NvbC5ET01XaWR0aCA8PSBvQ29sLmdldE1pbldpZHRoVmFsdWUoKSkge1xuICAgICAgICBzZWxmLmJsb2NrZWRNaW5Db2xzLnB1c2gob0NvbC5hdHRyKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1heFcgPSBvQ29sLmdldE1heFdpZHRoVmFsdWUoKTtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChtYXhXKSAmJiBvQ29sLkRPTVdpZHRoID49IG1heFcpIHtcbiAgICAgICAgc2VsZi5ibG9ja2VkTWF4Q29scy5wdXNoKG9Db2wuYXR0cik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY2FsY3VsYXRlTmV3Q29sdW1uc1dpZHRoKG1vdmVtZW50WDogbnVtYmVyLCBuZXdDb2x1bW5XaWR0aDogbnVtYmVyKSB7XG4gICAgY29uc3QgcG9zaXRpdmUgPSAobW92ZW1lbnRYID4gMCk7XG4gICAgaWYgKHBvc2l0aXZlKSB7XG4gICAgICB0aGlzLmNhbGN1bGF0ZVVzaW5nTmV4dENvbHVtbnNSZXN0cmljdGlvbnMobW92ZW1lbnRYLCBuZXdDb2x1bW5XaWR0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FsY3VsYXRlVXNpbmdPd25Db2x1bW5SZXN0cmljdGlvbihtb3ZlbWVudFgsIG5ld0NvbHVtbldpZHRoKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgY2FsY3VsYXRlVXNpbmdOZXh0Q29sdW1uc1Jlc3RyaWN0aW9ucyhtb3ZlbWVudFg6IG51bWJlciwgbmV3Q29sdW1uV2lkdGg6IG51bWJlcikge1xuICAgIGNvbnN0IGF2YWlsYWJsZUNvbHMgPSB0aGlzLm5leHRPQ29sdW1ucy5sZW5ndGggLSB0aGlzLmJsb2NrZWRNaW5Db2xzLmxlbmd0aDtcbiAgICBpZiAoYXZhaWxhYmxlQ29scyA8PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHdpZHRoUmF0aW8gPSBtb3ZlbWVudFggLyBhdmFpbGFibGVDb2xzO1xuICAgIGNvbnN0IGNvbHMgPSB0aGlzLm5leHRPQ29sdW1ucy5maWx0ZXIoKG9Db2w6IE9Db2x1bW4pID0+IHRoaXMuYmxvY2tlZE1pbkNvbHMuaW5kZXhPZihvQ29sLmF0dHIpID09PSAtMSk7XG4gICAgY29scy5mb3JFYWNoKG9Db2wgPT4ge1xuICAgICAgbGV0IG5ld1dpZHRoID0gKHRoaXMuY29sdW1uc1N0YXJ0V2lkdGhbb0NvbC5hdHRyXSAtIHdpZHRoUmF0aW8pO1xuICAgICAgY29uc3QgbWluV2lkdGggPSBvQ29sLmdldE1pbldpZHRoVmFsdWUoKTtcbiAgICAgIGlmIChuZXdXaWR0aCA8PSBtaW5XaWR0aCkge1xuICAgICAgICBuZXdXaWR0aCA9IG1pbldpZHRoO1xuICAgICAgICB0aGlzLmJsb2NrZWRNaW5Db2xzLnB1c2gob0NvbC5hdHRyKTtcbiAgICAgIH1cbiAgICAgIG9Db2wuc2V0V2lkdGgobmV3V2lkdGgpO1xuICAgIH0pO1xuICAgIHRoaXMuY29sdW1uLnNldFdpZHRoKG5ld0NvbHVtbldpZHRoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjYWxjdWxhdGVVc2luZ093bkNvbHVtblJlc3RyaWN0aW9uKG1vdmVtZW50WDogbnVtYmVyLCBuZXdDb2x1bW5XaWR0aDogbnVtYmVyKSB7XG4gICAgbGV0IHdpZHRoUmF0aW8gPSBNYXRoLmFicyhtb3ZlbWVudFgpIC8gdGhpcy5uZXh0T0NvbHVtbnMubGVuZ3RoO1xuICAgIGxldCB3aWR0aERpZmZlcmVuY2UgPSAwO1xuICAgIGlmICh3aWR0aFJhdGlvID4gMCAmJiB0aGlzLmJsb2NrZWRNYXhDb2xzLmxlbmd0aCA8IHRoaXMubmV4dE9Db2x1bW5zLmxlbmd0aCkge1xuICAgICAgY29uc3QgY29scyA9IHRoaXMubmV4dE9Db2x1bW5zLmZpbHRlcigob0NvbDogT0NvbHVtbikgPT4gdGhpcy5ibG9ja2VkTWF4Q29scy5pbmRleE9mKG9Db2wuYXR0cikgPT09IC0xKTtcbiAgICAgIGNvbHMuZm9yRWFjaChvQ29sID0+IHtcbiAgICAgICAgbGV0IG5ld1dpZHRoVmFsdWUgPSAodGhpcy5jb2x1bW5zU3RhcnRXaWR0aFtvQ29sLmF0dHJdICsgd2lkdGhSYXRpbyk7XG4gICAgICAgIGNvbnN0IG1heFdpZHRoID0gb0NvbC5nZXRNYXhXaWR0aFZhbHVlKCk7XG4gICAgICAgIGlmIChtYXhXaWR0aCAmJiBuZXdXaWR0aFZhbHVlID4gbWF4V2lkdGgpIHtcbiAgICAgICAgICBjb25zdCBkaWZmID0gbmV3V2lkdGhWYWx1ZSAtIG1heFdpZHRoO1xuICAgICAgICAgIG5ld1dpZHRoVmFsdWUgPSBtYXhXaWR0aDtcbiAgICAgICAgICB0aGlzLmJsb2NrZWRNYXhDb2xzLnB1c2gob0NvbC5hdHRyKTtcbiAgICAgICAgICBjb25zdCBub3RCbG9ja2VkID0gdGhpcy5uZXh0T0NvbHVtbnMubGVuZ3RoIC0gdGhpcy5ibG9ja2VkTWF4Q29scy5sZW5ndGg7XG4gICAgICAgICAgd2lkdGhSYXRpbyArPSBub3RCbG9ja2VkID4gMCA/IE1hdGguZmxvb3IoZGlmZiAvIG5vdEJsb2NrZWQpIDogMDtcbiAgICAgICAgfVxuICAgICAgICB3aWR0aERpZmZlcmVuY2UgKz0gbmV3V2lkdGhWYWx1ZSAtIG9Db2wuRE9NV2lkdGg7XG4gICAgICAgIG9Db2wuc2V0V2lkdGgobmV3V2lkdGhWYWx1ZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgbmV3V2lkdGggPSBNYXRoLm1pbih0aGlzLnN0YXJ0V2lkdGggLSB3aWR0aERpZmZlcmVuY2UsIG5ld0NvbHVtbldpZHRoKTtcbiAgICB0aGlzLmNvbHVtbi5zZXRXaWR0aChuZXdXaWR0aCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZVdpZHRoRGF0YSgpIHtcbiAgICBsZXQgbWF4V2lkdGggPSB0aGlzLmNvbHVtbi5nZXRNYXhXaWR0aFZhbHVlKCk7XG4gICAgbGV0IG5leHRDb2xNaW5XaWR0aEFjdW0gPSAwO1xuICAgIGxldCBuZXh0Q29sV2lkdGhBY3VtID0gMDtcbiAgICB0aGlzLm5leHRPQ29sdW1ucy5mb3JFYWNoKChjb2w6IE9Db2x1bW4pID0+IHtcbiAgICAgIG5leHRDb2xNaW5XaWR0aEFjdW0gKz0gY29sLmdldE1pbldpZHRoVmFsdWUoKTtcbiAgICAgIG5leHRDb2xXaWR0aEFjdW0gKz0gY29sLkRPTVdpZHRoO1xuICAgICAgdGhpcy5jb2x1bW5zU3RhcnRXaWR0aFtjb2wuYXR0cl0gPSBjb2wuRE9NV2lkdGg7XG4gICAgfSk7XG4gICAgY29uc3QgY2FsY01heFdpZHRoID0gdGhpcy5oZWFkZXJFbC5jbGllbnRXaWR0aCArIChuZXh0Q29sV2lkdGhBY3VtIC0gbmV4dENvbE1pbldpZHRoQWN1bSk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKG1heFdpZHRoKSkge1xuICAgICAgbWF4V2lkdGggPSBNYXRoLm1pbihtYXhXaWR0aCwgY2FsY01heFdpZHRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWF4V2lkdGggPSBjYWxjTWF4V2lkdGg7XG4gICAgfVxuICAgIHRoaXMubWF4V2lkdGggPSBtYXhXaWR0aDtcbiAgfVxufVxuIl19