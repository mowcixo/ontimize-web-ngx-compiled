import { Inject, Injectable, Optional } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
export class OntimizeMomentDateAdapter extends MomentDateAdapter {
    constructor(dateLocale) {
        super(dateLocale);
    }
    format(date, displayFormat) {
        return super.format(date, this.oFormat || displayFormat);
    }
    parse(value, parseFormat) {
        return super.parse(value, this.oFormat || parseFormat);
    }
    deserialize(value) {
        let date;
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
        return super.deserialize(value);
    }
}
OntimizeMomentDateAdapter.decorators = [
    { type: Injectable }
];
OntimizeMomentDateAdapter.ctorParameters = () => [
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_LOCALE,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib250aW1pemUtbW9tZW50LWRhdGUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2hhcmVkL21hdGVyaWFsL2RhdGUvb250aW1pemUtbW9tZW50LWRhdGUtYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3JFLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUc1QixNQUFNLE9BQU8seUJBQTBCLFNBQVEsaUJBQWlCO0lBSTlELFlBQWlELFVBQWtCO1FBQ2pFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQVMsRUFBRSxhQUFxQjtRQUNyQyxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksYUFBYSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFVLEVBQUUsV0FBOEI7UUFDOUMsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxXQUFXLENBQUMsS0FBVTtRQUNwQixJQUFJLElBQUksQ0FBQztRQUNULElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdEI7UUFDRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNWLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN4RDtRQUNELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQyxDQUFDOzs7WUFoQ0YsVUFBVTs7O3lDQUtJLFFBQVEsWUFBSSxNQUFNLFNBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1BVF9EQVRFX0xPQ0FMRSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IE1vbWVudERhdGVBZGFwdGVyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwtbW9tZW50LWFkYXB0ZXInO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgT250aW1pemVNb21lbnREYXRlQWRhcHRlciBleHRlbmRzIE1vbWVudERhdGVBZGFwdGVyIHtcblxuICBvRm9ybWF0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9MT0NBTEUpIGRhdGVMb2NhbGU6IHN0cmluZykge1xuICAgIHN1cGVyKGRhdGVMb2NhbGUpO1xuICB9XG5cbiAgZm9ybWF0KGRhdGU6IGFueSwgZGlzcGxheUZvcm1hdDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3VwZXIuZm9ybWF0KGRhdGUsIHRoaXMub0Zvcm1hdCB8fCBkaXNwbGF5Rm9ybWF0KTtcbiAgfVxuXG4gIHBhcnNlKHZhbHVlOiBhbnksIHBhcnNlRm9ybWF0OiBzdHJpbmcgfCBzdHJpbmdbXSk6IGFueSB8IG51bGwge1xuICAgIHJldHVybiBzdXBlci5wYXJzZSh2YWx1ZSwgdGhpcy5vRm9ybWF0IHx8IHBhcnNlRm9ybWF0KTtcbiAgfVxuXG4gIGRlc2VyaWFsaXplKHZhbHVlOiBhbnkpOiBhbnkgfCBudWxsIHtcbiAgICBsZXQgZGF0ZTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgZGF0ZSA9IG1vbWVudCh2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgZGF0ZSA9IG1vbWVudCh2YWx1ZSwgdGhpcy5vRm9ybWF0KS5sb2NhbGUodGhpcy5sb2NhbGUpO1xuICAgIH1cbiAgICBpZiAoZGF0ZSAmJiB0aGlzLmlzVmFsaWQoZGF0ZSkpIHtcbiAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIuZGVzZXJpYWxpemUodmFsdWUpO1xuICB9XG59XG4iXX0=