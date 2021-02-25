import * as tslib_1 from "tslib";
import { Inject, Injectable, Optional } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib250aW1pemUtbW9tZW50LWRhdGUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2hhcmVkL21hdGVyaWFsL2RhdGUvb250aW1pemUtbW9tZW50LWRhdGUtYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLE1BQWtCLE1BQU0sUUFBUSxDQUFDO0FBRXhDO0lBQytDLHFEQUFpQjtJQUk5RCxtQ0FBaUQsVUFBa0I7ZUFDakUsa0JBQU0sVUFBVSxDQUFDO0lBQ25CLENBQUM7SUFFRCwwQ0FBTSxHQUFOLFVBQU8sSUFBUyxFQUFFLGFBQXFCO1FBQ3JDLE9BQU8saUJBQU0sTUFBTSxZQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLGFBQWEsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCx5Q0FBSyxHQUFMLFVBQU0sS0FBVSxFQUFFLFdBQThCO1FBQzlDLE9BQU8saUJBQU0sS0FBSyxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCwrQ0FBVyxHQUFYLFVBQVksS0FBVTtRQUNwQixJQUFJLElBQUksQ0FBQztRQUNULElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdEI7UUFDRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNWLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN4RDtRQUNELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8saUJBQU0sV0FBVyxZQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7O2dCQWhDRixVQUFVOzs7NkNBS0ksUUFBUSxZQUFJLE1BQU0sU0FBQyxlQUFlOztJQTRCakQsZ0NBQUM7Q0FBQSxBQWpDRCxDQUMrQyxpQkFBaUIsR0FnQy9EO1NBaENZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1BVF9EQVRFX0xPQ0FMRSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IE1vbWVudERhdGVBZGFwdGVyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwtbW9tZW50LWFkYXB0ZXInO1xuaW1wb3J0IG1vbWVudCwgeyBNb21lbnQgfSBmcm9tICdtb21lbnQnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgT250aW1pemVNb21lbnREYXRlQWRhcHRlciBleHRlbmRzIE1vbWVudERhdGVBZGFwdGVyIHtcblxuICBvRm9ybWF0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9MT0NBTEUpIGRhdGVMb2NhbGU6IHN0cmluZykge1xuICAgIHN1cGVyKGRhdGVMb2NhbGUpO1xuICB9XG5cbiAgZm9ybWF0KGRhdGU6IGFueSwgZGlzcGxheUZvcm1hdDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3VwZXIuZm9ybWF0KGRhdGUsIHRoaXMub0Zvcm1hdCB8fCBkaXNwbGF5Rm9ybWF0KTtcbiAgfVxuXG4gIHBhcnNlKHZhbHVlOiBhbnksIHBhcnNlRm9ybWF0OiBzdHJpbmcgfCBzdHJpbmdbXSk6IGFueSB8IG51bGwge1xuICAgIHJldHVybiBzdXBlci5wYXJzZSh2YWx1ZSwgdGhpcy5vRm9ybWF0IHx8IHBhcnNlRm9ybWF0KTtcbiAgfVxuXG4gIGRlc2VyaWFsaXplKHZhbHVlOiBhbnkpOiBNb21lbnQgfCBudWxsIHtcbiAgICBsZXQgZGF0ZTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgZGF0ZSA9IG1vbWVudCh2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgZGF0ZSA9IG1vbWVudCh2YWx1ZSwgdGhpcy5vRm9ybWF0KS5sb2NhbGUodGhpcy5sb2NhbGUpO1xuICAgIH1cbiAgICBpZiAoZGF0ZSAmJiB0aGlzLmlzVmFsaWQoZGF0ZSkpIHtcbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIuZGVzZXJpYWxpemUodmFsdWUpO1xuICB9XG59Il19