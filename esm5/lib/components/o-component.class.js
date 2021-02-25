import { BooleanConverter } from '../decorators/input-converter';
import { OTranslateService } from '../services/translate/o-translate.service';
import { PermissionsUtils } from '../util/permissions';
import { Util } from '../util/util';
var OBaseComponent = (function () {
    function OBaseComponent(injector) {
        this._enabled = true;
        this._orequired = false;
        this._tooltipPosition = 'below';
        this._tooltipShowDelay = 500;
        this._tooltipHideDelay = 0;
        this.injector = injector;
        if (this.injector) {
            this.translateService = this.injector.get(OTranslateService);
        }
    }
    OBaseComponent.prototype.initialize = function () {
        if (!Util.isDefined(this._olabel)) {
            this._olabel = this.oattr;
        }
        if (Util.isDefined(this.oplaceholder) && this.oplaceholder.length > 0) {
            this.oplaceholder = this.translateService.get(this.oplaceholder);
        }
    };
    OBaseComponent.prototype.getAttribute = function () {
        if (this.oattr) {
            return this.oattr;
        }
        return undefined;
    };
    OBaseComponent.prototype.setEnabled = function (value) {
        if (!PermissionsUtils.checkEnabledPermission(this.permissions)) {
            return;
        }
        var parsedValue = BooleanConverter(value);
        this._enabled = parsedValue;
    };
    Object.defineProperty(OBaseComponent.prototype, "placeHolder", {
        get: function () {
            return this.oplaceholder;
        },
        set: function (value) {
            this.oplaceholder = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseComponent.prototype, "tooltipClass", {
        get: function () {
            return this.getTooltipClass();
        },
        enumerable: true,
        configurable: true
    });
    OBaseComponent.prototype.getTooltipClass = function () {
        return "o-tooltip " + this.tooltipPosition;
    };
    OBaseComponent.prototype.getTooltipText = function () {
        if (Util.isDefined(this._tooltip) && this.translateService) {
            return this.translateService.get(this._tooltip);
        }
        return this._tooltip;
    };
    Object.defineProperty(OBaseComponent.prototype, "tooltip", {
        get: function () {
            return this.getTooltipText();
        },
        set: function (value) {
            this._tooltip = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseComponent.prototype, "tooltipPosition", {
        get: function () {
            return this._tooltipPosition;
        },
        set: function (value) {
            this._tooltipPosition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseComponent.prototype, "tooltipShowDelay", {
        get: function () {
            return this._tooltipShowDelay;
        },
        set: function (value) {
            this._tooltipShowDelay = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseComponent.prototype, "tooltipHideDelay", {
        get: function () {
            return this._tooltipHideDelay;
        },
        set: function (value) {
            this._tooltipHideDelay = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseComponent.prototype, "isReadOnly", {
        get: function () {
            return this._isReadOnly;
        },
        set: function (value) {
            this.setIsReadOnly(value);
        },
        enumerable: true,
        configurable: true
    });
    OBaseComponent.prototype.setIsReadOnly = function (value) {
        if (Util.isDefined(this.readOnly)) {
            return;
        }
        if (!this.enabled) {
            this._isReadOnly = false;
            return;
        }
        if (!PermissionsUtils.checkEnabledPermission(this.permissions)) {
            return;
        }
        this._isReadOnly = value;
    };
    Object.defineProperty(OBaseComponent.prototype, "readOnly", {
        get: function () {
            return this._readOnly;
        },
        set: function (value) {
            if (!PermissionsUtils.checkEnabledPermission(this.permissions)) {
                return;
            }
            var parsedValue = BooleanConverter(value);
            this._readOnly = parsedValue;
            this._isReadOnly = parsedValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseComponent.prototype, "orequired", {
        get: function () {
            return this._orequired;
        },
        set: function (val) {
            this._orequired = BooleanConverter(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseComponent.prototype, "isRequired", {
        get: function () {
            return this.orequired;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseComponent.prototype, "required", {
        set: function (value) {
            this.orequired = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseComponent.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            var parsedValue = BooleanConverter(value);
            this.setEnabled(parsedValue);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseComponent.prototype, "olabel", {
        get: function () {
            return this._olabel;
        },
        set: function (value) {
            this._olabel = value;
        },
        enumerable: true,
        configurable: true
    });
    return OBaseComponent;
}());
export { OBaseComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb21wb25lbnQuY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvby1jb21wb25lbnQuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFakUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFFOUUsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUVwQztJQXFCRSx3QkFBWSxRQUFrQjtRQWZwQixhQUFRLEdBQVksSUFBSSxDQUFDO1FBRXpCLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFRNUIscUJBQWdCLEdBQVcsT0FBTyxDQUFDO1FBQ25DLHNCQUFpQixHQUFXLEdBQUcsQ0FBQztRQUNoQyxzQkFBaUIsR0FBVyxDQUFDLENBQUM7UUFJdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBb0IsaUJBQWlCLENBQUMsQ0FBQztTQUNqRjtJQUNILENBQUM7SUFFTSxtQ0FBVSxHQUFqQjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDM0I7UUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyRSxJQUFJLENBQUMsWUFBWSxHQUFHLElB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QyxPQUFPLENBQUM7UUFDdEIsQ0FBQzthQUVELFVBQVcsS0FBYTtZQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDOzs7T0FKQTtJQU1ILHFCQUFDO0FBQUQsQ0FBQyxBQWhMRCxJQWdMQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEJvb2xlYW5Db252ZXJ0ZXIgfSBmcm9tICcuLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBJQ29tcG9uZW50IH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvdHJhbnNsYXRlL28tdHJhbnNsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1Blcm1pc3Npb25zIH0gZnJvbSAnLi4vdHlwZXMvby1wZXJtaXNzaW9ucy50eXBlJztcbmltcG9ydCB7IFBlcm1pc3Npb25zVXRpbHMgfSBmcm9tICcuLi91dGlsL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgY2xhc3MgT0Jhc2VDb21wb25lbnQgaW1wbGVtZW50cyBJQ29tcG9uZW50IHtcblxuICAvKiBJbnB1dHMgKi9cbiAgcHJvdGVjdGVkIG9hdHRyOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfb2xhYmVsOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBvcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9lbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgcHJvdGVjdGVkIF9yZWFkT25seTogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIF9vcmVxdWlyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiBJbnRlcm5hbCB2YXJpYWJsZXMgKi9cbiAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcjtcbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuXG4gIHByb3RlY3RlZCBfaXNSZWFkT25seTogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIF90b29sdGlwOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfdG9vbHRpcFBvc2l0aW9uOiBzdHJpbmcgPSAnYmVsb3cnO1xuICBwcm90ZWN0ZWQgX3Rvb2x0aXBTaG93RGVsYXk6IG51bWJlciA9IDUwMDtcbiAgcHJvdGVjdGVkIF90b29sdGlwSGlkZURlbGF5OiBudW1iZXIgPSAwO1xuICBwcm90ZWN0ZWQgcGVybWlzc2lvbnM6IE9QZXJtaXNzaW9ucztcblxuICBjb25zdHJ1Y3RvcihpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLmluamVjdG9yID0gaW5qZWN0b3I7XG4gICAgaWYgKHRoaXMuaW5qZWN0b3IpIHtcbiAgICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0PE9UcmFuc2xhdGVTZXJ2aWNlPihPVHJhbnNsYXRlU2VydmljZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh0aGlzLl9vbGFiZWwpKSB7XG4gICAgICB0aGlzLl9vbGFiZWwgPSB0aGlzLm9hdHRyO1xuICAgIH1cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5vcGxhY2Vob2xkZXIpICYmIHRoaXMub3BsYWNlaG9sZGVyLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMub3BsYWNlaG9sZGVyID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldCh0aGlzLm9wbGFjZWhvbGRlcik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldEF0dHJpYnV0ZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLm9hdHRyKSB7XG4gICAgICByZXR1cm4gdGhpcy5vYXR0cjtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBzZXRFbmFibGVkKHZhbHVlOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKCFQZXJtaXNzaW9uc1V0aWxzLmNoZWNrRW5hYmxlZFBlcm1pc3Npb24odGhpcy5wZXJtaXNzaW9ucykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGFyc2VkVmFsdWUgPSBCb29sZWFuQ29udmVydGVyKHZhbHVlKTtcbiAgICB0aGlzLl9lbmFibGVkID0gcGFyc2VkVmFsdWU7XG4gIH1cblxuICBnZXQgcGxhY2VIb2xkZXIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vcGxhY2Vob2xkZXI7XG4gIH1cblxuICBzZXQgcGxhY2VIb2xkZXIodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMub3BsYWNlaG9sZGVyID0gdmFsdWU7XG4gIH1cblxuICBnZXQgdG9vbHRpcENsYXNzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VG9vbHRpcENsYXNzKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0VG9vbHRpcENsYXNzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBvLXRvb2x0aXAgJHt0aGlzLnRvb2x0aXBQb3NpdGlvbn1gO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldFRvb2x0aXBUZXh0KCk6IHN0cmluZyB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuX3Rvb2x0aXApICYmIHRoaXMudHJhbnNsYXRlU2VydmljZSkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQodGhpcy5fdG9vbHRpcCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl90b29sdGlwO1xuICB9XG5cbiAgZ2V0IHRvb2x0aXAoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUb29sdGlwVGV4dCgpO1xuICB9XG5cbiAgc2V0IHRvb2x0aXAodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3Rvb2x0aXAgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB0b29sdGlwUG9zaXRpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdG9vbHRpcFBvc2l0aW9uO1xuICB9XG5cbiAgc2V0IHRvb2x0aXBQb3NpdGlvbih2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdG9vbHRpcFBvc2l0aW9uID0gdmFsdWU7XG4gIH1cblxuICBnZXQgdG9vbHRpcFNob3dEZWxheSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl90b29sdGlwU2hvd0RlbGF5O1xuICB9XG5cbiAgc2V0IHRvb2x0aXBTaG93RGVsYXkodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3Rvb2x0aXBTaG93RGVsYXkgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB0b29sdGlwSGlkZURlbGF5KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3Rvb2x0aXBIaWRlRGVsYXk7XG4gIH1cblxuICBzZXQgdG9vbHRpcEhpZGVEZWxheSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fdG9vbHRpcEhpZGVEZWxheSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGlzUmVhZE9ubHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzUmVhZE9ubHk7XG4gIH1cblxuICBzZXQgaXNSZWFkT25seSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0SXNSZWFkT25seSh2YWx1ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0SXNSZWFkT25seSh2YWx1ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIC8vIG9ubHkgbW9kaWZpeW5nIHJlYWQgb25seSBzdGF0ZSBpZiB0aGUgY29tcG9uZW50IGhhcyBub3QgaXRzIG93biByZWFkLW9ubHkgaW5wdXRcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5yZWFkT25seSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuX2lzUmVhZE9ubHkgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFQZXJtaXNzaW9uc1V0aWxzLmNoZWNrRW5hYmxlZFBlcm1pc3Npb24odGhpcy5wZXJtaXNzaW9ucykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5faXNSZWFkT25seSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHJlYWRPbmx5KCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlYWRPbmx5O1xuICB9XG5cbiAgc2V0IHJlYWRPbmx5KHZhbHVlOiBhbnkpIHtcbiAgICBpZiAoIVBlcm1pc3Npb25zVXRpbHMuY2hlY2tFbmFibGVkUGVybWlzc2lvbih0aGlzLnBlcm1pc3Npb25zKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwYXJzZWRWYWx1ZSA9IEJvb2xlYW5Db252ZXJ0ZXIodmFsdWUpO1xuICAgIHRoaXMuX3JlYWRPbmx5ID0gcGFyc2VkVmFsdWU7XG4gICAgdGhpcy5faXNSZWFkT25seSA9IHBhcnNlZFZhbHVlO1xuICB9XG5cbiAgc2V0IG9yZXF1aXJlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9vcmVxdWlyZWQgPSBCb29sZWFuQ29udmVydGVyKHZhbCk7XG4gIH1cblxuICBnZXQgb3JlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9vcmVxdWlyZWQ7XG4gIH1cblxuICBnZXQgaXNSZXF1aXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vcmVxdWlyZWQ7XG4gIH1cblxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLm9yZXF1aXJlZCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGVuYWJsZWQoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcbiAgfVxuXG4gIHNldCBlbmFibGVkKHZhbHVlOiBhbnkpIHtcbiAgICBjb25zdCBwYXJzZWRWYWx1ZSA9IEJvb2xlYW5Db252ZXJ0ZXIodmFsdWUpO1xuICAgIHRoaXMuc2V0RW5hYmxlZChwYXJzZWRWYWx1ZSk7XG4gIH1cblxuICBnZXQgb2xhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX29sYWJlbDtcbiAgfVxuXG4gIHNldCBvbGFiZWwodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX29sYWJlbCA9IHZhbHVlO1xuICB9XG5cbn1cbiJdfQ==