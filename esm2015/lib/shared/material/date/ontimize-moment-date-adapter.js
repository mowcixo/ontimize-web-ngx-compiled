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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib250aW1pemUtbW9tZW50LWRhdGUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2hhcmVkL21hdGVyaWFsL2RhdGUvb250aW1pemUtbW9tZW50LWRhdGUtYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3JFLE9BQU8sTUFBa0IsTUFBTSxRQUFRLENBQUM7QUFHeEMsTUFBTSxPQUFPLHlCQUEwQixTQUFRLGlCQUFpQjtJQUk5RCxZQUFpRCxVQUFrQjtRQUNqRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFTLEVBQUUsYUFBcUI7UUFDckMsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLGFBQWEsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxLQUFLLENBQUMsS0FBVSxFQUFFLFdBQThCO1FBQzlDLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sSUFBSSxXQUFXLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQVU7UUFDcEIsSUFBSSxJQUFJLENBQUM7UUFDVCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3RCO1FBQ0QsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDVixPQUFPLElBQUksQ0FBQzthQUNiO1lBQ0QsSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDeEQ7UUFDRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzlCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7O1lBaENGLFVBQVU7Ozt5Q0FLSSxRQUFRLFlBQUksTUFBTSxTQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNQVRfREFURV9MT0NBTEUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBNb21lbnREYXRlQWRhcHRlciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsLW1vbWVudC1hZGFwdGVyJztcbmltcG9ydCBtb21lbnQsIHsgTW9tZW50IH0gZnJvbSAnbW9tZW50JztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE9udGltaXplTW9tZW50RGF0ZUFkYXB0ZXIgZXh0ZW5kcyBNb21lbnREYXRlQWRhcHRlciB7XG5cbiAgb0Zvcm1hdDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0RBVEVfTE9DQUxFKSBkYXRlTG9jYWxlOiBzdHJpbmcpIHtcbiAgICBzdXBlcihkYXRlTG9jYWxlKTtcbiAgfVxuXG4gIGZvcm1hdChkYXRlOiBhbnksIGRpc3BsYXlGb3JtYXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHN1cGVyLmZvcm1hdChkYXRlLCB0aGlzLm9Gb3JtYXQgfHwgZGlzcGxheUZvcm1hdCk7XG4gIH1cblxuICBwYXJzZSh2YWx1ZTogYW55LCBwYXJzZUZvcm1hdDogc3RyaW5nIHwgc3RyaW5nW10pOiBhbnkgfCBudWxsIHtcbiAgICByZXR1cm4gc3VwZXIucGFyc2UodmFsdWUsIHRoaXMub0Zvcm1hdCB8fCBwYXJzZUZvcm1hdCk7XG4gIH1cblxuICBkZXNlcmlhbGl6ZSh2YWx1ZTogYW55KTogTW9tZW50IHwgbnVsbCB7XG4gICAgbGV0IGRhdGU7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGRhdGUgPSBtb21lbnQodmFsdWUpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGRhdGUgPSBtb21lbnQodmFsdWUsIHRoaXMub0Zvcm1hdCkubG9jYWxlKHRoaXMubG9jYWxlKTtcbiAgICB9XG4gICAgaWYgKGRhdGUgJiYgdGhpcy5pc1ZhbGlkKGRhdGUpKSB7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLmRlc2VyaWFsaXplKHZhbHVlKTtcbiAgfVxufSJdfQ==