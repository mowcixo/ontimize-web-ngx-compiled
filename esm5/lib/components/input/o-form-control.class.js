import * as tslib_1 from "tslib";
import { FormControl } from '@angular/forms';
var OFormControl = (function (_super) {
    tslib_1.__extends(OFormControl, _super);
    function OFormControl(formState, validatorOrOpts, asyncValidator) {
        if (formState === void 0) { formState = null; }
        return _super.call(this, formState, validatorOrOpts, asyncValidator) || this;
    }
    OFormControl.prototype.markAsTouched = function (opts) {
        if (opts === void 0) { opts = {}; }
        _super.prototype.markAsTouched.call(this, opts);
        if (!this.fControlChildren) {
            return;
        }
        this.fControlChildren.forEach(function (x) {
            if (x instanceof FormControl) {
                x.markAsTouched(opts);
            }
            else if (x.getFormControl()) {
                x.getFormControl().markAsTouched();
            }
        });
    };
    OFormControl.prototype.markAsDirty = function (opts) {
        if (opts === void 0) { opts = {}; }
        _super.prototype.markAsDirty.call(this, opts);
        if (!this.fControlChildren) {
            return;
        }
        this.fControlChildren.forEach(function (x) {
            if (x instanceof FormControl) {
                x.markAsDirty(opts);
            }
            else if (x.getFormControl()) {
                x.getFormControl().markAsDirty();
            }
        });
    };
    OFormControl.prototype.markAsPristine = function (opts) {
        if (opts === void 0) { opts = {}; }
        _super.prototype.markAsPristine.call(this, opts);
        if (!this.fControlChildren) {
            return;
        }
        this.fControlChildren.forEach(function (x) {
            if (x instanceof FormControl) {
                x.markAsPristine(opts);
            }
            else if (x.getFormControl()) {
                x.getFormControl().markAsPristine();
            }
        });
    };
    OFormControl.prototype.getValue = function () {
        return this.value;
    };
    return OFormControl;
}(FormControl));
export { OFormControl };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWNvbnRyb2wuY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvby1mb3JtLWNvbnRyb2wuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBNEMsV0FBVyxFQUFlLE1BQU0sZ0JBQWdCLENBQUM7QUFJcEc7SUFBa0Msd0NBQVc7SUFHM0Msc0JBQ0UsU0FBcUIsRUFDckIsZUFBNkUsRUFDN0UsY0FBNkQ7UUFGN0QsMEJBQUEsRUFBQSxnQkFBcUI7ZUFJckIsa0JBQU0sU0FBUyxFQUFFLGVBQWUsRUFBRSxjQUFjLENBQUM7SUFDbkQsQ0FBQztJQUVELG9DQUFhLEdBQWIsVUFBYyxJQUFpQztRQUFqQyxxQkFBQSxFQUFBLFNBQWlDO1FBQzdDLGlCQUFNLGFBQWEsWUFBQyxJQUFJLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQzdCLElBQUksQ0FBQyxZQUFZLFdBQVcsRUFBRTtnQkFDNUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN2QjtpQkFBTSxJQUFJLENBQUMsQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDN0IsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQ3BDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsa0NBQVcsR0FBWCxVQUFZLElBQWlDO1FBQWpDLHFCQUFBLEVBQUEsU0FBaUM7UUFDM0MsaUJBQU0sV0FBVyxZQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7WUFDN0IsSUFBSSxDQUFDLFlBQVksV0FBVyxFQUFFO2dCQUM1QixDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JCO2lCQUFNLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUM3QixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDbEM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxxQ0FBYyxHQUFkLFVBQWUsSUFBaUM7UUFBakMscUJBQUEsRUFBQSxTQUFpQztRQUM5QyxpQkFBTSxjQUFjLFlBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztZQUM3QixJQUFJLENBQUMsWUFBWSxXQUFXLEVBQUU7Z0JBQzVCLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDeEI7aUJBQU0sSUFBSSxDQUFDLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBQzdCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUNyQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELCtCQUFRLEdBQVI7UUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUlILG1CQUFDO0FBQUQsQ0FBQyxBQTNERCxDQUFrQyxXQUFXLEdBMkQ1QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0Q29udHJvbE9wdGlvbnMsIEFzeW5jVmFsaWRhdG9yRm4sIEZvcm1Db250cm9sLCBWYWxpZGF0b3JGbiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgT0Zvcm1EYXRhQ29tcG9uZW50IH0gZnJvbSAnLi4vby1mb3JtLWRhdGEtY29tcG9uZW50LmNsYXNzJztcblxuZXhwb3J0IGNsYXNzIE9Gb3JtQ29udHJvbCBleHRlbmRzIEZvcm1Db250cm9sIHtcbiAgcHVibGljIGZDb250cm9sQ2hpbGRyZW46IChGb3JtQ29udHJvbCB8IE9Gb3JtRGF0YUNvbXBvbmVudClbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBmb3JtU3RhdGU6IGFueSA9IG51bGwsXG4gICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB8IG51bGwsXG4gICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbFxuICApIHtcbiAgICBzdXBlcihmb3JtU3RhdGUsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICB9XG5cbiAgbWFya0FzVG91Y2hlZChvcHRzOiB7IG9ubHlTZWxmPzogYm9vbGVhbiB9ID0ge30pOiB2b2lkIHtcbiAgICBzdXBlci5tYXJrQXNUb3VjaGVkKG9wdHMpO1xuICAgIGlmICghdGhpcy5mQ29udHJvbENoaWxkcmVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZkNvbnRyb2xDaGlsZHJlbi5mb3JFYWNoKHggPT4ge1xuICAgICAgaWYgKHggaW5zdGFuY2VvZiBGb3JtQ29udHJvbCkge1xuICAgICAgICB4Lm1hcmtBc1RvdWNoZWQob3B0cyk7XG4gICAgICB9IGVsc2UgaWYgKHguZ2V0Rm9ybUNvbnRyb2woKSkge1xuICAgICAgICB4LmdldEZvcm1Db250cm9sKCkubWFya0FzVG91Y2hlZCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbWFya0FzRGlydHkob3B0czogeyBvbmx5U2VsZj86IGJvb2xlYW4gfSA9IHt9KTogdm9pZCB7XG4gICAgc3VwZXIubWFya0FzRGlydHkob3B0cyk7XG4gICAgaWYgKCF0aGlzLmZDb250cm9sQ2hpbGRyZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5mQ29udHJvbENoaWxkcmVuLmZvckVhY2goeCA9PiB7XG4gICAgICBpZiAoeCBpbnN0YW5jZW9mIEZvcm1Db250cm9sKSB7XG4gICAgICAgIHgubWFya0FzRGlydHkob3B0cyk7XG4gICAgICB9IGVsc2UgaWYgKHguZ2V0Rm9ybUNvbnRyb2woKSkge1xuICAgICAgICB4LmdldEZvcm1Db250cm9sKCkubWFya0FzRGlydHkoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG1hcmtBc1ByaXN0aW5lKG9wdHM6IHsgb25seVNlbGY/OiBib29sZWFuIH0gPSB7fSk6IHZvaWQge1xuICAgIHN1cGVyLm1hcmtBc1ByaXN0aW5lKG9wdHMpO1xuICAgIGlmICghdGhpcy5mQ29udHJvbENoaWxkcmVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZkNvbnRyb2xDaGlsZHJlbi5mb3JFYWNoKHggPT4ge1xuICAgICAgaWYgKHggaW5zdGFuY2VvZiBGb3JtQ29udHJvbCkge1xuICAgICAgICB4Lm1hcmtBc1ByaXN0aW5lKG9wdHMpO1xuICAgICAgfSBlbHNlIGlmICh4LmdldEZvcm1Db250cm9sKCkpIHtcbiAgICAgICAgeC5nZXRGb3JtQ29udHJvbCgpLm1hcmtBc1ByaXN0aW5lKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuXG4gIC8qKnNldFZhbHVlKHZhbHVlOiBhbnksIG9wdGlvbnM6IHsgfSA9PiBOb3Qgb3ZlcnJpZGUgdGhpcyBtZXRob2QgYmVjYXVzZSB0aGVyZSBpcyBhIGNhc2Ugd2hlcmUgdGhlIGNoaWxkcmVuIGhhdmUgYSBkaWZmZXJlbnQgdmFsdWUgdGhhbiB0aGUgbWFpbiBvbmVcbiAgICovXG59XG4iXX0=