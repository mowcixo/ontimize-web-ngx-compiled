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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib250aW1pemUtbW9tZW50LWRhdGUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2hhcmVkL21hdGVyaWFsL2RhdGUvb250aW1pemUtbW9tZW50LWRhdGUtYWRhcHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUVsQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFFdkI7SUFDK0MscURBQWlCO0lBSTlELG1DQUFpRCxVQUFrQjtlQUNqRSxrQkFBTSxVQUFVLENBQUM7SUFDbkIsQ0FBQztJQUVELDBDQUFNLEdBQU4sVUFBTyxJQUFTLEVBQUUsYUFBcUI7UUFDckMsT0FBTyxpQkFBTSxNQUFNLFlBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksYUFBYSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELHlDQUFLLEdBQUwsVUFBTSxLQUFVLEVBQUUsV0FBOEI7UUFDOUMsT0FBTyxpQkFBTSxLQUFLLFlBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksV0FBVyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELCtDQUFXLEdBQVgsVUFBWSxLQUFVO1FBQ3BCLElBQUksSUFBSSxDQUFDO1FBQ1QsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QjtRQUNELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUNELElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxpQkFBTSxXQUFXLFlBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7Z0JBaENGLFVBQVU7Ozs2Q0FLSSxRQUFRLFlBQUksTUFBTSxTQUFDLGVBQWU7O0lBNEJqRCxnQ0FBQztDQUFBLEFBakNELENBQytDLGlCQUFpQixHQWdDL0Q7U0FoQ1kseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0RBVEVfTE9DQUxFIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgTW9tZW50RGF0ZUFkYXB0ZXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC1tb21lbnQtYWRhcHRlcic7XG5pbXBvcnQgKiBhcyBtb21lbnRfIGZyb20gJ21vbWVudCc7XG5cbmNvbnN0IG1vbWVudCA9IG1vbWVudF87XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBPbnRpbWl6ZU1vbWVudERhdGVBZGFwdGVyIGV4dGVuZHMgTW9tZW50RGF0ZUFkYXB0ZXIge1xuXG4gIG9Gb3JtYXQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EQVRFX0xPQ0FMRSkgZGF0ZUxvY2FsZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoZGF0ZUxvY2FsZSk7XG4gIH1cblxuICBmb3JtYXQoZGF0ZTogYW55LCBkaXNwbGF5Rm9ybWF0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBzdXBlci5mb3JtYXQoZGF0ZSwgdGhpcy5vRm9ybWF0IHx8IGRpc3BsYXlGb3JtYXQpO1xuICB9XG5cbiAgcGFyc2UodmFsdWU6IGFueSwgcGFyc2VGb3JtYXQ6IHN0cmluZyB8IHN0cmluZ1tdKTogYW55IHwgbnVsbCB7XG4gICAgcmV0dXJuIHN1cGVyLnBhcnNlKHZhbHVlLCB0aGlzLm9Gb3JtYXQgfHwgcGFyc2VGb3JtYXQpO1xuICB9XG5cbiAgZGVzZXJpYWxpemUodmFsdWU6IGFueSk6IGFueSB8IG51bGwge1xuICAgIGxldCBkYXRlO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICBkYXRlID0gbW9tZW50KHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBkYXRlID0gbW9tZW50KHZhbHVlLCB0aGlzLm9Gb3JtYXQpLmxvY2FsZSh0aGlzLmxvY2FsZSk7XG4gICAgfVxuICAgIGlmIChkYXRlICYmIHRoaXMuaXNWYWxpZChkYXRlKSkge1xuICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICAgIHJldHVybiBzdXBlci5kZXNlcmlhbGl6ZSh2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==