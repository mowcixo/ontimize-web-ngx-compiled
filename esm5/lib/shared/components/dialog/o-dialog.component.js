import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
var ODialogComponent = (function () {
    function ODialogComponent(dialogRef) {
        this.dialogRef = dialogRef;
    }
    ODialogComponent.prototype.onOkClick = function () {
        if (this.dialogRef) {
            this.dialogRef.close(true);
        }
    };
    ODialogComponent.prototype.alert = function (title, message, config) {
        config = this.ensureConfig(config);
        this.configureDefaultAlert(title, message, config);
    };
    ODialogComponent.prototype.info = function (title, message, config) {
        config = this.ensureConfig(config);
        config.alertType = 'info';
        if (typeof (config.icon) === 'undefined') {
            config.icon = 'info';
        }
        this.configureDefaultAlert(title, message, config);
    };
    ODialogComponent.prototype.warn = function (title, message, config) {
        config = this.ensureConfig(config);
        config.alertType = 'warn';
        if (typeof (config.icon) === 'undefined') {
            config.icon = 'warning';
        }
        this.configureDefaultAlert(title, message, config);
    };
    ODialogComponent.prototype.error = function (title, message, config) {
        config = this.ensureConfig(config);
        config.alertType = 'error';
        if (typeof (config.icon) === 'undefined') {
            config.icon = 'error';
        }
        this.configureDefaultAlert(title, message, config);
    };
    ODialogComponent.prototype.confirm = function (title, message, config) {
        config = this.ensureConfig(config);
        this.configureDefaultAlert(title, message, config);
        this.twoOptions = true;
    };
    ODialogComponent.prototype.ensureConfig = function (config) {
        if (!config) {
            config = {};
        }
        return config;
    };
    ODialogComponent.prototype.configureDefaultAlert = function (title, message, config) {
        this.twoOptions = false;
        this.title = title;
        this.message = message;
        this.icon = (typeof (config.icon) !== 'undefined') ? config.icon : undefined;
        if (this.icon !== undefined) {
            this.useIcon = true;
        }
        this.alertType = config.alertType;
        this.okButtonText = (typeof (config.okButtonText) !== 'undefined') ? config.okButtonText : ODialogComponent.DEFAULT_OK_BUTTON_TEXT;
        this.cancelButtonText = (typeof (config.cancelButtonText) !== 'undefined') ? config.cancelButtonText : ODialogComponent.DEFAULT_CANCEL_BUTTON_TEXT;
    };
    Object.defineProperty(ODialogComponent.prototype, "isInfo", {
        get: function () {
            return this.alertType === 'info';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODialogComponent.prototype, "isWarn", {
        get: function () {
            return this.alertType === 'warn';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODialogComponent.prototype, "isError", {
        get: function () {
            return this.alertType === 'error';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODialogComponent.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (val) {
            this._title = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODialogComponent.prototype, "message", {
        get: function () {
            return this._message;
        },
        set: function (val) {
            this._message = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODialogComponent.prototype, "okButtonText", {
        get: function () {
            return this._okButtonText;
        },
        set: function (val) {
            this._okButtonText = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODialogComponent.prototype, "cancelButtonText", {
        get: function () {
            return this._cancelButtonText;
        },
        set: function (val) {
            this._cancelButtonText = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODialogComponent.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        set: function (val) {
            this._icon = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODialogComponent.prototype, "alertType", {
        get: function () {
            return this._alertType;
        },
        set: function (val) {
            this._alertType = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODialogComponent.prototype, "twoOptions", {
        get: function () {
            return this._twoOptions;
        },
        set: function (val) {
            this._twoOptions = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODialogComponent.prototype, "useIcon", {
        get: function () {
            return this._useIcon;
        },
        set: function (val) {
            this._useIcon = val;
        },
        enumerable: true,
        configurable: true
    });
    ODialogComponent.DEFAULT_OK_BUTTON_TEXT = 'OK';
    ODialogComponent.DEFAULT_CANCEL_BUTTON_TEXT = 'CANCEL';
    ODialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-dialog',
                    template: "<div *ngIf=\"title && title.length > 0\" mat-dialog-title>{{ title | oTranslate }}</div>\n<div mat-dialog-content>\n  <div fxLayout=\"row\" class=\"alert-content\" [class.alert-content-icon]=\"useIcon\" fxLayoutAlign=\"space-between center\">\n    <mat-icon *ngIf=\"useIcon\" class=\"alert-icon\" [class.info]=\"isInfo\" [class.warn]=\"isWarn\" [class.error]=\"isError\">\n      {{ icon }}\n    </mat-icon>\n    <span [innerHTML]=\"message | oTranslate\"></span>\n  </div>\n</div>\n<mat-dialog-actions align=\"end\">\n  <span fxFlex></span>\n  <button type=\"button\" *ngIf=\"twoOptions\" mat-stroked-button class=\"mat-primary\"\n    mat-dialog-close>{{ cancelButtonText | oTranslate | uppercase }}</button>\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\"\n    (click)=\"onOkClick()\">{{ okButtonText | oTranslate | uppercase }}</button>\n</mat-dialog-actions>",
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-dialog]': 'true'
                    },
                    styles: [".o-dialog{cursor:default}.o-dialog .alert-content{box-sizing:border-box;flex:1 1 100%;display:flex;flex-direction:row;place-content:center space-between;align-items:center;padding:12px 0}.o-dialog .alert-content-icon{min-height:70px}.o-dialog .alert-icon{font-size:50px;margin-right:16px;min-height:50px;min-width:50px}"]
                }] }
    ];
    ODialogComponent.ctorParameters = function () { return [
        { type: MatDialogRef }
    ]; };
    return ODialogComponent;
}());
export { ODialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1kaWFsb2cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvY29tcG9uZW50cy9kaWFsb2cvby1kaWFsb2cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBSWpEO0lBdUJFLDBCQUNTLFNBQXlDO1FBQXpDLGNBQVMsR0FBVCxTQUFTLENBQWdDO0lBQ2xELENBQUM7SUFFRCxvQ0FBUyxHQUFUO1FBQ0UsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztJQUVNLGdDQUFLLEdBQVosVUFBYSxLQUFhLEVBQUUsT0FBZSxFQUFFLE1BQXNCO1FBQ2pFLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTSwrQkFBSSxHQUFYLFVBQVksS0FBYSxFQUFFLE9BQWUsRUFBRSxNQUFzQjtRQUNoRSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztRQUMxQixJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssV0FBVyxFQUFFO1lBQ3hDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1NBQ3RCO1FBQ0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFD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Q3hCLENBQUM7OztPQUpBO0lBT0Qsc0JBQUksd0NBQVU7YUFBZDtZQUNFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUMxQixDQUFDO2FBRUQsVUFBZSxHQUFZO1lBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1FBQ3pCLENBQUM7OztPQUpBO0lBTUQsc0JBQUkscUNBQU87YUFBWDtZQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixDQUFDO2FBRUQsVUFBWSxHQUFZO1lBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ3RCLENBQUM7OztPQUpBO0lBMUpnQix1Q0FBc0IsR0FBRyxJQUFJLENBQUM7SUFDOUIsMkNBQTBCLEdBQUcsUUFBUSxDQUFDOztnQkFaeEQsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxVQUFVO29CQUNwQiw2M0JBQXdDO29CQUV4QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLGtCQUFrQixFQUFFLE1BQU07cUJBQzNCOztpQkFDRjs7O2dCQVpRLFlBQVk7O0lBOEtyQix1QkFBQztDQUFBLEFBMUtELElBMEtDO1NBaktZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdERpYWxvZ1JlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgT0RpYWxvZ0NvbmZpZyB9IGZyb20gJy4vby1kaWFsb2cuY29uZmlnJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1kaWFsb2cnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1kaWFsb2cuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWRpYWxvZy5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWRpYWxvZ10nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPRGlhbG9nQ29tcG9uZW50IHtcblxuICBwcm90ZWN0ZWQgc3RhdGljIERFRkFVTFRfT0tfQlVUVE9OX1RFWFQgPSAnT0snO1xuICBwcm90ZWN0ZWQgc3RhdGljIERFRkFVTFRfQ0FOQ0VMX0JVVFRPTl9URVhUID0gJ0NBTkNFTCc7XG5cbiAgcHJvdGVjdGVkIF90aXRsZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX21lc3NhZ2U6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9va0J1dHRvblRleHQ6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9jYW5jZWxCdXR0b25UZXh0OiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfdHdvT3B0aW9uczogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIF91c2VJY29uOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgX2ljb246IHN0cmluZztcbiAgcHJvdGVjdGVkIF9hbGVydFR5cGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8T0RpYWxvZ0NvbXBvbmVudD4pIHtcbiAgfVxuXG4gIG9uT2tDbGljaygpIHtcbiAgICBpZiAodGhpcy5kaWFsb2dSZWYpIHtcbiAgICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhbGVydCh0aXRsZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIGNvbmZpZz86IE9EaWFsb2dDb25maWcpIHtcbiAgICBjb25maWcgPSB0aGlzLmVuc3VyZUNvbmZpZyhjb25maWcpO1xuICAgIHRoaXMuY29uZmlndXJlRGVmYXVsdEFsZXJ0KHRpdGxlLCBtZXNzYWdlLCBjb25maWcpO1xuICB9XG5cbiAgcHVibGljIGluZm8odGl0bGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCBjb25maWc/OiBPRGlhbG9nQ29uZmlnKSB7XG4gICAgY29uZmlnID0gdGhpcy5lbnN1cmVDb25maWcoY29uZmlnKTtcbiAgICBjb25maWcuYWxlcnRUeXBlID0gJ2luZm8nO1xuICAgIGlmICh0eXBlb2YgKGNvbmZpZy5pY29uKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbmZpZy5pY29uID0gJ2luZm8nO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ3VyZURlZmF1bHRBbGVydCh0aXRsZSwgbWVzc2FnZSwgY29uZmlnKTtcbiAgfVxuXG4gIHB1YmxpYyB3YXJuKHRpdGxlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgY29uZmlnPzogT0RpYWxvZ0NvbmZpZykge1xuICAgIGNvbmZpZyA9IHRoaXMuZW5zdXJlQ29uZmlnKGNvbmZpZyk7XG4gICAgY29uZmlnLmFsZXJ0VHlwZSA9ICd3YXJuJztcbiAgICBpZiAodHlwZW9mIChjb25maWcuaWNvbikgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25maWcuaWNvbiA9ICd3YXJuaW5nJztcbiAgICB9XG4gICAgdGhpcy5jb25maWd1cmVEZWZhdWx0QWxlcnQodGl0bGUsIG1lc3NhZ2UsIGNvbmZpZyk7XG4gIH1cblxuICBwdWJsaWMgZXJyb3IodGl0bGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCBjb25maWc/OiBPRGlhbG9nQ29uZmlnKSB7XG4gICAgY29uZmlnID0gdGhpcy5lbnN1cmVDb25maWcoY29uZmlnKTtcbiAgICBjb25maWcuYWxlcnRUeXBlID0gJ2Vycm9yJztcbiAgICBpZiAodHlwZW9mIChjb25maWcuaWNvbikgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25maWcuaWNvbiA9ICdlcnJvcic7XG4gICAgfVxuICAgIHRoaXMuY29uZmlndXJlRGVmYXVsdEFsZXJ0KHRpdGxlLCBtZXNzYWdlLCBjb25maWcpO1xuICB9XG5cbiAgcHVibGljIGNvbmZpcm0odGl0bGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCBjb25maWc/OiBPRGlhbG9nQ29uZmlnKSB7XG4gICAgY29uZmlnID0gdGhpcy5lbnN1cmVDb25maWcoY29uZmlnKTtcbiAgICB0aGlzLmNvbmZpZ3VyZURlZmF1bHRBbGVydCh0aXRsZSwgbWVzc2FnZSwgY29uZmlnKTtcbiAgICB0aGlzLnR3b09wdGlvbnMgPSB0cnVlO1xuICB9XG5cbiAgLyogVXRpbGl0eSBtZXRob2RzICovXG4gIHByb3RlY3RlZCBlbnN1cmVDb25maWcoY29uZmlnOiBPRGlhbG9nQ29uZmlnKTogT0RpYWxvZ0NvbmZpZyB7XG4gICAgaWYgKCFjb25maWcpIHtcbiAgICAgIGNvbmZpZyA9IHt9O1xuICAgIH1cbiAgICByZXR1cm4gY29uZmlnO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbmZpZ3VyZURlZmF1bHRBbGVydCh0aXRsZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIGNvbmZpZz86IE9EaWFsb2dDb25maWcpIHtcbiAgICB0aGlzLnR3b09wdGlvbnMgPSBmYWxzZTtcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblxuICAgIHRoaXMuaWNvbiA9ICh0eXBlb2YgKGNvbmZpZy5pY29uKSAhPT0gJ3VuZGVmaW5lZCcpID8gY29uZmlnLmljb24gOiB1bmRlZmluZWQ7XG4gICAgaWYgKHRoaXMuaWNvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnVzZUljb24gPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLmFsZXJ0VHlwZSA9IGNvbmZpZy5hbGVydFR5cGU7XG5cbiAgICB0aGlzLm9rQnV0dG9uVGV4dCA9ICh0eXBlb2YgKGNvbmZpZy5va0J1dHRvblRleHQpICE9PSAndW5kZWZpbmVkJykgPyBjb25maWcub2tCdXR0b25UZXh0IDogT0RpYWxvZ0NvbXBvbmVudC5ERUZBVUxUX09LX0JVVFRPTl9URVhUO1xuICAgIHRoaXMuY2FuY2VsQnV0dG9uVGV4dCA9ICh0eXBlb2YgKGNvbmZpZy5jYW5jZWxCdXR0b25UZXh0KSAhPT0gJ3VuZGVmaW5lZCcpID8gY29uZmlnLmNhbmNlbEJ1dHRvblRleHQgOiBPRGlhbG9nQ29tcG9uZW50LkRFRkFVTFRfQ0FOQ0VMX0JVVFRPTl9URVhUO1xuICB9XG5cbiAgZ2V0IGlzSW5mbygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5hbGVydFR5cGUgPT09ICdpbmZvJztcbiAgfVxuXG4gIGdldCBpc1dhcm4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYWxlcnRUeXBlID09PSAnd2Fybic7XG4gIH1cblxuICBnZXQgaXNFcnJvcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5hbGVydFR5cGUgPT09ICdlcnJvcic7XG4gIH1cblxuICBnZXQgdGl0bGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdGl0bGU7XG4gIH1cblxuICBzZXQgdGl0bGUodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90aXRsZSA9IHZhbDtcbiAgfVxuXG4gIGdldCBtZXNzYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX21lc3NhZ2U7XG4gIH1cblxuICBzZXQgbWVzc2FnZSh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX21lc3NhZ2UgPSB2YWw7XG4gIH1cblxuICBnZXQgb2tCdXR0b25UZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX29rQnV0dG9uVGV4dDtcbiAgfVxuXG4gIHNldCBva0J1dHRvblRleHQodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9va0J1dHRvblRleHQgPSB2YWw7XG4gIH1cblxuICBnZXQgY2FuY2VsQnV0dG9uVGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9jYW5jZWxCdXR0b25UZXh0O1xuICB9XG5cbiAgc2V0IGNhbmNlbEJ1dHRvblRleHQodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9jYW5jZWxCdXR0b25UZXh0ID0gdmFsO1xuICB9XG5cbiAgZ2V0IGljb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faWNvbjtcbiAgfVxuXG4gIHNldCBpY29uKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5faWNvbiA9IHZhbDtcbiAgfVxuXG4gIGdldCBhbGVydFR5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fYWxlcnRUeXBlO1xuICB9XG5cbiAgc2V0IGFsZXJ0VHlwZSh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX2FsZXJ0VHlwZSA9IHZhbDtcbiAgfVxuXG5cbiAgZ2V0IHR3b09wdGlvbnMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3R3b09wdGlvbnM7XG4gIH1cblxuICBzZXQgdHdvT3B0aW9ucyh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl90d29PcHRpb25zID0gdmFsO1xuICB9XG5cbiAgZ2V0IHVzZUljb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZUljb247XG4gIH1cblxuICBzZXQgdXNlSWNvbih2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl91c2VJY29uID0gdmFsO1xuICB9XG59XG4iXX0=