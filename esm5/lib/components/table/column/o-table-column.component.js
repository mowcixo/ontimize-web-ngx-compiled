import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, EventEmitter, forwardRef, Inject, Injector, ViewChild, ViewContainerRef, } from '@angular/core';
import { Subscription } from 'rxjs';
import { InputConverter } from '../../../decorators/input-converter';
import { Codes } from '../../../util/codes';
import { SQLTypes } from '../../../util/sqltypes';
import { Util } from '../../../util/util';
import { OTableComponent } from '../o-table.component';
import { editorsMapping, O_TABLE_CELL_EDITORS_INPUTS, O_TABLE_CELL_EDITORS_OUTPUTS } from './cell-editor/cell-editor';
import { O_TABLE_CELL_RENDERERS_INPUTS, O_TABLE_CELL_RENDERERS_OUTPUTS, renderersMapping, } from './cell-renderer/cell-renderer';
export var DEFAULT_INPUTS_O_TABLE_COLUMN = tslib_1.__spread([
    'attr',
    'title',
    'titleAlign: title-align',
    'contentAlign: content-align',
    'orderable',
    'searchable',
    'type',
    'editable',
    'width',
    'minWidth: min-width',
    'maxWidth: max-width',
    'asyncLoad : async-load',
    'sqlType: sql-type',
    'tooltip',
    'tooltipValue: tooltip-value',
    'tooltipFunction: tooltip-function',
    'multiline',
    'resizable',
    'filterExpressionFunction: filter-expression-function',
    'class'
], O_TABLE_CELL_RENDERERS_INPUTS, O_TABLE_CELL_EDITORS_INPUTS);
export var DEFAULT_OUTPUTS_O_TABLE_COLUMN = tslib_1.__spread(O_TABLE_CELL_RENDERERS_OUTPUTS, O_TABLE_CELL_EDITORS_OUTPUTS);
var OTableColumnComponent = (function () {
    function OTableColumnComponent(table, resolver, injector) {
        this.table = table;
        this.resolver = resolver;
        this.injector = injector;
        this._defaultSQLTypeKey = 'OTHER';
        this._searchable = true;
        this.editable = false;
        this.tooltip = false;
        this._multiline = false;
        this._filterSource = 'render';
        this.grouping = true;
        this.thousandSeparator = ',';
        this.decimalSeparator = '.';
        this.renderType = 'string';
        this.booleanType = 'boolean';
        this.queryMethod = Codes.QUERY_METHOD;
        this.oDateFormat = 'L';
        this.oHourFormat = 24;
        this.valueBase = 1;
        this.orequired = false;
        this.showPlaceHolder = false;
        this.updateRecordOnEdit = true;
        this.showNotificationOnEdit = false;
        this.oStartView = 'month';
        this.oTouchUi = false;
        this.dateValueType = 'timestamp';
        this.minDecimalDigits = 2;
        this.maxDecimalDigits = 2;
        this.indeterminateOnNull = false;
        this.onClick = new EventEmitter();
        this.editionStarted = new EventEmitter();
        this.editionCancelled = new EventEmitter();
        this.editionCommitted = new EventEmitter();
        this.onPostUpdateRecord = new EventEmitter();
        this.asyncLoad = false;
        this.subscriptions = new Subscription();
    }
    Object.defineProperty(OTableColumnComponent.prototype, "multiline", {
        get: function () {
            return this._multiline;
        },
        set: function (val) {
            val = Util.parseBoolean(String(val));
            this._multiline = val;
        },
        enumerable: true,
        configurable: true
    });
    OTableColumnComponent.addEditor = function (type, editorClassReference) {
        if (!editorsMapping.hasOwnProperty(type) && Util.isDefined(editorClassReference)) {
            editorsMapping[type] = editorClassReference;
        }
    };
    OTableColumnComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.grouping = Util.parseBoolean(this.grouping, true);
        this.titleAlign = this.parseTitleAlign();
        this.table.registerColumn(this);
        this.subscriptions.add(this.table.onReinitialize.subscribe(function () { return _this.table.registerColumn(_this); }));
    };
    OTableColumnComponent.prototype.ngAfterViewInit = function () {
        this.createRenderer();
        this.createEditor();
    };
    OTableColumnComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.unsubscribe();
    };
    OTableColumnComponent.prototype.parseTitleAlign = function () {
        var align = (this.titleAlign || '').toLowerCase();
        return Codes.AVAILABLE_COLUMN_TITLE_ALIGNS.indexOf(align) !== -1 ? align : undefined;
    };
    Object.defineProperty(OTableColumnComponent.prototype, "originalWidth", {
        get: function () {
            var originalWidth = this.width;
            var pxVal = Util.extractPixelsValue(this.width);
            if (Util.isDefined(pxVal)) {
                originalWidth = pxVal + '';
            }
            return originalWidth;
        },
        enumerable: true,
        configurable: true
    });
    OTableColumnComponent.prototype.createRenderer = function () {
        if (!Util.isDefined(this.renderer) && Util.isDefined(this.type)) {
            var componentRef = renderersMapping[this.type];
            if (componentRef !== undefined) {
                var factory = this.resolver.resolveComponentFactory(componentRef);
                if (factory) {
                    var ref = this.container.createComponent(factory);
                    var newRenderer = ref.instance;
                    newRenderer.filterSource = this.filterSource;
                    newRenderer.filterFunction = this.filterFunction;
                    switch (this.type) {
                        case 'currency':
                            newRenderer.currencySymbol = this.currencySymbol;
                            newRenderer.currencySymbolPosition = this.currencySymbolPosition;
                            newRenderer.decimalSeparator = this.decimalSeparator;
                            newRenderer.minDecimalDigits = this.minDecimalDigits;
                            newRenderer.maxDecimalDigits = this.maxDecimalDigits;
                            newRenderer.grouping = this.grouping;
                            newRenderer.thousandSeparator = this.thousandSeparator;
                            break;
                        case 'date':
                            newRenderer.format = this.format;
                            break;
                        case 'time':
                            newRenderer.format = this.format;
                            break;
                        case 'integer':
                            newRenderer.grouping = this.grouping;
                            newRenderer.thousandSeparator = this.thousandSeparator;
                            break;
                        case 'boolean':
                            newRenderer.trueValue = this.trueValue;
                            newRenderer.falseValue = this.falseValue;
                            newRenderer.renderTrueValue = this.renderTrueValue;
                            newRenderer.renderFalseValue = this.renderFalseValue;
                            newRenderer.renderType = this.renderType;
                            newRenderer.booleanType = this.booleanType;
                            break;
                        case 'percentage':
                            newRenderer.valueBase = this.valueBase;
                        case 'real':
                            newRenderer.decimalSeparator = this.decimalSeparator;
                            newRenderer.minDecimalDigits = this.minDecimalDigits;
                            newRenderer.maxDecimalDigits = this.maxDecimalDigits;
                            newRenderer.grouping = this.grouping;
                            newRenderer.thousandSeparator = this.thousandSeparator;
                            break;
                        case 'image':
                            newRenderer.imageType = this.imageType;
                            newRenderer.avatar = this.avatar;
                            newRenderer.emptyImage = this.emptyImage;
                            break;
                        case 'action':
                            newRenderer.icon = this.icon;
                            newRenderer.action = this.action;
                            newRenderer.text = this.text;
                            newRenderer.iconPosition = this.iconPosition;
                            newRenderer.onClick = this.onClick;
                            break;
                        case 'service':
                            newRenderer.entity = this.entity;
                            newRenderer.service = this.service;
                            newRenderer.columns = this.columns;
                            newRenderer.valueColumn = this.valueColumn;
                            newRenderer.parentKeys = this.parentKeys;
                            newRenderer.queryMethod = this.queryMethod;
                            newRenderer.serviceType = this.serviceType;
                            break;
                        case 'translate':
                            newRenderer.translateArgsFn = this.translateArgsFn;
                            break;
                    }
                    this.registerRenderer(newRenderer);
                }
            }
        }
    };
    OTableColumnComponent.prototype.buildCellEditor = function (type, resolver, container, propsOrigin) {
        var editor;
        var componentRef = editorsMapping[type] || editorsMapping.text;
        if (componentRef === undefined) {
            return editor;
        }
        var factory = resolver.resolveComponentFactory(componentRef);
        if (factory) {
            var ref = container.createComponent(factory);
            editor = ref.instance;
            if (propsOrigin !== undefined) {
                switch (type) {
                    case 'date':
                        editor.format = propsOrigin.format;
                        editor.locale = propsOrigin.locale;
                        editor.oStartView = propsOrigin.oStartView;
                        editor.oMinDate = propsOrigin.oMinDate;
                        editor.oMaxDate = propsOrigin.oMaxDate;
                        editor.oTouchUi = propsOrigin.oTouchUi;
                        editor.oStartAt = propsOrigin.oStartAt;
                        editor.filterDate = propsOrigin.filterDate;
                        editor.dateValueType = propsOrigin.dateValueType;
                        break;
                    case 'time':
                        editor.oDateFormat = propsOrigin.oDateFormat;
                        editor.oHourFormat = propsOrigin.oHourFormat;
                        editor.oDateLocale = propsOrigin.oDateLocale;
                        editor.oMinDate = propsOrigin.oMinDate;
                        editor.oMaxDate = propsOrigin.oMaxDate;
                        editor.oTouchUi = propsOrigin.oTouchUi;
                        editor.oDateStartAt = propsOrigin.oDateStartAt;
                        editor.oDateTextInputEnabled = propsOrigin.oDateTextInputEnabled;
                        editor.oHourMin = propsOrigin.oHourMin;
                        editor.oHourMax = propsOrigin.oHourMax;
                        editor.oHourTextInputEnabled = propsOrigin.oHourTextInputEnabled;
                        editor.oHourPlaceholder = propsOrigin.oHourPlaceholder;
                        editor.oDatePlaceholder = propsOrigin.oDatePlaceholder;
                        break;
                    case 'boolean':
                        editor.booleanType = propsOrigin.booleanType;
                        editor.indeterminateOnNull = propsOrigin.indeterminateOnNull;
                        editor.autoCommit = propsOrigin.autoCommit;
                        editor.trueValue = propsOrigin.trueValue;
                        editor.falseValue = propsOrigin.falseValue;
                        break;
                    case 'integer':
                    case 'percentage':
                    case 'currency':
                    case 'real':
                        editor.min = propsOrigin.min;
                        editor.max = propsOrigin.max;
                        editor.step = Util.isDefined(propsOrigin.step) ? propsOrigin.step : editor.step;
                        break;
                    case 'image':
                        break;
                    default:
                        break;
                }
                editor.olabel = propsOrigin.olabel;
                editor.type = propsOrigin.type;
            }
        }
        return editor;
    };
    OTableColumnComponent.prototype.createEditor = function () {
        if (!Util.isDefined(this.editor) && this.editable) {
            var newEditor = this.buildCellEditor(this.type, this.resolver, this.container, this);
            if (newEditor) {
                newEditor.orequired = this.orequired;
                newEditor.showPlaceHolder = this.showPlaceHolder;
                newEditor.updateRecordOnEdit = this.updateRecordOnEdit;
                newEditor.showNotificationOnEdit = this.showNotificationOnEdit;
                newEditor.editionStarted = this.editionStarted;
                newEditor.editionCancelled = this.editionCancelled;
                newEditor.editionCommitted = this.editionCommitted;
                newEditor.onPostUpdateRecord = this.onPostUpdateRecord;
                this.registerEditor(newEditor);
            }
        }
    };
    OTableColumnComponent.prototype.registerRenderer = function (renderer) {
        this.renderer = renderer;
        var oCol = this.table.getOColumn(this.attr);
        if (oCol !== undefined) {
            oCol.renderer = this.renderer;
        }
        this.renderer.initialize();
    };
    OTableColumnComponent.prototype.registerEditor = function (editor) {
        this.editor = editor;
        var oCol = this.table.getOColumn(this.attr);
        if (oCol !== undefined) {
            oCol.editor = this.editor;
        }
        this.editor.initialize();
    };
    Object.defineProperty(OTableColumnComponent.prototype, "orderable", {
        get: function () {
            return this._orderable;
        },
        set: function (val) {
            this._orderable = typeof val === 'boolean' ? val : Util.parseBoolean(val, true);
            var oCol = this.table.getOColumn(this.attr);
            if (oCol) {
                oCol.orderable = this._orderable;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableColumnComponent.prototype, "resizable", {
        get: function () {
            return this._resizable;
        },
        set: function (val) {
            this._resizable = typeof val === 'boolean' ? val : Util.parseBoolean(val, true);
            var oCol = this.table.getOColumn(this.attr);
            if (oCol) {
                oCol.resizable = this._resizable;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableColumnComponent.prototype, "searchable", {
        get: function () {
            return this._searchable;
        },
        set: function (val) {
            this._searchable = typeof val === 'boolean' ? val : Util.parseBoolean(val, true);
            var oCol = this.table.getOColumn(this.attr);
            if (oCol) {
                oCol.searchable = this._searchable;
            }
        },
        enumerable: true,
        configurable: true
    });
    OTableColumnComponent.prototype.getSQLType = function () {
        if (!(this.sqlType && this.sqlType.length > 0)) {
            switch (this.type) {
                case 'date':
                    this.sqlType = 'TIMESTAMP';
                    break;
                case 'integer':
                    this.sqlType = 'INTEGER';
                    break;
                case 'boolean':
                    this.sqlType = 'BOOLEAN';
                    break;
                case 'real':
                case 'percentage':
                case 'currency':
                    this.sqlType = 'DOUBLE';
                    break;
            }
        }
        var sqlt = this.sqlType && this.sqlType.length > 0 ? this.sqlType : this._defaultSQLTypeKey;
        this._SQLType = SQLTypes.getSQLTypeValue(sqlt);
        return this._SQLType;
    };
    Object.defineProperty(OTableColumnComponent.prototype, "filterSource", {
        get: function () {
            return this._filterSource;
        },
        set: function (val) {
            var lowerVal = (val || '').toLowerCase();
            this._filterSource = (lowerVal === 'render' || lowerVal === 'data' || lowerVal === 'both') ? lowerVal : 'render';
        },
        enumerable: true,
        configurable: true
    });
    OTableColumnComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-column',
                    template: "<span #container>\n</span>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_COLUMN,
                    outputs: DEFAULT_OUTPUTS_O_TABLE_COLUMN,
                    styles: [""]
                }] }
    ];
    OTableColumnComponent.ctorParameters = function () { return [
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] },
        { type: ComponentFactoryResolver },
        { type: Injector }
    ]; };
    OTableColumnComponent.propDecorators = {
        container: [{ type: ViewChild, args: ['container', { read: ViewContainerRef, static: true },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableColumnComponent.prototype, "editable", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableColumnComponent.prototype, "tooltip", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableColumnComponent.prototype, "orequired", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableColumnComponent.prototype, "showPlaceHolder", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableColumnComponent.prototype, "updateRecordOnEdit", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableColumnComponent.prototype, "showNotificationOnEdit", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableColumnComponent.prototype, "oTouchUi", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OTableColumnComponent.prototype, "min", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OTableColumnComponent.prototype, "max", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OTableColumnComponent.prototype, "step", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OTableColumnComponent.prototype, "minDecimalDigits", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OTableColumnComponent.prototype, "maxDecimalDigits", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableColumnComponent.prototype, "indeterminateOnNull", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableColumnComponent.prototype, "autoCommit", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableColumnComponent.prototype, "asyncLoad", void 0);
    return OTableColumnComponent;
}());
export { OTableColumnComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jb2x1bW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9vLXRhYmxlLWNvbHVtbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULHdCQUF3QixFQUN4QixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBR1IsU0FBUyxFQUNULGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXBDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUtyRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2xELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGNBQWMsRUFBRSwyQkFBMkIsRUFBRSw0QkFBNEIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3RILE9BQU8sRUFDTCw2QkFBNkIsRUFDN0IsOEJBQThCLEVBQzlCLGdCQUFnQixHQUNqQixNQUFNLCtCQUErQixDQUFDO0FBR3ZDLE1BQU0sQ0FBQyxJQUFNLDZCQUE2QjtJQUd4QyxNQUFNO0lBR04sT0FBTztJQUdQLHlCQUF5QjtJQUd6Qiw2QkFBNkI7SUFHN0IsV0FBVztJQUdYLFlBQVk7SUFHWixNQUFNO0lBR04sVUFBVTtJQUVWLE9BQU87SUFHUCxxQkFBcUI7SUFHckIscUJBQXFCO0lBR3JCLHdCQUF3QjtJQUd4QixtQkFBbUI7SUFFbkIsU0FBUztJQUVULDZC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QUFFOzttRUFDWTtJQUk3QjtRQURDLGNBQWMsRUFBRTs7c0VBQ29CO0lBRXJDO1FBREMsY0FBYyxFQUFFOzs2REFDRztJQVlwQjtRQURDLGNBQWMsRUFBRTs7NERBQ1U7SUE0UzdCLDRCQUFDO0NBQUEsQUFoY0QsSUFnY0M7U0F4YlkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50RmFjdG9yeSxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgT1RhYmxlQ29sdW1uIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLWNvbHVtbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRGF0ZUZpbHRlckZ1bmN0aW9uIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZGF0ZS1maWx0ZXItZnVuY3Rpb24udHlwZSc7XG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZXhwcmVzc2lvbi50eXBlJztcbmltcG9ydCB7IE9EYXRlVmFsdWVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvby1kYXRlLXZhbHVlLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFNRTFR5cGVzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9zcWx0eXBlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uL28tdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IGVkaXRvcnNNYXBwaW5nLCBPX1RBQkxFX0NFTExfRURJVE9SU19JTlBVVFMsIE9fVEFCTEVfQ0VMTF9FRElUT1JTX09VVFBVVFMgfSBmcm9tICcuL2NlbGwtZWRpdG9yL2NlbGwtZWRpdG9yJztcbmltcG9ydCB7XG4gIE9fVEFCTEVfQ0VMTF9SRU5ERVJFUlNfSU5QVVRTLFxuICBPX1RBQkxFX0NFTExfUkVOREVSRVJTX09VVFBVVFMsXG4gIHJlbmRlcmVyc01hcHBpbmcsXG59IGZyb20gJy4vY2VsbC1yZW5kZXJlci9jZWxsLXJlbmRlcmVyJztcbmltcG9ydCB7IE9QZXJjZW50YWdlVmFsdWVCYXNlVHlwZSB9IGZyb20gJy4uLy4uLy4uL3BpcGVzL28tcGVyY2VudGFnZS5waXBlJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ09MVU1OID0gW1xuXG4gIC8vIGF0dHIgW3N0cmluZ106IGNvbHVtbiBuYW1lLlxuICAnYXR0cicsXG5cbiAgLy8gdGl0bGUgW3N0cmluZ106IGNvbHVtbiB0aXRsZS4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICd0aXRsZScsXG5cbiAgLy8gdGl0bGUtYWxpZ24gW3N0YXJ0IHwgY2VudGVyIHwgZW5kXTogY29sdW1uIHRpdGxlIGFsaWdubWVudC4gRGVmYXVsdDogY2VudGVyLlxuICAndGl0bGVBbGlnbjogdGl0bGUtYWxpZ24nLFxuXG4gIC8vIGNvbnRlbnQtYWxpZ24gW3N0YXJ0IHwgY2VudGVyIHwgZW5kXTogY29sdW1uIGNvbnRlbnQgYWxpZ25tZW50LlxuICAnY29udGVudEFsaWduOiBjb250ZW50LWFsaWduJyxcblxuICAvLyBvcmRlcmFibGUgW25vfHllc106IGNvbHVtbiBjYW4gYmUgc29ydGVkLiBEZWZhdWx0OiB5ZXMuXG4gICdvcmRlcmFibGUnLFxuXG4gIC8vIHNlYXJjaGFibGUgW25vfHllc106IHNlYXJjaGluZ3MgYXJlIHBlcmZvcm1lZCBpbnRvIGNvbHVtbiBjb250ZW50LiBEZWZhdWx0OiB5ZXMuXG4gICdzZWFyY2hhYmxlJyxcblxuICAvLyB0eXBlIFtib29sZWFufGludGVnZXJ8cmVhbHxjdXJyZW5jeXxkYXRlfGltYWdlXTogY29sdW1uIHR5cGUuIERlZmF1bHQ6IG5vIHZhbHVlIChzdHJpbmcpLlxuICAndHlwZScsXG5cbiAgLy8gZWRpdGFibGUgW25vfHllc106IGNvbHVtbiBjYW4gYmUgZWRpdGVkIGRpcmVjdGx5IG92ZXIgdGhlIHRhYmxlLiBEZWZhdWx0OiBuby5cbiAgJ2VkaXRhYmxlJyxcblxuICAnd2lkdGgnLFxuXG4gIC8vIG9ubHkgaW4gcGl4ZWxzXG4gICdtaW5XaWR0aDogbWluLXdpZHRoJyxcblxuICAvLyBvbmx5IGluIHBpeGVsc1xuICAnbWF4V2lkdGg6IG1heC13aWR0aCcsXG5cbiAgLy8gYXN5bmMtbG9hZCBbbm98eWVzfHRydWV8ZmFsc2VdOiBhc3luY2hyb25vdXMgcXVlcnkuIERlZmF1bHQ6IG5vXG4gICdhc3luY0xvYWQgOiBhc3luYy1sb2FkJyxcblxuICAvLyBzcWx0eXBlW3N0cmluZ106IERhdGEgdHlwZSBhY2NvcmRpbmcgdG8gSmF2YSBzdGFuZGFyZC4gU2VlIFNRTFR5cGUgY2xhc3MuIERlZmF1bHQ6ICdPVEhFUidcbiAgJ3NxbFR5cGU6IHNxbC10eXBlJyxcblxuICAndG9vbHRpcCcsXG5cbiAgJ3Rvb2x0aXBWYWx1ZTogdG9vbHRpcC12YWx1ZScsXG5cbiAgJ3Rvb2x0aXBGdW5jdGlvbjogdG9vbHRpcC1mdW5jdGlvbicsXG5cbiAgJ211bHRpbGluZScsXG5cbiAgJ3Jlc2l6YWJsZScsXG5cbiAgJ2ZpbHRlckV4cHJlc3Npb25GdW5jdGlvbjogZmlsdGVyLWV4cHJlc3Npb24tZnVuY3Rpb24nLFxuXG4gICdjbGFzcycsXG5cbiAgLi4uT19UQUJMRV9DRUxMX1JFTkRFUkVSU19JTlBVVFMsXG4gIC4uLk9fVEFCTEVfQ0VMTF9FRElUT1JTX0lOUFVUU1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NPTFVNTiA9IFtcbiAgLi4uT19UQUJMRV9DRUxMX1JFTkRFUkVSU19PVVRQVVRTLFxuICAuLi5PX1RBQkxFX0NFTExfRURJVE9SU19PVVRQVVRTXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWNvbHVtbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWNvbHVtbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tdGFibGUtY29sdW1uLmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ09MVU1OLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9DT0xVTU5cbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlQ29sdW1uQ29tcG9uZW50IGltcGxlbWVudHMgT1RhYmxlQ29sdW1uLCBPbkRlc3Ryb3ksIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgcHVibGljIHJlbmRlcmVyOiBhbnk7XG4gIHB1YmxpYyBlZGl0b3I6IGFueTtcblxuICBwdWJsaWMgdHlwZTogc3RyaW5nO1xuICBwdWJsaWMgYXR0cjogc3RyaW5nO1xuICBwdWJsaWMgdGl0bGU6IHN0cmluZztcbiAgcHVibGljIHRpdGxlQWxpZ246IHN0cmluZztcbiAgcHVibGljIGNvbnRlbnRBbGlnbjogJ3N0YXJ0JyB8ICdjZW50ZXInIHwgJ2VuZCc7XG4gIHB1YmxpYyBzcWxUeXBlOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfU1FMVHlwZTogbnVtYmVyO1xuICBwcm90ZWN0ZWQgX2RlZmF1bHRTUUxUeXBlS2V5OiBzdHJpbmcgPSAnT1RIRVInO1xuICBwcm90ZWN0ZWQgX29yZGVyYWJsZTogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIF9yZXNpemFibGU6IGJvb2xlYW47XG4gIHByb3RlY3RlZCBfc2VhcmNoYWJsZTogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBlZGl0YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgd2lkdGg6IHN0cmluZztcbiAgcHVibGljIG1pbldpZHRoOiBzdHJpbmc7XG4gIHB1YmxpYyBtYXhXaWR0aDogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgdG9vbHRpcDogYm9vbGVhbiA9IGZhbHNlO1xuICB0b29sdGlwVmFsdWU6IHN0cmluZztcbiAgdG9vbHRpcEZ1bmN0aW9uOiAocm93RGF0YTogYW55KSA9PiBhbnk7XG4gIHB1YmxpYyBjbGFzczogc3RyaW5nO1xuXG4gIHNldCBtdWx0aWxpbmUodmFsOiBib29sZWFuKSB7XG4gICAgdmFsID0gVXRpbC5wYXJzZUJvb2xlYW4oU3RyaW5nKHZhbCkpO1xuICAgIHRoaXMuX211bHRpbGluZSA9IHZhbDtcbiAgfVxuICBnZXQgbXVsdGlsaW5lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9tdWx0aWxpbmU7XG4gIH1cbiAgcHJvdGVjdGVkIF9tdWx0aWxpbmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBmaWx0ZXJFeHByZXNzaW9uRnVuY3Rpb246IChjb2x1bW5BdHRyOiBzdHJpbmcsIHF1aWNrRmlsdGVyPzogc3RyaW5nKSA9PiBFeHByZXNzaW9uO1xuXG4gIC8qIGlucHV0IHJlbmRlcmVyIGJhc2UgKi9cbiAgcHVibGljIF9maWx0ZXJTb3VyY2U6ICdyZW5kZXInIHwgJ2RhdGEnIHwgJ2JvdGgnID0gJ3JlbmRlcic7XG4gIHB1YmxpYyBmaWx0ZXJGdW5jdGlvbjogKGNlbGxWYWx1ZTogYW55LCByb3dWYWx1ZTogYW55LCBxdWlja0ZpbHRlcj86IHN0cmluZykgPT4gYm9vbGVhbjtcbiAgLyogaW5wdXQgcmVuZGVyZXIgZGF0ZSAqL1xuICBwcm90ZWN0ZWQgZm9ybWF0OiBzdHJpbmc7XG4gIC8qIGlucHV0IHJlbmRlcmVyIGludGVnZXIgKi9cbiAgcHJvdGVjdGVkIGdyb3VwaW5nOiBhbnkgPSB0cnVlO1xuICBwcm90ZWN0ZWQgdGhvdXNhbmRTZXBhcmF0b3I6IHN0cmluZyA9ICcsJztcbiAgLyogaW5wdXQgcmVuZGVyZXIgcmVhbCAqL1xuICBwcm90ZWN0ZWQgZGVjaW1hbFNlcGFyYXRvcjogc3RyaW5nID0gJy4nO1xuXG4gIC8qIGlucHV0IHJlbmRlcmVyIGN1cnJlbmN5ICovXG4gIHByb3RlY3RlZCBjdXJyZW5jeVN5bWJvbDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgY3VycmVuY3lTeW1ib2xQb3NpdGlvbjogc3RyaW5nO1xuXG4gIC8qIGlucHV0IHJlbmRlcmVyIGJvb2xlYW4gKi9cbiAgcHJvdGVjdGVkIHRydWVWYWx1ZTogYW55O1xuICBwcm90ZWN0ZWQgZmFsc2VWYWx1ZTogYW55O1xuICBwcm90ZWN0ZWQgcmVuZGVyVHJ1ZVZhbHVlOiBhbnk7XG4gIHByb3RlY3RlZCByZW5kZXJGYWxzZVZhbHVlOiBhbnk7XG4gIHByb3RlY3RlZCByZW5kZXJUeXBlOiBzdHJpbmcgPSAnc3RyaW5nJztcbiAgcHJvdGVjdGVkIGJvb2xlYW5UeXBlOiBzdHJpbmcgPSAnYm9vbGVhbic7XG5cbiAgLyogaW5wdXQgaW1hZ2UgKi9cbiAgcHJvdGVjdGVkIGltYWdlVHlwZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgYXZhdGFyOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBlbXB0eUltYWdlOiBzdHJpbmc7XG5cbiAgLyogaW5wdXQgcmVuZGVyZXIgYWN0aW9uICovXG4gIHByb3RlY3RlZCBpY29uOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBhY3Rpb246IHN0cmluZztcbiAgcHJvdGVjdGVkIHRleHQ6IHN0cmluZztcbiAgcHJvdGVjdGVkIGljb25Qb3NpdGlvbjogc3RyaW5nO1xuXG4gIC8qIGlucHV0IHJlbmRlcmVyIHNlcnZpY2UgKi9cbiAgcHJvdGVjdGVkIGVudGl0eTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgc2VydmljZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgY29sdW1uczogc3RyaW5nO1xuICBwcm90ZWN0ZWQgdmFsdWVDb2x1bW46IHN0cmluZztcbiAgcHJvdGVjdGVkIHBhcmVudEtleXM6IHN0cmluZztcbiAgcHJvdGVjdGVkIHF1ZXJ5TWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5RVUVSWV9NRVRIT0Q7XG4gIHByb3RlY3RlZCBzZXJ2aWNlVHlwZTogc3RyaW5nO1xuXG4gIC8qIGlucHV0IHJlbmRlcmVyIHRyYW5zbGF0ZSAqL1xuICBwcm90ZWN0ZWQgdHJhbnNsYXRlQXJnc0ZuOiAocm93RGF0YTogYW55KSA9PiBhbnlbXTtcbiAgLyogaW5wdXQgdGltZSAqL1xuICBvRGF0ZUZvcm1hdCA9ICdMJztcbiAgb0hvdXJGb3JtYXQgPSAyNDtcblxuICAvKiBpbnB1dCByZW5kZXJlciBwZXJjZW50YWdlICovXG4gIHZhbHVlQmFzZTogT1BlcmNlbnRhZ2VWYWx1ZUJhc2VUeXBlID0gMTtcblxuICAvKiBpbnB1dCBlZGl0b3IgKi9cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIG9yZXF1aXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93UGxhY2VIb2xkZXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgb2xhYmVsOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHVwZGF0ZVJlY29yZE9uRWRpdDogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dOb3RpZmljYXRpb25PbkVkaXQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiBpbnB1dCBlZGl0b3IgZGF0ZSAqL1xuICBwcm90ZWN0ZWQgbG9jYWxlOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBvU3RhcnRWaWV3OiAnbW9udGgnIHwgJ3llYXInID0gJ21vbnRoJztcbiAgcHJvdGVjdGVkIG9NaW5EYXRlOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBvTWF4RGF0ZTogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwcm90ZWN0ZWQgb1RvdWNoVWk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJvdGVjdGVkIG9TdGFydEF0OiBzdHJpbmc7XG4gIHByb3RlY3RlZCBmaWx0ZXJEYXRlOiBEYXRlRmlsdGVyRnVuY3Rpb247XG4gIHByb3RlY3RlZCBkYXRlVmFsdWVUeXBlOiBPRGF0ZVZhbHVlVHlwZSA9ICd0aW1lc3RhbXAnO1xuXG4gIC8qIGlucHV0IGVkaXRvciBpbnRlZ2VyICovXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1pbjogbnVtYmVyO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBtYXg6IG51bWJlcjtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc3RlcDogbnVtYmVyO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBtaW5EZWNpbWFsRGlnaXRzOiBudW1iZXIgPSAyO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBtYXhEZWNpbWFsRGlnaXRzOiBudW1iZXIgPSAyO1xuXG4gIC8qIGlucHV0IGVkaXRvciBib29sZWFuICovXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGluZGV0ZXJtaW5hdGVPbk51bGw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgYXV0b0NvbW1pdDogYm9vbGVhbjtcblxuICAvKiBvdXRwdXQgY2VsbCByZW5kZXJlciBhY3Rpb24gKi9cbiAgb25DbGljazogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICAvKiBvdXRwdXQgY2VsbCBlZGl0b3IgKi9cbiAgZWRpdGlvblN0YXJ0ZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gIGVkaXRpb25DYW5jZWxsZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gIGVkaXRpb25Db21taXR0ZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gIG9uUG9zdFVwZGF0ZVJlY29yZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBhc3luY0xvYWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBAVmlld0NoaWxkKCdjb250YWluZXInLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICBjb250YWluZXI6IFZpZXdDb250YWluZXJSZWY7XG5cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPVGFibGVDb21wb25lbnQpKSBwdWJsaWMgdGFibGU6IE9UYWJsZUNvbXBvbmVudCxcbiAgICBwcm90ZWN0ZWQgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICB9XG5cbiAgc3RhdGljIGFkZEVkaXRvcih0eXBlOiBzdHJpbmcsIGVkaXRvckNsYXNzUmVmZXJlbmNlOiBhbnkpIHtcbiAgICBpZiAoIWVkaXRvcnNNYXBwaW5nLmhhc093blByb3BlcnR5KHR5cGUpICYmIFV0aWwuaXNEZWZpbmVkKGVkaXRvckNsYXNzUmVmZXJlbmNlKSkge1xuICAgICAgZWRpdG9yc01hcHBpbmdbdHlwZV0gPSBlZGl0b3JDbGFzc1JlZmVyZW5jZTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmdyb3VwaW5nID0gVXRpbC5wYXJzZUJvb2xlYW4odGhpcy5ncm91cGluZywgdHJ1ZSk7XG4gICAgdGhpcy50aXRsZUFsaWduID0gdGhpcy5wYXJzZVRpdGxlQWxpZ24oKTtcbiAgICB0aGlzLnRhYmxlLnJlZ2lzdGVyQ29sdW1uKHRoaXMpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy50YWJsZS5vblJlaW5pdGlhbGl6ZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy50YWJsZS5yZWdpc3RlckNvbHVtbih0aGlzKSkpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY3JlYXRlUmVuZGVyZXIoKTtcbiAgICB0aGlzLmNyZWF0ZUVkaXRvcigpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwYXJzZVRpdGxlQWxpZ24oKTogc3RyaW5nIHtcbiAgICBjb25zdCBhbGlnbiA9ICh0aGlzLnRpdGxlQWxpZ24gfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuIENvZGVzLkFWQUlMQUJMRV9DT0xVTU5fVElUTEVfQUxJR05TLmluZGV4T2YoYWxpZ24pICE9PSAtMSA/IGFsaWduIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0IG9yaWdpbmFsV2lkdGgoKSB7XG4gICAgbGV0IG9yaWdpbmFsV2lkdGggPSB0aGlzLndpZHRoO1xuICAgIGNvbnN0IHB4VmFsID0gVXRpbC5leHRyYWN0UGl4ZWxzVmFsdWUodGhpcy53aWR0aCk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHB4VmFsKSkge1xuICAgICAgb3JpZ2luYWxXaWR0aCA9IHB4VmFsICsgJyc7XG5cbiAgICB9XG4gICAgcmV0dXJuIG9yaWdpbmFsV2lkdGg7XG4gIH1cblxuICBwcm90ZWN0ZWQgY3JlYXRlUmVuZGVyZXIoKTogdm9pZCB7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh0aGlzLnJlbmRlcmVyKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnR5cGUpKSB7XG4gICAgICBjb25zdCBjb21wb25lbnRSZWYgPSByZW5kZXJlcnNNYXBwaW5nW3RoaXMudHlwZV07XG4gICAgICBpZiAoY29tcG9uZW50UmVmICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgZmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxhbnk+ID0gdGhpcy5yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShjb21wb25lbnRSZWYpO1xuICAgICAgICBpZiAoZmFjdG9yeSkge1xuICAgICAgICAgIGNvbnN0IHJlZiA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZUNvbXBvbmVudChmYWN0b3J5KTtcbiAgICAgICAgICBjb25zdCBuZXdSZW5kZXJlciA9IHJlZi5pbnN0YW5jZTtcbiAgICAgICAgICBuZXdSZW5kZXJlci5maWx0ZXJTb3VyY2UgPSB0aGlzLmZpbHRlclNvdXJjZTtcbiAgICAgICAgICBuZXdSZW5kZXJlci5maWx0ZXJGdW5jdGlvbiA9IHRoaXMuZmlsdGVyRnVuY3Rpb247XG4gICAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2N1cnJlbmN5JzpcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIuY3VycmVuY3lTeW1ib2wgPSB0aGlzLmN1cnJlbmN5U3ltYm9sO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5jdXJyZW5jeVN5bWJvbFBvc2l0aW9uID0gdGhpcy5jdXJyZW5jeVN5bWJvbFBvc2l0aW9uO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5kZWNpbWFsU2VwYXJhdG9yID0gdGhpcy5kZWNpbWFsU2VwYXJhdG9yO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5taW5EZWNpbWFsRGlnaXRzID0gdGhpcy5taW5EZWNpbWFsRGlnaXRzO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5tYXhEZWNpbWFsRGlnaXRzID0gdGhpcy5tYXhEZWNpbWFsRGlnaXRzO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5ncm91cGluZyA9IHRoaXMuZ3JvdXBpbmc7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLnRob3VzYW5kU2VwYXJhdG9yID0gdGhpcy50aG91c2FuZFNlcGFyYXRvcjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIuZm9ybWF0ID0gdGhpcy5mb3JtYXQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmZvcm1hdCA9IHRoaXMuZm9ybWF0O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ludGVnZXInOlxuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5ncm91cGluZyA9IHRoaXMuZ3JvdXBpbmc7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLnRob3VzYW5kU2VwYXJhdG9yID0gdGhpcy50aG91c2FuZFNlcGFyYXRvcjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIudHJ1ZVZhbHVlID0gdGhpcy50cnVlVmFsdWU7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmZhbHNlVmFsdWUgPSB0aGlzLmZhbHNlVmFsdWU7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLnJlbmRlclRydWVWYWx1ZSA9IHRoaXMucmVuZGVyVHJ1ZVZhbHVlO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5yZW5kZXJGYWxzZVZhbHVlID0gdGhpcy5yZW5kZXJGYWxzZVZhbHVlO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5yZW5kZXJUeXBlID0gdGhpcy5yZW5kZXJUeXBlO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5ib29sZWFuVHlwZSA9IHRoaXMuYm9vbGVhblR5cGU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncGVyY2VudGFnZSc6XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLnZhbHVlQmFzZSA9IHRoaXMudmFsdWVCYXNlO1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXN3aXRjaC1jYXNlLWZhbGwtdGhyb3VnaFxuICAgICAgICAgICAgY2FzZSAncmVhbCc6XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmRlY2ltYWxTZXBhcmF0b3IgPSB0aGlzLmRlY2ltYWxTZXBhcmF0b3I7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLm1pbkRlY2ltYWxEaWdpdHMgPSB0aGlzLm1pbkRlY2ltYWxEaWdpdHM7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLm1heERlY2ltYWxEaWdpdHMgPSB0aGlzLm1heERlY2ltYWxEaWdpdHM7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmdyb3VwaW5nID0gdGhpcy5ncm91cGluZztcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIudGhvdXNhbmRTZXBhcmF0b3IgPSB0aGlzLnRob3VzYW5kU2VwYXJhdG9yO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ltYWdlJzpcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIuaW1hZ2VUeXBlID0gdGhpcy5pbWFnZVR5cGU7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmF2YXRhciA9IHRoaXMuYXZhdGFyO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5lbXB0eUltYWdlID0gdGhpcy5lbXB0eUltYWdlO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FjdGlvbic6XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmljb24gPSB0aGlzLmljb247XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmFjdGlvbiA9IHRoaXMuYWN0aW9uO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci50ZXh0ID0gdGhpcy50ZXh0O1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5pY29uUG9zaXRpb24gPSB0aGlzLmljb25Qb3NpdGlvbjtcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIub25DbGljayA9IHRoaXMub25DbGljaztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzZXJ2aWNlJzpcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIuZW50aXR5ID0gdGhpcy5lbnRpdHk7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLnNlcnZpY2UgPSB0aGlzLnNlcnZpY2U7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmNvbHVtbnMgPSB0aGlzLmNvbHVtbnM7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLnZhbHVlQ29sdW1uID0gdGhpcy52YWx1ZUNvbHVtbjtcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIucGFyZW50S2V5cyA9IHRoaXMucGFyZW50S2V5cztcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIucXVlcnlNZXRob2QgPSB0aGlzLnF1ZXJ5TWV0aG9kO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5zZXJ2aWNlVHlwZSA9IHRoaXMuc2VydmljZVR5cGU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndHJhbnNsYXRlJzpcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIudHJhbnNsYXRlQXJnc0ZuID0gdGhpcy50cmFuc2xhdGVBcmdzRm47XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyUmVuZGVyZXIobmV3UmVuZGVyZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYnVpbGRDZWxsRWRpdG9yKHR5cGU6IHN0cmluZywgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgY29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmLCBwcm9wc09yaWdpbjogYW55KSB7XG4gICAgbGV0IGVkaXRvcjtcbiAgICBjb25zdCBjb21wb25lbnRSZWYgPSBlZGl0b3JzTWFwcGluZ1t0eXBlXSB8fCBlZGl0b3JzTWFwcGluZy50ZXh0O1xuICAgIGlmIChjb21wb25lbnRSZWYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGVkaXRvcjtcbiAgICB9XG4gICAgY29uc3QgZmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxhbnk+ID0gcmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoY29tcG9uZW50UmVmKTtcbiAgICBpZiAoZmFjdG9yeSkge1xuICAgICAgY29uc3QgcmVmID0gY29udGFpbmVyLmNyZWF0ZUNvbXBvbmVudChmYWN0b3J5KTtcbiAgICAgIGVkaXRvciA9IHJlZi5pbnN0YW5jZTtcbiAgICAgIGlmIChwcm9wc09yaWdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgICAgZWRpdG9yLmZvcm1hdCA9IHByb3BzT3JpZ2luLmZvcm1hdDtcbiAgICAgICAgICAgIGVkaXRvci5sb2NhbGUgPSBwcm9wc09yaWdpbi5sb2NhbGU7XG4gICAgICAgICAgICBlZGl0b3Iub1N0YXJ0VmlldyA9IHByb3BzT3JpZ2luLm9TdGFydFZpZXc7XG4gICAgICAgICAgICBlZGl0b3Iub01pbkRhdGUgPSBwcm9wc09yaWdpbi5vTWluRGF0ZTtcbiAgICAgICAgICAgIGVkaXRvci5vTWF4RGF0ZSA9IHByb3BzT3JpZ2luLm9NYXhEYXRlO1xuICAgICAgICAgICAgZWRpdG9yLm9Ub3VjaFVpID0gcHJvcHNPcmlnaW4ub1RvdWNoVWk7XG4gICAgICAgICAgICBlZGl0b3Iub1N0YXJ0QXQgPSBwcm9wc09yaWdpbi5vU3RhcnRBdDtcbiAgICAgICAgICAgIGVkaXRvci5maWx0ZXJEYXRlID0gcHJvcHNPcmlnaW4uZmlsdGVyRGF0ZTtcbiAgICAgICAgICAgIGVkaXRvci5kYXRlVmFsdWVUeXBlID0gcHJvcHNPcmlnaW4uZGF0ZVZhbHVlVHlwZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3RpbWUnOlxuICAgICAgICAgICAgZWRpdG9yLm9EYXRlRm9ybWF0ID0gcHJvcHNPcmlnaW4ub0RhdGVGb3JtYXQ7XG4gICAgICAgICAgICBlZGl0b3Iub0hvdXJGb3JtYXQgPSBwcm9wc09yaWdpbi5vSG91ckZvcm1hdDtcbiAgICAgICAgICAgIGVkaXRvci5vRGF0ZUxvY2FsZSA9IHByb3BzT3JpZ2luLm9EYXRlTG9jYWxlO1xuICAgICAgICAgICAgZWRpdG9yLm9NaW5EYXRlID0gcHJvcHNPcmlnaW4ub01pbkRhdGU7XG4gICAgICAgICAgICBlZGl0b3Iub01heERhdGUgPSBwcm9wc09yaWdpbi5vTWF4RGF0ZTtcblxuICAgICAgICAgICAgZWRpdG9yLm9Ub3VjaFVpID0gcHJvcHNPcmlnaW4ub1RvdWNoVWk7XG4gICAgICAgICAgICBlZGl0b3Iub0RhdGVTdGFydEF0ID0gcHJvcHNPcmlnaW4ub0RhdGVTdGFydEF0O1xuICAgICAgICAgICAgZWRpdG9yLm9EYXRlVGV4dElucHV0RW5hYmxlZCA9IHByb3BzT3JpZ2luLm9EYXRlVGV4dElucHV0RW5hYmxlZDtcblxuICAgICAgICAgICAgZWRpdG9yLm9Ib3VyTWluID0gcHJvcHNPcmlnaW4ub0hvdXJNaW47XG4gICAgICAgICAgICBlZGl0b3Iub0hvdXJNYXggPSBwcm9wc09yaWdpbi5vSG91ck1heDtcbiAgICAgICAgICAgIGVkaXRvci5vSG91clRleHRJbnB1dEVuYWJsZWQgPSBwcm9wc09yaWdpbi5vSG91clRleHRJbnB1dEVuYWJsZWQ7XG4gICAgICAgICAgICBlZGl0b3Iub0hvdXJQbGFjZWhvbGRlciA9IHByb3BzT3JpZ2luLm9Ib3VyUGxhY2Vob2xkZXI7XG4gICAgICAgICAgICBlZGl0b3Iub0RhdGVQbGFjZWhvbGRlciA9IHByb3BzT3JpZ2luLm9EYXRlUGxhY2Vob2xkZXI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgIGVkaXRvci5ib29sZWFuVHlwZSA9IHByb3BzT3JpZ2luLmJvb2xlYW5UeXBlO1xuICAgICAgICAgICAgZWRpdG9yLmluZGV0ZXJtaW5hdGVPbk51bGwgPSBwcm9wc09yaWdpbi5pbmRldGVybWluYXRlT25OdWxsO1xuICAgICAgICAgICAgZWRpdG9yLmF1dG9Db21taXQgPSBwcm9wc09yaWdpbi5hdXRvQ29tbWl0O1xuICAgICAgICAgICAgZWRpdG9yLnRydWVWYWx1ZSA9IHByb3BzT3JpZ2luLnRydWVWYWx1ZTtcbiAgICAgICAgICAgIGVkaXRvci5mYWxzZVZhbHVlID0gcHJvcHNPcmlnaW4uZmFsc2VWYWx1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2ludGVnZXInOlxuICAgICAgICAgIGNhc2UgJ3BlcmNlbnRhZ2UnOlxuICAgICAgICAgIGNhc2UgJ2N1cnJlbmN5JzpcbiAgICAgICAgICBjYXNlICdyZWFsJzpcbiAgICAgICAgICAgIGVkaXRvci5taW4gPSBwcm9wc09yaWdpbi5taW47XG4gICAgICAgICAgICBlZGl0b3IubWF4ID0gcHJvcHNPcmlnaW4ubWF4O1xuICAgICAgICAgICAgZWRpdG9yLnN0ZXAgPSBVdGlsLmlzRGVmaW5lZChwcm9wc09yaWdpbi5zdGVwKSA/IHByb3BzT3JpZ2luLnN0ZXAgOiBlZGl0b3Iuc3RlcDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2ltYWdlJzpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBlZGl0b3Iub2xhYmVsID0gcHJvcHNPcmlnaW4ub2xhYmVsO1xuICAgICAgICBlZGl0b3IudHlwZSA9IHByb3BzT3JpZ2luLnR5cGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlZGl0b3I7XG4gIH1cblxuICBwcm90ZWN0ZWQgY3JlYXRlRWRpdG9yKCkge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5lZGl0b3IpICYmIHRoaXMuZWRpdGFibGUpIHtcbiAgICAgIGNvbnN0IG5ld0VkaXRvciA9IHRoaXMuYnVpbGRDZWxsRWRpdG9yKHRoaXMudHlwZSwgdGhpcy5yZXNvbHZlciwgdGhpcy5jb250YWluZXIsIHRoaXMpO1xuICAgICAgaWYgKG5ld0VkaXRvcikge1xuICAgICAgICBuZXdFZGl0b3Iub3JlcXVpcmVkID0gdGhpcy5vcmVxdWlyZWQ7XG4gICAgICAgIG5ld0VkaXRvci5zaG93UGxhY2VIb2xkZXIgPSB0aGlzLnNob3dQbGFjZUhvbGRlcjtcbiAgICAgICAgbmV3RWRpdG9yLnVwZGF0ZVJlY29yZE9uRWRpdCA9IHRoaXMudXBkYXRlUmVjb3JkT25FZGl0O1xuICAgICAgICBuZXdFZGl0b3Iuc2hvd05vdGlmaWNhdGlvbk9uRWRpdCA9IHRoaXMuc2hvd05vdGlmaWNhdGlvbk9uRWRpdDtcbiAgICAgICAgbmV3RWRpdG9yLmVkaXRpb25TdGFydGVkID0gdGhpcy5lZGl0aW9uU3RhcnRlZDtcbiAgICAgICAgbmV3RWRpdG9yLmVkaXRpb25DYW5jZWxsZWQgPSB0aGlzLmVkaXRpb25DYW5jZWxsZWQ7XG4gICAgICAgIG5ld0VkaXRvci5lZGl0aW9uQ29tbWl0dGVkID0gdGhpcy5lZGl0aW9uQ29tbWl0dGVkO1xuICAgICAgICBuZXdFZGl0b3Iub25Qb3N0VXBkYXRlUmVjb3JkID0gdGhpcy5vblBvc3RVcGRhdGVSZWNvcmQ7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJFZGl0b3IobmV3RWRpdG9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJSZW5kZXJlcihyZW5kZXJlcjogYW55KSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgIGNvbnN0IG9Db2wgPSB0aGlzLnRhYmxlLmdldE9Db2x1bW4odGhpcy5hdHRyKTtcbiAgICBpZiAob0NvbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvQ29sLnJlbmRlcmVyID0gdGhpcy5yZW5kZXJlcjtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJlci5pbml0aWFsaXplKCk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJFZGl0b3IoZWRpdG9yOiBhbnkpIHtcbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgICBjb25zdCBvQ29sID0gdGhpcy50YWJsZS5nZXRPQ29sdW1uKHRoaXMuYXR0cik7XG4gICAgaWYgKG9Db2wgIT09IHVuZGVmaW5lZCkge1xuICAgICAgb0NvbC5lZGl0b3IgPSB0aGlzLmVkaXRvcjtcbiAgICB9XG4gICAgdGhpcy5lZGl0b3IuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgc2V0IG9yZGVyYWJsZSh2YWw6IGFueSkge1xuICAgIHRoaXMuX29yZGVyYWJsZSA9IHR5cGVvZiB2YWwgPT09ICdib29sZWFuJyA/IHZhbCA6IFV0aWwucGFyc2VCb29sZWFuKHZhbCwgdHJ1ZSk7XG4gICAgY29uc3Qgb0NvbCA9IHRoaXMudGFibGUuZ2V0T0NvbHVtbih0aGlzLmF0dHIpO1xuICAgIGlmIChvQ29sKSB7XG4gICAgICBvQ29sLm9yZGVyYWJsZSA9IHRoaXMuX29yZGVyYWJsZTtcbiAgICB9XG4gIH1cblxuICBnZXQgb3JkZXJhYmxlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX29yZGVyYWJsZTtcbiAgfVxuXG4gIHNldCByZXNpemFibGUodmFsOiBhbnkpIHtcbiAgICB0aGlzLl9yZXNpemFibGUgPSB0eXBlb2YgdmFsID09PSAnYm9vbGVhbicgPyB2YWwgOiBVdGlsLnBhcnNlQm9vbGVhbih2YWwsIHRydWUpO1xuICAgIGNvbnN0IG9Db2wgPSB0aGlzLnRhYmxlLmdldE9Db2x1bW4odGhpcy5hdHRyKTtcbiAgICBpZiAob0NvbCkge1xuICAgICAgb0NvbC5yZXNpemFibGUgPSB0aGlzLl9yZXNpemFibGU7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHJlc2l6YWJsZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9yZXNpemFibGU7XG4gIH1cblxuICBzZXQgc2VhcmNoYWJsZSh2YWw6IGFueSkge1xuICAgIHRoaXMuX3NlYXJjaGFibGUgPSB0eXBlb2YgdmFsID09PSAnYm9vbGVhbicgPyB2YWwgOiBVdGlsLnBhcnNlQm9vbGVhbih2YWwsIHRydWUpO1xuICAgIGNvbnN0IG9Db2wgPSB0aGlzLnRhYmxlLmdldE9Db2x1bW4odGhpcy5hdHRyKTtcbiAgICBpZiAob0NvbCkge1xuICAgICAgb0NvbC5zZWFyY2hhYmxlID0gdGhpcy5fc2VhcmNoYWJsZTtcbiAgICB9XG4gIH1cblxuICBnZXQgc2VhcmNoYWJsZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9zZWFyY2hhYmxlO1xuICB9XG5cbiAgZ2V0U1FMVHlwZSgpOiBudW1iZXIge1xuICAgIGlmICghKHRoaXMuc3FsVHlwZSAmJiB0aGlzLnNxbFR5cGUubGVuZ3RoID4gMCkpIHtcbiAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgIHRoaXMuc3FsVHlwZSA9ICdUSU1FU1RBTVAnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdpbnRlZ2VyJzpcbiAgICAgICAgICB0aGlzLnNxbFR5cGUgPSAnSU5URUdFUic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgIHRoaXMuc3FsVHlwZSA9ICdCT09MRUFOJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVhbCc6XG4gICAgICAgIGNhc2UgJ3BlcmNlbnRhZ2UnOlxuICAgICAgICBjYXNlICdjdXJyZW5jeSc6XG4gICAgICAgICAgdGhpcy5zcWxUeXBlID0gJ0RPVUJMRSc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHNxbHQgPSB0aGlzLnNxbFR5cGUgJiYgdGhpcy5zcWxUeXBlLmxlbmd0aCA+IDAgPyB0aGlzLnNxbFR5cGUgOiB0aGlzLl9kZWZhdWx0U1FMVHlwZUtleTtcbiAgICB0aGlzLl9TUUxUeXBlID0gU1FMVHlwZXMuZ2V0U1FMVHlwZVZhbHVlKHNxbHQpO1xuICAgIHJldHVybiB0aGlzLl9TUUxUeXBlO1xuICB9XG5cbiAgc2V0IGZpbHRlclNvdXJjZSh2YWw6IHN0cmluZykge1xuICAgIGNvbnN0IGxvd2VyVmFsID0gKHZhbCB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLl9maWx0ZXJTb3VyY2UgPSAobG93ZXJWYWwgPT09ICdyZW5kZXInIHx8IGxvd2VyVmFsID09PSAnZGF0YScgfHwgbG93ZXJWYWwgPT09ICdib3RoJykgPyBsb3dlclZhbCA6ICdyZW5kZXInO1xuICB9XG5cbiAgZ2V0IGZpbHRlclNvdXJjZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9maWx0ZXJTb3VyY2U7XG4gIH1cbn1cbiJdfQ==