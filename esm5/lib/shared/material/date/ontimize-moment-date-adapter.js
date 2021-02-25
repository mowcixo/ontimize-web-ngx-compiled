import * as tslib_1 from "tslib";
import { Inject, Injectable, Optional } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment_ from 'moment';
var moment = moment_;
var OntimizeMomentDateAdapter = (function (_super) {
    tslib_1.__extends(OntimizeMomentDateAdapter, _super);
    function OntimizeMomentDateAdapter(dateLocale) {
        return _super.call(this, dateLocale) || this;
    }
    OntimizeMomentDateAdapter.prototype.format = function (date, displayFormat) {
        return _super.prototype.format.call(this, date, this.oFormat || displayFormat);
    };
    OntimizeMomentDateAdapter.prototype.parse = function (value, parseFormat) {
        return _super.prototype.parse.call(this, value, this.oFormat || parseFormat);
    };
    OntimizeMomentDateAdapter.prototype.deserialize = function (value) {
        var date;
        if (typeof value === 'number') {
            date = moment(value);
        }
        if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            date = moment(value, this.oFormat).locale(this.locale);
        }
        if (date && this.isValid(date)) {
            return date;
        }
        return _super.prototype.deserialize.call(this, value);
    };
    OntimizeMomentDateAdapter.decorators = [
        { type: Injectable }
    ];
    OntimizeMomentDateAdapter.ctorParameters = function () { return [
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_LOCALE,] }] }
    ]; };
    return OntimizeMomentDateAdapter;
}(MomentDateAdapter));
export { OntimizeMomentDateAdapter };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib250aW1pemUtbW9tZW50LWRhdGUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2hhcmVkL21hdGVyaWFsL2RhdGUvb250aW1pemUtbW9tZW50LWRhdGUtYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUdsQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFFdkI7SUFDK0MscURBQWlCO0lBSTlELG1DQUFpRCxVQUFrQjtlQUNqRSxrQkFBTSxVQUFVLENBQUM7SUFDbkIsQ0FBQztJQUVELDBDQUFNLEdBQU4sVUFBTyxJQUFTLEVBQUUsYUFBcUI7UUFDckMsT0FBTyxpQkFBTSxNQUFNLFlBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksYUFBYSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELHlDQUFLLEdBQUwsVUFBTSxLQUFVLEVBQUUsV0FBOEI7UUFDOUMsT0FBTyxpQkFBTSxLQUFLLFlBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksV0FBVyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELCtDQUFXLEdBQVgsVUFBWSxLQUFVO1FBQ3BCLElBQUksSUFBSSxDQUFDO1FBQ1QsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QjtRQUNELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUNELElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxpQkFBTSxXQUFXLFlBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7Z0JBaENGLFVBQVU7Ozs2Q0FLSSxRQUFRLFlBQUksTUFBTSxTQUFDLGVBQWU7O0lBNEJqRCxnQ0FBQztDQUFBLEFBakNELENBQytDLGlCQUFpQixHQWdDL0Q7U0FoQ1kseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0RBVEVfTE9DQUxFIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgTW9tZW50RGF0ZUFkYXB0ZXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC1tb21lbnQtYWRhcHRlcic7XG5pbXBvcnQgKiBhcyBtb21lbnRfIGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBNb21lbnQgfSBmcm9tICdtb21lbnQnO1xuXG5jb25zdCBtb21lbnQgPSBtb21lbnRfO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgT250aW1pemVNb21lbnREYXRlQWRhcHRlciBleHRlbmRzIE1vbWVudERhdGVBZGFwdGVyIHtcblxuICBvRm9ybWF0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9MT0NBTEUpIGRhdGVMb2NhbGU6IHN0cmluZykge1xuICAgIHN1cGVyKGRhdGVMb2NhbGUpO1xuICB9XG5cbiAgZm9ybWF0KGRhdGU6IGFueSwgZGlzcGxheUZvcm1hdDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3VwZXIuZm9ybWF0KGRhdGUsIHRoaXMub0Zvcm1hdCB8fCBkaXNwbGF5Rm9ybWF0KTtcbiAgfVxuXG4gIHBhcnNlKHZhbHVlOiBhbnksIHBhcnNlRm9ybWF0OiBzdHJpbmcgfCBzdHJpbmdbXSk6IGFueSB8IG51bGwge1xuICAgIHJldHVybiBzdXBlci5wYXJzZSh2YWx1ZSwgdGhpcy5vRm9ybWF0IHx8IHBhcnNlRm9ybWF0KTtcbiAgfVxuXG4gIGRlc2VyaWFsaXplKHZhbHVlOiBhbnkpOiBNb21lbnQgfCBudWxsIHtcbiAgICBsZXQgZGF0ZTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgZGF0ZSA9IG1vbWVudCh2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgZGF0ZSA9IG1vbWVudCh2YWx1ZSwgdGhpcy5vRm9ybWF0KS5sb2NhbGUodGhpcy5sb2NhbGUpO1xuICAgIH1cbiAgICBpZiAoZGF0ZSAmJiB0aGlzLmlzVmFsaWQoZGF0ZSkpIHtcbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIuZGVzZXJpYWxpemUodmFsdWUpO1xuICB9XG59XG4iXX0=