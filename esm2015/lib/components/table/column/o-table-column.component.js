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
export const DEFAULT_INPUTS_O_TABLE_COLUMN = [
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
    'class',
    ...O_TABLE_CELL_RENDERERS_INPUTS,
    ...O_TABLE_CELL_EDITORS_INPUTS
];
export const DEFAULT_OUTPUTS_O_TABLE_COLUMN = [
    ...O_TABLE_CELL_RENDERERS_OUTPUTS,
    ...O_TABLE_CELL_EDITORS_OUTPUTS
];
export class OTableColumnComponent {
    constructor(table, resolver, injector) {
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
    set multiline(val) {
        val = Util.parseBoolean(String(val));
        this._multiline = val;
    }
    get multiline() {
        return this._multiline;
    }
    static addEditor(type, editorClassReference) {
        if (!editorsMapping.hasOwnProperty(type) && Util.isDefined(editorClassReference)) {
            editorsMapping[type] = editorClassReference;
        }
    }
    ngOnInit() {
        this.grouping = Util.parseBoolean(this.grouping, true);
        this.titleAlign = this.parseTitleAlign();
        this.table.registerColumn(this);
        this.subscriptions.add(this.table.onReinitialize.subscribe(() => this.table.registerColumn(this)));
    }
    ngAfterViewInit() {
        this.createRenderer();
        this.createEditor();
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    parseTitleAlign() {
        const align = (this.titleAlign || '').toLowerCase();
        return Codes.AVAILABLE_COLUMN_TITLE_ALIGNS.indexOf(align) !== -1 ? align : undefined;
    }
    get originalWidth() {
        let originalWidth = this.width;
        const pxVal = Util.extractPixelsValue(this.width);
        if (Util.isDefined(pxVal)) {
            originalWidth = pxVal + '';
        }
        return originalWidth;
    }
    createRenderer() {
        if (!Util.isDefined(this.renderer) && Util.isDefined(this.type)) {
            const componentRef = renderersMapping[this.type];
            if (componentRef !== undefined) {
                const factory = this.resolver.resolveComponentFactory(componentRef);
                if (factory) {
                    const ref = this.container.createComponent(factory);
                    const newRenderer = ref.instance;
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
    }
    buildCellEditor(type, resolver, container, propsOrigin) {
        let editor;
        const componentRef = editorsMapping[type] || editorsMapping.text;
        if (componentRef === undefined) {
            return editor;
        }
        const factory = resolver.resolveComponentFactory(componentRef);
        if (factory) {
            const ref = container.createComponent(factory);
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
    }
    createEditor() {
        if (!Util.isDefined(this.editor) && this.editable) {
            const newEditor = this.buildCellEditor(this.type, this.resolver, this.container, this);
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
    }
    registerRenderer(renderer) {
        this.renderer = renderer;
        const oCol = this.table.getOColumn(this.attr);
        if (oCol !== undefined) {
            oCol.renderer = this.renderer;
        }
        this.renderer.initialize();
    }
    registerEditor(editor) {
        this.editor = editor;
        const oCol = this.table.getOColumn(this.attr);
        if (oCol !== undefined) {
            oCol.editor = this.editor;
        }
        this.editor.initialize();
    }
    set orderable(val) {
        this._orderable = typeof val === 'boolean' ? val : Util.parseBoolean(val, true);
        const oCol = this.table.getOColumn(this.attr);
        if (oCol) {
            oCol.orderable = this._orderable;
        }
    }
    get orderable() {
        return this._orderable;
    }
    set resizable(val) {
        this._resizable = typeof val === 'boolean' ? val : Util.parseBoolean(val, true);
        const oCol = this.table.getOColumn(this.attr);
        if (oCol) {
            oCol.resizable = this._resizable;
        }
    }
    get resizable() {
        return this._resizable;
    }
    set searchable(val) {
        this._searchable = typeof val === 'boolean' ? val : Util.parseBoolean(val, true);
        const oCol = this.table.getOColumn(this.attr);
        if (oCol) {
            oCol.searchable = this._searchable;
        }
    }
    get searchable() {
        return this._searchable;
    }
    getSQLType() {
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
        const sqlt = this.sqlType && this.sqlType.length > 0 ? this.sqlType : this._defaultSQLTypeKey;
        this._SQLType = SQLTypes.getSQLTypeValue(sqlt);
        return this._SQLType;
    }
    set filterSource(val) {
        const lowerVal = (val || '').toLowerCase();
        this._filterSource = (lowerVal === 'render' || lowerVal === 'data' || lowerVal === 'both') ? lowerVal : 'render';
    }
    get filterSource() {
        return this._filterSource;
    }
}
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
OTableColumnComponent.ctorParameters = () => [
    { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(() => OTableComponent),] }] },
    { type: ComponentFactoryResolver },
    { type: Injector }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jb2x1bW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9vLXRhYmxlLWNvbHVtbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULHdCQUF3QixFQUN4QixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBR1IsU0FBUyxFQUNULGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXBDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUtyRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2xELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGNBQWMsRUFBRSwyQkFBMkIsRUFBRSw0QkFBNEIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3RILE9BQU8sRUFDTCw2QkFBNkIsRUFDN0IsOEJBQThCLEVBQzlCLGdCQUFnQixHQUNqQixNQUFNLCtCQUErQixDQUFDO0FBR3ZDLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFHO0lBRzNDLE1BQU07SUFHTixPQUFPO0lBR1AseUJBQXlCO0lBR3pCLDZCQUE2QjtJQUc3QixXQUFXO0lBR1gsWUFBWTtJQUdaLE1BQU07SUFHTixVQUFVO0lBRVYsT0FBTztJQUdQLHFCQUFxQjtJQUdyQixxQkFBcUI7SUFHckIsd0JBQXdCO0lBR3hCLG1CQUFtQjtJQUVuQixTQUFTO0lB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RUFBRTs7d0RBQ1UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRGYWN0b3J5LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPVGFibGVDb2x1bW4gfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtY29sdW1uLmludGVyZmFjZSc7XG5pbXBvcnQgeyBEYXRlRmlsdGVyRnVuY3Rpb24gfSBmcm9tICcuLi8uLi8uLi90eXBlcy9kYXRlLWZpbHRlci1mdW5jdGlvbi50eXBlJztcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tICcuLi8uLi8uLi90eXBlcy9leHByZXNzaW9uLnR5cGUnO1xuaW1wb3J0IHsgT0RhdGVWYWx1ZVR5cGUgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9vLWRhdGUtdmFsdWUudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgU1FMVHlwZXMgfSBmcm9tICcuLi8uLi8uLi91dGlsL3NxbHR5cGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vby10YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgZWRpdG9yc01hcHBpbmcsIE9fVEFCTEVfQ0VMTF9FRElUT1JTX0lOUFVUUywgT19UQUJMRV9DRUxMX0VESVRPUlNfT1VUUFVUUyB9IGZyb20gJy4vY2VsbC1lZGl0b3IvY2VsbC1lZGl0b3InO1xuaW1wb3J0IHtcbiAgT19UQUJMRV9DRUxMX1JFTkRFUkVSU19JTlBVVFMsXG4gIE9fVEFCTEVfQ0VMTF9SRU5ERVJFUlNfT1VUUFVUUyxcbiAgcmVuZGVyZXJzTWFwcGluZyxcbn0gZnJvbSAnLi9jZWxsLXJlbmRlcmVyL2NlbGwtcmVuZGVyZXInO1xuaW1wb3J0IHsgT1BlcmNlbnRhZ2VWYWx1ZUJhc2VUeXBlIH0gZnJvbSAnLi4vLi4vLi4vcGlwZXMvby1wZXJjZW50YWdlLnBpcGUnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DT0xVTU4gPSBbXG5cbiAgLy8gYXR0ciBbc3RyaW5nXTogY29sdW1uIG5hbWUuXG4gICdhdHRyJyxcblxuICAvLyB0aXRsZSBbc3RyaW5nXTogY29sdW1uIHRpdGxlLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3RpdGxlJyxcblxuICAvLyB0aXRsZS1hbGlnbiBbc3RhcnQgfCBjZW50ZXIgfCBlbmRdOiBjb2x1bW4gdGl0bGUgYWxpZ25tZW50LiBEZWZhdWx0OiBjZW50ZXIuXG4gICd0aXRsZUFsaWduOiB0aXRsZS1hbGlnbicsXG5cbiAgLy8gY29udGVudC1hbGlnbiBbc3RhcnQgfCBjZW50ZXIgfCBlbmRdOiBjb2x1bW4gY29udGVudCBhbGlnbm1lbnQuXG4gICdjb250ZW50QWxpZ246IGNvbnRlbnQtYWxpZ24nLFxuXG4gIC8vIG9yZGVyYWJsZSBbbm98eWVzXTogY29sdW1uIGNhbiBiZSBzb3J0ZWQuIERlZmF1bHQ6IHllcy5cbiAgJ29yZGVyYWJsZScsXG5cbiAgLy8gc2VhcmNoYWJsZSBbbm98eWVzXTogc2VhcmNoaW5ncyBhcmUgcGVyZm9ybWVkIGludG8gY29sdW1uIGNvbnRlbnQuIERlZmF1bHQ6IHllcy5cbiAgJ3NlYXJjaGFibGUnLFxuXG4gIC8vIHR5cGUgW2Jvb2xlYW58aW50ZWdlcnxyZWFsfGN1cnJlbmN5fGRhdGV8aW1hZ2VdOiBjb2x1bW4gdHlwZS4gRGVmYXVsdDogbm8gdmFsdWUgKHN0cmluZykuXG4gICd0eXBlJyxcblxuICAvLyBlZGl0YWJsZSBbbm98eWVzXTogY29sdW1uIGNhbiBiZSBlZGl0ZWQgZGlyZWN0bHkgb3ZlciB0aGUgdGFibGUuIERlZmF1bHQ6IG5vLlxuICAnZWRpdGFibGUnLFxuXG4gICd3aWR0aCcsXG5cbiAgLy8gb25seSBpbiBwaXhlbHNcbiAgJ21pbldpZHRoOiBtaW4td2lkdGgnLFxuXG4gIC8vIG9ubHkgaW4gcGl4ZWxzXG4gICdtYXhXaWR0aDogbWF4LXdpZHRoJyxcblxuICAvLyBhc3luYy1sb2FkIFtub3x5ZXN8dHJ1ZXxmYWxzZV06IGFzeW5jaHJvbm91cyBxdWVyeS4gRGVmYXVsdDogbm9cbiAgJ2FzeW5jTG9hZCA6IGFzeW5jLWxvYWQnLFxuXG4gIC8vIHNxbHR5cGVbc3RyaW5nXTogRGF0YSB0eXBlIGFjY29yZGluZyB0byBKYXZhIHN0YW5kYXJkLiBTZWUgU1FMVHlwZSBjbGFzcy4gRGVmYXVsdDogJ09USEVSJ1xuICAnc3FsVHlwZTogc3FsLXR5cGUnLFxuXG4gICd0b29sdGlwJyxcblxuICAndG9vbHRpcFZhbHVlOiB0b29sdGlwLXZhbHVlJyxcblxuICAndG9vbHRpcEZ1bmN0aW9uOiB0b29sdGlwLWZ1bmN0aW9uJyxcblxuICAnbXVsdGlsaW5lJyxcblxuICAncmVzaXphYmxlJyxcblxuICAnZmlsdGVyRXhwcmVzc2lvbkZ1bmN0aW9uOiBmaWx0ZXItZXhwcmVzc2lvbi1mdW5jdGlvbicsXG5cbiAgJ2NsYXNzJyxcblxuICAuLi5PX1RBQkxFX0NFTExfUkVOREVSRVJTX0lOUFVUUyxcbiAgLi4uT19UQUJMRV9DRUxMX0VESVRPUlNfSU5QVVRTXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ09MVU1OID0gW1xuICAuLi5PX1RBQkxFX0NFTExfUkVOREVSRVJTX09VVFBVVFMsXG4gIC4uLk9fVEFCTEVfQ0VMTF9FRElUT1JTX09VVFBVVFNcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtY29sdW1uJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY29sdW1uLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS1jb2x1bW4uY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DT0xVTU4sXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NPTFVNTlxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVDb2x1bW5Db21wb25lbnQgaW1wbGVtZW50cyBPVGFibGVDb2x1bW4sIE9uRGVzdHJveSwgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcblxuICBwdWJsaWMgcmVuZGVyZXI6IGFueTtcbiAgcHVibGljIGVkaXRvcjogYW55O1xuXG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG4gIHB1YmxpYyBhdHRyOiBzdHJpbmc7XG4gIHB1YmxpYyB0aXRsZTogc3RyaW5nO1xuICBwdWJsaWMgdGl0bGVBbGlnbjogc3RyaW5nO1xuICBwdWJsaWMgY29udGVudEFsaWduOiAnc3RhcnQnIHwgJ2NlbnRlcicgfCAnZW5kJztcbiAgcHVibGljIHNxbFR5cGU6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9TUUxUeXBlOiBudW1iZXI7XG4gIHByb3RlY3RlZCBfZGVmYXVsdFNRTFR5cGVLZXk6IHN0cmluZyA9ICdPVEhFUic7XG4gIHByb3RlY3RlZCBfb3JkZXJhYmxlOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgX3Jlc2l6YWJsZTogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIF9zZWFyY2hhYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIGVkaXRhYmxlOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyB3aWR0aDogc3RyaW5nO1xuICBwdWJsaWMgbWluV2lkdGg6IHN0cmluZztcbiAgcHVibGljIG1heFdpZHRoOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyB0b29sdGlwOiBib29sZWFuID0gZmFsc2U7XG4gIHRvb2x0aXBWYWx1ZTogc3RyaW5nO1xuICB0b29sdGlwRnVuY3Rpb246IChyb3dEYXRhOiBhbnkpID0+IGFueTtcbiAgcHVibGljIGNsYXNzOiBzdHJpbmc7XG5cbiAgc2V0IG11bHRpbGluZSh2YWw6IGJvb2xlYW4pIHtcbiAgICB2YWwgPSBVdGlsLnBhcnNlQm9vbGVhbihTdHJpbmcodmFsKSk7XG4gICAgdGhpcy5fbXVsdGlsaW5lID0gdmFsO1xuICB9XG4gIGdldCBtdWx0aWxpbmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX211bHRpbGluZTtcbiAgfVxuICBwcm90ZWN0ZWQgX211bHRpbGluZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGZpbHRlckV4cHJlc3Npb25GdW5jdGlvbjogKGNvbHVtbkF0dHI6IHN0cmluZywgcXVpY2tGaWx0ZXI/OiBzdHJpbmcpID0+IEV4cHJlc3Npb247XG5cbiAgLyogaW5wdXQgcmVuZGVyZXIgYmFzZSAqL1xuICBwdWJsaWMgX2ZpbHRlclNvdXJjZTogJ3JlbmRlcicgfCAnZGF0YScgfCAnYm90aCcgPSAncmVuZGVyJztcbiAgcHVibGljIGZpbHRlckZ1bmN0aW9uOiAoY2VsbFZhbHVlOiBhbnksIHJvd1ZhbHVlOiBhbnksIHF1aWNrRmlsdGVyPzogc3RyaW5nKSA9PiBib29sZWFuO1xuICAvKiBpbnB1dCByZW5kZXJlciBkYXRlICovXG4gIHByb3RlY3RlZCBmb3JtYXQ6IHN0cmluZztcbiAgLyogaW5wdXQgcmVuZGVyZXIgaW50ZWdlciAqL1xuICBwcm90ZWN0ZWQgZ3JvdXBpbmc6IGFueSA9IHRydWU7XG4gIHByb3RlY3RlZCB0aG91c2FuZFNlcGFyYXRvcjogc3RyaW5nID0gJywnO1xuICAvKiBpbnB1dCByZW5kZXJlciByZWFsICovXG4gIHByb3RlY3RlZCBkZWNpbWFsU2VwYXJhdG9yOiBzdHJpbmcgPSAnLic7XG5cbiAgLyogaW5wdXQgcmVuZGVyZXIgY3VycmVuY3kgKi9cbiAgcHJvdGVjdGVkIGN1cnJlbmN5U3ltYm9sOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBjdXJyZW5jeVN5bWJvbFBvc2l0aW9uOiBzdHJpbmc7XG5cbiAgLyogaW5wdXQgcmVuZGVyZXIgYm9vbGVhbiAqL1xuICBwcm90ZWN0ZWQgdHJ1ZVZhbHVlOiBhbnk7XG4gIHByb3RlY3RlZCBmYWxzZVZhbHVlOiBhbnk7XG4gIHByb3RlY3RlZCByZW5kZXJUcnVlVmFsdWU6IGFueTtcbiAgcHJvdGVjdGVkIHJlbmRlckZhbHNlVmFsdWU6IGFueTtcbiAgcHJvdGVjdGVkIHJlbmRlclR5cGU6IHN0cmluZyA9ICdzdHJpbmcnO1xuICBwcm90ZWN0ZWQgYm9vbGVhblR5cGU6IHN0cmluZyA9ICdib29sZWFuJztcblxuICAvKiBpbnB1dCBpbWFnZSAqL1xuICBwcm90ZWN0ZWQgaW1hZ2VUeXBlOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBhdmF0YXI6IHN0cmluZztcbiAgcHJvdGVjdGVkIGVtcHR5SW1hZ2U6IHN0cmluZztcblxuICAvKiBpbnB1dCByZW5kZXJlciBhY3Rpb24gKi9cbiAgcHJvdGVjdGVkIGljb246IHN0cmluZztcbiAgcHJvdGVjdGVkIGFjdGlvbjogc3RyaW5nO1xuICBwcm90ZWN0ZWQgdGV4dDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgaWNvblBvc2l0aW9uOiBzdHJpbmc7XG5cbiAgLyogaW5wdXQgcmVuZGVyZXIgc2VydmljZSAqL1xuICBwcm90ZWN0ZWQgZW50aXR5OiBzdHJpbmc7XG4gIHByb3RlY3RlZCBzZXJ2aWNlOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBjb2x1bW5zOiBzdHJpbmc7XG4gIHByb3RlY3RlZCB2YWx1ZUNvbHVtbjogc3RyaW5nO1xuICBwcm90ZWN0ZWQgcGFyZW50S2V5czogc3RyaW5nO1xuICBwcm90ZWN0ZWQgcXVlcnlNZXRob2Q6IHN0cmluZyA9IENvZGVzLlFVRVJZX01FVEhPRDtcbiAgcHJvdGVjdGVkIHNlcnZpY2VUeXBlOiBzdHJpbmc7XG5cbiAgLyogaW5wdXQgcmVuZGVyZXIgdHJhbnNsYXRlICovXG4gIHByb3RlY3RlZCB0cmFuc2xhdGVBcmdzRm46IChyb3dEYXRhOiBhbnkpID0+IGFueVtdO1xuICAvKiBpbnB1dCB0aW1lICovXG4gIG9EYXRlRm9ybWF0ID0gJ0wnO1xuICBvSG91ckZvcm1hdCA9IDI0O1xuXG4gIC8qIGlucHV0IHJlbmRlcmVyIHBlcmNlbnRhZ2UgKi9cbiAgdmFsdWVCYXNlOiBPUGVyY2VudGFnZVZhbHVlQmFzZVR5cGUgPSAxO1xuXG4gIC8qIGlucHV0IGVkaXRvciAqL1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwcm90ZWN0ZWQgb3JlcXVpcmVkOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dQbGFjZUhvbGRlcjogYm9vbGVhbiA9IGZhbHNlO1xuICBvbGFiZWw6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgdXBkYXRlUmVjb3JkT25FZGl0OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd05vdGlmaWNhdGlvbk9uRWRpdDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qIGlucHV0IGVkaXRvciBkYXRlICovXG4gIHByb3RlY3RlZCBsb2NhbGU6IHN0cmluZztcbiAgcHJvdGVjdGVkIG9TdGFydFZpZXc6ICdtb250aCcgfCAneWVhcicgPSAnbW9udGgnO1xuICBwcm90ZWN0ZWQgb01pbkRhdGU6IHN0cmluZztcbiAgcHJvdGVjdGVkIG9NYXhEYXRlOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBvVG91Y2hVaTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgb1N0YXJ0QXQ6IHN0cmluZztcbiAgcHJvdGVjdGVkIGZpbHRlckRhdGU6IERhdGVGaWx0ZXJGdW5jdGlvbjtcbiAgcHJvdGVjdGVkIGRhdGVWYWx1ZVR5cGU6IE9EYXRlVmFsdWVUeXBlID0gJ3RpbWVzdGFtcCc7XG5cbiAgLyogaW5wdXQgZWRpdG9yIGludGVnZXIgKi9cbiAgQElucHV0Q29udmVydGVyKClcbiAgbWluOiBudW1iZXI7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1heDogbnVtYmVyO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzdGVwOiBudW1iZXI7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1pbkRlY2ltYWxEaWdpdHM6IG51bWJlciA9IDI7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1heERlY2ltYWxEaWdpdHM6IG51bWJlciA9IDI7XG5cbiAgLyogaW5wdXQgZWRpdG9yIGJvb2xlYW4gKi9cbiAgQElucHV0Q29udmVydGVyKClcbiAgaW5kZXRlcm1pbmF0ZU9uTnVsbDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBhdXRvQ29tbWl0OiBib29sZWFuO1xuXG4gIC8qIG91dHB1dCBjZWxsIHJlbmRlcmVyIGFjdGlvbiAqL1xuICBvbkNsaWNrOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIC8qIG91dHB1dCBjZWxsIGVkaXRvciAqL1xuICBlZGl0aW9uU3RhcnRlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgZWRpdGlvbkNhbmNlbGxlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgZWRpdGlvbkNvbW1pdHRlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgb25Qb3N0VXBkYXRlUmVjb3JkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGFzeW5jTG9hZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiwgc3RhdGljOiB0cnVlIH0pXG4gIGNvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZjtcblxuICBwcml2YXRlIHN1YnNjcmlwdGlvbnMgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9UYWJsZUNvbXBvbmVudCkpIHB1YmxpYyB0YWJsZTogT1RhYmxlQ29tcG9uZW50LFxuICAgIHByb3RlY3RlZCByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gIH1cblxuICBzdGF0aWMgYWRkRWRpdG9yKHR5cGU6IHN0cmluZywgZWRpdG9yQ2xhc3NSZWZlcmVuY2U6IGFueSkge1xuICAgIGlmICghZWRpdG9yc01hcHBpbmcuaGFzT3duUHJvcGVydHkodHlwZSkgJiYgVXRpbC5pc0RlZmluZWQoZWRpdG9yQ2xhc3NSZWZlcmVuY2UpKSB7XG4gICAgICBlZGl0b3JzTWFwcGluZ1t0eXBlXSA9IGVkaXRvckNsYXNzUmVmZXJlbmNlO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZ3JvdXBpbmcgPSBVdGlsLnBhcnNlQm9vbGVhbih0aGlzLmdyb3VwaW5nLCB0cnVlKTtcbiAgICB0aGlzLnRpdGxlQWxpZ24gPSB0aGlzLnBhcnNlVGl0bGVBbGlnbigpO1xuICAgIHRoaXMudGFibGUucmVnaXN0ZXJDb2x1bW4odGhpcyk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnRhYmxlLm9uUmVpbml0aWFsaXplLnN1YnNjcmliZSgoKSA9PiB0aGlzLnRhYmxlLnJlZ2lzdGVyQ29sdW1uKHRoaXMpKSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5jcmVhdGVSZW5kZXJlcigpO1xuICAgIHRoaXMuY3JlYXRlRWRpdG9yKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHBhcnNlVGl0bGVBbGlnbigpOiBzdHJpbmcge1xuICAgIGNvbnN0IGFsaWduID0gKHRoaXMudGl0bGVBbGlnbiB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gQ29kZXMuQVZBSUxBQkxFX0NPTFVNTl9USVRMRV9BTElHTlMuaW5kZXhPZihhbGlnbikgIT09IC0xID8gYWxpZ24gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXQgb3JpZ2luYWxXaWR0aCgpIHtcbiAgICBsZXQgb3JpZ2luYWxXaWR0aCA9IHRoaXMud2lkdGg7XG4gICAgY29uc3QgcHhWYWwgPSBVdGlsLmV4dHJhY3RQaXhlbHNWYWx1ZSh0aGlzLndpZHRoKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQocHhWYWwpKSB7XG4gICAgICBvcmlnaW5hbFdpZHRoID0gcHhWYWwgKyAnJztcblxuICAgIH1cbiAgICByZXR1cm4gb3JpZ2luYWxXaWR0aDtcbiAgfVxuXG4gIHByb3RlY3RlZCBjcmVhdGVSZW5kZXJlcigpOiB2b2lkIHtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMucmVuZGVyZXIpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMudHlwZSkpIHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudFJlZiA9IHJlbmRlcmVyc01hcHBpbmdbdGhpcy50eXBlXTtcbiAgICAgIGlmIChjb21wb25lbnRSZWYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBmYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5PGFueT4gPSB0aGlzLnJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KGNvbXBvbmVudFJlZik7XG4gICAgICAgIGlmIChmYWN0b3J5KSB7XG4gICAgICAgICAgY29uc3QgcmVmID0gdGhpcy5jb250YWluZXIuY3JlYXRlQ29tcG9uZW50KGZhY3RvcnkpO1xuICAgICAgICAgIGNvbnN0IG5ld1JlbmRlcmVyID0gcmVmLmluc3RhbmNlO1xuICAgICAgICAgIG5ld1JlbmRlcmVyLmZpbHRlclNvdXJjZSA9IHRoaXMuZmlsdGVyU291cmNlO1xuICAgICAgICAgIG5ld1JlbmRlcmVyLmZpbHRlckZ1bmN0aW9uID0gdGhpcy5maWx0ZXJGdW5jdGlvbjtcbiAgICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnY3VycmVuY3knOlxuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5jdXJyZW5jeVN5bWJvbCA9IHRoaXMuY3VycmVuY3lTeW1ib2w7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmN1cnJlbmN5U3ltYm9sUG9zaXRpb24gPSB0aGlzLmN1cnJlbmN5U3ltYm9sUG9zaXRpb247XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmRlY2ltYWxTZXBhcmF0b3IgPSB0aGlzLmRlY2ltYWxTZXBhcmF0b3I7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLm1pbkRlY2ltYWxEaWdpdHMgPSB0aGlzLm1pbkRlY2ltYWxEaWdpdHM7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLm1heERlY2ltYWxEaWdpdHMgPSB0aGlzLm1heERlY2ltYWxEaWdpdHM7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmdyb3VwaW5nID0gdGhpcy5ncm91cGluZztcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIudGhvdXNhbmRTZXBhcmF0b3IgPSB0aGlzLnRob3VzYW5kU2VwYXJhdG9yO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5mb3JtYXQgPSB0aGlzLmZvcm1hdDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0aW1lJzpcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIuZm9ybWF0ID0gdGhpcy5mb3JtYXQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmdyb3VwaW5nID0gdGhpcy5ncm91cGluZztcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIudGhvdXNhbmRTZXBhcmF0b3IgPSB0aGlzLnRob3VzYW5kU2VwYXJhdG9yO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgICBuZXdSZW5kZXJlci50cnVlVmFsdWUgPSB0aGlzLnRydWVWYWx1ZTtcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIuZmFsc2VWYWx1ZSA9IHRoaXMuZmFsc2VWYWx1ZTtcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIucmVuZGVyVHJ1ZVZhbHVlID0gdGhpcy5yZW5kZXJUcnVlVmFsdWU7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLnJlbmRlckZhbHNlVmFsdWUgPSB0aGlzLnJlbmRlckZhbHNlVmFsdWU7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLnJlbmRlclR5cGUgPSB0aGlzLnJlbmRlclR5cGU7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmJvb2xlYW5UeXBlID0gdGhpcy5ib29sZWFuVHlwZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdwZXJjZW50YWdlJzpcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIudmFsdWVCYXNlID0gdGhpcy52YWx1ZUJhc2U7XG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tc3dpdGNoLWNhc2UtZmFsbC10aHJvdWdoXG4gICAgICAgICAgICBjYXNlICdyZWFsJzpcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIuZGVjaW1hbFNlcGFyYXRvciA9IHRoaXMuZGVjaW1hbFNlcGFyYXRvcjtcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIubWluRGVjaW1hbERpZ2l0cyA9IHRoaXMubWluRGVjaW1hbERpZ2l0cztcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIubWF4RGVjaW1hbERpZ2l0cyA9IHRoaXMubWF4RGVjaW1hbERpZ2l0cztcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIuZ3JvdXBpbmcgPSB0aGlzLmdyb3VwaW5nO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci50aG91c2FuZFNlcGFyYXRvciA9IHRoaXMudGhvdXNhbmRTZXBhcmF0b3I7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaW1hZ2UnOlxuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5pbWFnZVR5cGUgPSB0aGlzLmltYWdlVHlwZTtcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIuYXZhdGFyID0gdGhpcy5hdmF0YXI7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmVtcHR5SW1hZ2UgPSB0aGlzLmVtcHR5SW1hZ2U7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYWN0aW9uJzpcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIuaWNvbiA9IHRoaXMuaWNvbjtcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIuYWN0aW9uID0gdGhpcy5hY3Rpb247XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLnRleHQgPSB0aGlzLnRleHQ7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLmljb25Qb3NpdGlvbiA9IHRoaXMuaWNvblBvc2l0aW9uO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5vbkNsaWNrID0gdGhpcy5vbkNsaWNrO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3NlcnZpY2UnOlxuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5lbnRpdHkgPSB0aGlzLmVudGl0eTtcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIuc2VydmljZSA9IHRoaXMuc2VydmljZTtcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIuY29sdW1ucyA9IHRoaXMuY29sdW1ucztcbiAgICAgICAgICAgICAgbmV3UmVuZGVyZXIudmFsdWVDb2x1bW4gPSB0aGlzLnZhbHVlQ29sdW1uO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5wYXJlbnRLZXlzID0gdGhpcy5wYXJlbnRLZXlzO1xuICAgICAgICAgICAgICBuZXdSZW5kZXJlci5xdWVyeU1ldGhvZCA9IHRoaXMucXVlcnlNZXRob2Q7XG4gICAgICAgICAgICAgIG5ld1JlbmRlcmVyLnNlcnZpY2VUeXBlID0gdGhpcy5zZXJ2aWNlVHlwZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0cmFuc2xhdGUnOlxuICAgICAgICAgICAgICBuZXdSZW5kZXJlci50cmFuc2xhdGVBcmdzRm4gPSB0aGlzLnRyYW5zbGF0ZUFyZ3NGbjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucmVnaXN0ZXJSZW5kZXJlcihuZXdSZW5kZXJlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBidWlsZENlbGxFZGl0b3IodHlwZTogc3RyaW5nLCByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBjb250YWluZXI6IFZpZXdDb250YWluZXJSZWYsIHByb3BzT3JpZ2luOiBhbnkpIHtcbiAgICBsZXQgZWRpdG9yO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlZiA9IGVkaXRvcnNNYXBwaW5nW3R5cGVdIHx8IGVkaXRvcnNNYXBwaW5nLnRleHQ7XG4gICAgaWYgKGNvbXBvbmVudFJlZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZWRpdG9yO1xuICAgIH1cbiAgICBjb25zdCBmYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5PGFueT4gPSByZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShjb21wb25lbnRSZWYpO1xuICAgIGlmIChmYWN0b3J5KSB7XG4gICAgICBjb25zdCByZWYgPSBjb250YWluZXIuY3JlYXRlQ29tcG9uZW50KGZhY3RvcnkpO1xuICAgICAgZWRpdG9yID0gcmVmLmluc3RhbmNlO1xuICAgICAgaWYgKHByb3BzT3JpZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgICAgICBlZGl0b3IuZm9ybWF0ID0gcHJvcHNPcmlnaW4uZm9ybWF0O1xuICAgICAgICAgICAgZWRpdG9yLmxvY2FsZSA9IHByb3BzT3JpZ2luLmxvY2FsZTtcbiAgICAgICAgICAgIGVkaXRvci5vU3RhcnRWaWV3ID0gcHJvcHNPcmlnaW4ub1N0YXJ0VmlldztcbiAgICAgICAgICAgIGVkaXRvci5vTWluRGF0ZSA9IHByb3BzT3JpZ2luLm9NaW5EYXRlO1xuICAgICAgICAgICAgZWRpdG9yLm9NYXhEYXRlID0gcHJvcHNPcmlnaW4ub01heERhdGU7XG4gICAgICAgICAgICBlZGl0b3Iub1RvdWNoVWkgPSBwcm9wc09yaWdpbi5vVG91Y2hVaTtcbiAgICAgICAgICAgIGVkaXRvci5vU3RhcnRBdCA9IHByb3BzT3JpZ2luLm9TdGFydEF0O1xuICAgICAgICAgICAgZWRpdG9yLmZpbHRlckRhdGUgPSBwcm9wc09yaWdpbi5maWx0ZXJEYXRlO1xuICAgICAgICAgICAgZWRpdG9yLmRhdGVWYWx1ZVR5cGUgPSBwcm9wc09yaWdpbi5kYXRlVmFsdWVUeXBlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAndGltZSc6XG4gICAgICAgICAgICBlZGl0b3Iub0RhdGVGb3JtYXQgPSBwcm9wc09yaWdpbi5vRGF0ZUZvcm1hdDtcbiAgICAgICAgICAgIGVkaXRvci5vSG91ckZvcm1hdCA9IHByb3BzT3JpZ2luLm9Ib3VyRm9ybWF0O1xuICAgICAgICAgICAgZWRpdG9yLm9EYXRlTG9jYWxlID0gcHJvcHNPcmlnaW4ub0RhdGVMb2NhbGU7XG4gICAgICAgICAgICBlZGl0b3Iub01pbkRhdGUgPSBwcm9wc09yaWdpbi5vTWluRGF0ZTtcbiAgICAgICAgICAgIGVkaXRvci5vTWF4RGF0ZSA9IHByb3BzT3JpZ2luLm9NYXhEYXRlO1xuXG4gICAgICAgICAgICBlZGl0b3Iub1RvdWNoVWkgPSBwcm9wc09yaWdpbi5vVG91Y2hVaTtcbiAgICAgICAgICAgIGVkaXRvci5vRGF0ZVN0YXJ0QXQgPSBwcm9wc09yaWdpbi5vRGF0ZVN0YXJ0QXQ7XG4gICAgICAgICAgICBlZGl0b3Iub0RhdGVUZXh0SW5wdXRFbmFibGVkID0gcHJvcHNPcmlnaW4ub0RhdGVUZXh0SW5wdXRFbmFibGVkO1xuXG4gICAgICAgICAgICBlZGl0b3Iub0hvdXJNaW4gPSBwcm9wc09yaWdpbi5vSG91ck1pbjtcbiAgICAgICAgICAgIGVkaXRvci5vSG91ck1heCA9IHByb3BzT3JpZ2luLm9Ib3VyTWF4O1xuICAgICAgICAgICAgZWRpdG9yLm9Ib3VyVGV4dElucHV0RW5hYmxlZCA9IHByb3BzT3JpZ2luLm9Ib3VyVGV4dElucHV0RW5hYmxlZDtcbiAgICAgICAgICAgIGVkaXRvci5vSG91clBsYWNlaG9sZGVyID0gcHJvcHNPcmlnaW4ub0hvdXJQbGFjZWhvbGRlcjtcbiAgICAgICAgICAgIGVkaXRvci5vRGF0ZVBsYWNlaG9sZGVyID0gcHJvcHNPcmlnaW4ub0RhdGVQbGFjZWhvbGRlcjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgZWRpdG9yLmJvb2xlYW5UeXBlID0gcHJvcHNPcmlnaW4uYm9vbGVhblR5cGU7XG4gICAgICAgICAgICBlZGl0b3IuaW5kZXRlcm1pbmF0ZU9uTnVsbCA9IHByb3BzT3JpZ2luLmluZGV0ZXJtaW5hdGVPbk51bGw7XG4gICAgICAgICAgICBlZGl0b3IuYXV0b0NvbW1pdCA9IHByb3BzT3JpZ2luLmF1dG9Db21taXQ7XG4gICAgICAgICAgICBlZGl0b3IudHJ1ZVZhbHVlID0gcHJvcHNPcmlnaW4udHJ1ZVZhbHVlO1xuICAgICAgICAgICAgZWRpdG9yLmZhbHNlVmFsdWUgPSBwcm9wc09yaWdpbi5mYWxzZVZhbHVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICAgICAgY2FzZSAncGVyY2VudGFnZSc6XG4gICAgICAgICAgY2FzZSAnY3VycmVuY3knOlxuICAgICAgICAgIGNhc2UgJ3JlYWwnOlxuICAgICAgICAgICAgZWRpdG9yLm1pbiA9IHByb3BzT3JpZ2luLm1pbjtcbiAgICAgICAgICAgIGVkaXRvci5tYXggPSBwcm9wc09yaWdpbi5tYXg7XG4gICAgICAgICAgICBlZGl0b3Iuc3RlcCA9IFV0aWwuaXNEZWZpbmVkKHByb3BzT3JpZ2luLnN0ZXApID8gcHJvcHNPcmlnaW4uc3RlcCA6IGVkaXRvci5zdGVwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnaW1hZ2UnOlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGVkaXRvci5vbGFiZWwgPSBwcm9wc09yaWdpbi5vbGFiZWw7XG4gICAgICAgIGVkaXRvci50eXBlID0gcHJvcHNPcmlnaW4udHlwZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVkaXRvcjtcbiAgfVxuXG4gIHByb3RlY3RlZCBjcmVhdGVFZGl0b3IoKSB7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh0aGlzLmVkaXRvcikgJiYgdGhpcy5lZGl0YWJsZSkge1xuICAgICAgY29uc3QgbmV3RWRpdG9yID0gdGhpcy5idWlsZENlbGxFZGl0b3IodGhpcy50eXBlLCB0aGlzLnJlc29sdmVyLCB0aGlzLmNvbnRhaW5lciwgdGhpcyk7XG4gICAgICBpZiAobmV3RWRpdG9yKSB7XG4gICAgICAgIG5ld0VkaXRvci5vcmVxdWlyZWQgPSB0aGlzLm9yZXF1aXJlZDtcbiAgICAgICAgbmV3RWRpdG9yLnNob3dQbGFjZUhvbGRlciA9IHRoaXMuc2hvd1BsYWNlSG9sZGVyO1xuICAgICAgICBuZXdFZGl0b3IudXBkYXRlUmVjb3JkT25FZGl0ID0gdGhpcy51cGRhdGVSZWNvcmRPbkVkaXQ7XG4gICAgICAgIG5ld0VkaXRvci5zaG93Tm90aWZpY2F0aW9uT25FZGl0ID0gdGhpcy5zaG93Tm90aWZpY2F0aW9uT25FZGl0O1xuICAgICAgICBuZXdFZGl0b3IuZWRpdGlvblN0YXJ0ZWQgPSB0aGlzLmVkaXRpb25TdGFydGVkO1xuICAgICAgICBuZXdFZGl0b3IuZWRpdGlvbkNhbmNlbGxlZCA9IHRoaXMuZWRpdGlvbkNhbmNlbGxlZDtcbiAgICAgICAgbmV3RWRpdG9yLmVkaXRpb25Db21taXR0ZWQgPSB0aGlzLmVkaXRpb25Db21taXR0ZWQ7XG4gICAgICAgIG5ld0VkaXRvci5vblBvc3RVcGRhdGVSZWNvcmQgPSB0aGlzLm9uUG9zdFVwZGF0ZVJlY29yZDtcbiAgICAgICAgdGhpcy5yZWdpc3RlckVkaXRvcihuZXdFZGl0b3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlclJlbmRlcmVyKHJlbmRlcmVyOiBhbnkpIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG4gICAgY29uc3Qgb0NvbCA9IHRoaXMudGFibGUuZ2V0T0NvbHVtbih0aGlzLmF0dHIpO1xuICAgIGlmIChvQ29sICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG9Db2wucmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVyO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVyLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlckVkaXRvcihlZGl0b3I6IGFueSkge1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIGNvbnN0IG9Db2wgPSB0aGlzLnRhYmxlLmdldE9Db2x1bW4odGhpcy5hdHRyKTtcbiAgICBpZiAob0NvbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvQ29sLmVkaXRvciA9IHRoaXMuZWRpdG9yO1xuICAgIH1cbiAgICB0aGlzLmVkaXRvci5pbml0aWFsaXplKCk7XG4gIH1cblxuICBzZXQgb3JkZXJhYmxlKHZhbDogYW55KSB7XG4gICAgdGhpcy5fb3JkZXJhYmxlID0gdHlwZW9mIHZhbCA9PT0gJ2Jvb2xlYW4nID8gdmFsIDogVXRpbC5wYXJzZUJvb2xlYW4odmFsLCB0cnVlKTtcbiAgICBjb25zdCBvQ29sID0gdGhpcy50YWJsZS5nZXRPQ29sdW1uKHRoaXMuYXR0cik7XG4gICAgaWYgKG9Db2wpIHtcbiAgICAgIG9Db2wub3JkZXJhYmxlID0gdGhpcy5fb3JkZXJhYmxlO1xuICAgIH1cbiAgfVxuXG4gIGdldCBvcmRlcmFibGUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fb3JkZXJhYmxlO1xuICB9XG5cbiAgc2V0IHJlc2l6YWJsZSh2YWw6IGFueSkge1xuICAgIHRoaXMuX3Jlc2l6YWJsZSA9IHR5cGVvZiB2YWwgPT09ICdib29sZWFuJyA/IHZhbCA6IFV0aWwucGFyc2VCb29sZWFuKHZhbCwgdHJ1ZSk7XG4gICAgY29uc3Qgb0NvbCA9IHRoaXMudGFibGUuZ2V0T0NvbHVtbih0aGlzLmF0dHIpO1xuICAgIGlmIChvQ29sKSB7XG4gICAgICBvQ29sLnJlc2l6YWJsZSA9IHRoaXMuX3Jlc2l6YWJsZTtcbiAgICB9XG4gIH1cblxuICBnZXQgcmVzaXphYmxlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc2l6YWJsZTtcbiAgfVxuXG4gIHNldCBzZWFyY2hhYmxlKHZhbDogYW55KSB7XG4gICAgdGhpcy5fc2VhcmNoYWJsZSA9IHR5cGVvZiB2YWwgPT09ICdib29sZWFuJyA/IHZhbCA6IFV0aWwucGFyc2VCb29sZWFuKHZhbCwgdHJ1ZSk7XG4gICAgY29uc3Qgb0NvbCA9IHRoaXMudGFibGUuZ2V0T0NvbHVtbih0aGlzLmF0dHIpO1xuICAgIGlmIChvQ29sKSB7XG4gICAgICBvQ29sLnNlYXJjaGFibGUgPSB0aGlzLl9zZWFyY2hhYmxlO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzZWFyY2hhYmxlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlYXJjaGFibGU7XG4gIH1cblxuICBnZXRTUUxUeXBlKCk6IG51bWJlciB7XG4gICAgaWYgKCEodGhpcy5zcWxUeXBlICYmIHRoaXMuc3FsVHlwZS5sZW5ndGggPiAwKSkge1xuICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgICAgdGhpcy5zcWxUeXBlID0gJ1RJTUVTVEFNUCc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ludGVnZXInOlxuICAgICAgICAgIHRoaXMuc3FsVHlwZSA9ICdJTlRFR0VSJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgdGhpcy5zcWxUeXBlID0gJ0JPT0xFQU4nO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWFsJzpcbiAgICAgICAgY2FzZSAncGVyY2VudGFnZSc6XG4gICAgICAgIGNhc2UgJ2N1cnJlbmN5JzpcbiAgICAgICAgICB0aGlzLnNxbFR5cGUgPSAnRE9VQkxFJztcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgc3FsdCA9IHRoaXMuc3FsVHlwZSAmJiB0aGlzLnNxbFR5cGUubGVuZ3RoID4gMCA/IHRoaXMuc3FsVHlwZSA6IHRoaXMuX2RlZmF1bHRTUUxUeXBlS2V5O1xuICAgIHRoaXMuX1NRTFR5cGUgPSBTUUxUeXBlcy5nZXRTUUxUeXBlVmFsdWUoc3FsdCk7XG4gICAgcmV0dXJuIHRoaXMuX1NRTFR5cGU7XG4gIH1cblxuICBzZXQgZmlsdGVyU291cmNlKHZhbDogc3RyaW5nKSB7XG4gICAgY29uc3QgbG93ZXJWYWwgPSAodmFsIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMuX2ZpbHRlclNvdXJjZSA9IChsb3dlclZhbCA9PT0gJ3JlbmRlcicgfHwgbG93ZXJWYWwgPT09ICdkYXRhJyB8fCBsb3dlclZhbCA9PT0gJ2JvdGgnKSA/IGxvd2VyVmFsIDogJ3JlbmRlcic7XG4gIH1cblxuICBnZXQgZmlsdGVyU291cmNlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpbHRlclNvdXJjZTtcbiAgfVxufVxuIl19