import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
export class ODialogComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
    }
    onOkClick() {
        if (this.dialogRef) {
            this.dialogRef.close(true);
        }
    }
    alert(title, message, config) {
        config = this.ensureConfig(config);
        this.configureDefaultAlert(title, message, config);
    }
    info(title, message, config) {
        config = this.ensureConfig(config);
        config.alertType = 'info';
        if (typeof (config.icon) === 'undefined') {
            config.icon = 'info';
        }
        this.configureDefaultAlert(title, message, config);
    }
    warn(title, message, config) {
        config = this.ensureConfig(config);
        config.alertType = 'warn';
        if (typeof (config.icon) === 'undefined') {
            config.icon = 'warning';
        }
        this.configureDefaultAlert(title, message, config);
    }
    error(title, message, config) {
        config = this.ensureConfig(config);
        config.alertType = 'error';
        if (typeof (config.icon) === 'undefined') {
            config.icon = 'error';
        }
        this.configureDefaultAlert(title, message, config);
    }
    confirm(title, message, config) {
        config = this.ensureConfig(config);
        this.configureDefaultAlert(title, message, config);
        this.twoOptions = true;
    }
    ensureConfig(config) {
        if (!config) {
            config = {};
        }
        return config;
    }
    configureDefaultAlert(title, message, config) {
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
    }
    get isInfo() {
        return this.alertType === 'info';
    }
    get isWarn() {
        return this.alertType === 'warn';
    }
    get isError() {
        return this.alertType === 'error';
    }
    get title() {
        return this._title;
    }
    set title(val) {
        this._title = val;
    }
    get message() {
        return this._message;
    }
    set message(val) {
        this._message = val;
    }
    get okButtonText() {
        return this._okButtonText;
    }
    set okButtonText(val) {
        this._okButtonText = val;
    }
    get cancelButtonText() {
        return this._cancelButtonText;
    }
    set cancelButtonText(val) {
        this._cancelButtonText = val;
    }
    get icon() {
        return this._icon;
    }
    set icon(val) {
        this._icon = val;
    }
    get alertType() {
        return this._alertType;
    }
    set alertType(val) {
        this._alertType = val;
    }
    get twoOptions() {
        return this._twoOptions;
    }
    set twoOptions(val) {
        this._twoOptions = val;
    }
    get useIcon() {
        return this._useIcon;
    }
    set useIcon(val) {
        this._useIcon = val;
    }
}
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
ODialogComponent.ctorParameters = () => [
    { type: MatDialogRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1kaWFsb2cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvY29tcG9uZW50cy9kaWFsb2cvby1kaWFsb2cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBYWpELE1BQU0sT0FBTyxnQkFBZ0I7SUFjM0IsWUFDUyxTQUF5QztRQUF6QyxjQUFTLEdBQVQsU0FBUyxDQUFnQztJQUNsRCxDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QjtJQUNILENBQUM7SUFFTSxLQUFLLENBQUMsS0FBYSxFQUFFLE9BQWUsRUFBRSxNQUFzQjtRQUNqRSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRU0sSUFBSSxDQUFDLEtBQWEsRUFBRSxPQUFlLEVBQUUsTUFBc0I7UUFDaEUsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7UUFDMUIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLFdBQVcsRUFBRTtZQUN4QyxNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztTQUN0QjtRQUNELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxD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QixJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxHQUFZO1FBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0lBQ3RCLENBQUM7O0FBOUpnQix1Q0FBc0IsR0FBRyxJQUFJLENBQUM7QUFDOUIsMkNBQTBCLEdBQUcsUUFBUSxDQUFDOztZQVp4RCxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLDYzQkFBd0M7Z0JBRXhDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0osa0JBQWtCLEVBQUUsTUFBTTtpQkFDM0I7O2FBQ0Y7OztZQVpRLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXREaWFsb2dSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IE9EaWFsb2dDb25maWcgfSBmcm9tICcuL28tZGlhbG9nLmNvbmZpZyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tZGlhbG9nJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tZGlhbG9nLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1kaWFsb2cuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1kaWFsb2ddJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0RpYWxvZ0NvbXBvbmVudCB7XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBERUZBVUxUX09LX0JVVFRPTl9URVhUID0gJ09LJztcbiAgcHJvdGVjdGVkIHN0YXRpYyBERUZBVUxUX0NBTkNFTF9CVVRUT05fVEVYVCA9ICdDQU5DRUwnO1xuXG4gIHByb3RlY3RlZCBfdGl0bGU6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9tZXNzYWdlOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfb2tCdXR0b25UZXh0OiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfY2FuY2VsQnV0dG9uVGV4dDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX3R3b09wdGlvbnM6IGJvb2xlYW47XG4gIHByb3RlY3RlZCBfdXNlSWNvbjogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIF9pY29uOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfYWxlcnRUeXBlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE9EaWFsb2dDb21wb25lbnQ+KSB7XG4gIH1cblxuICBvbk9rQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMuZGlhbG9nUmVmKSB7XG4gICAgICB0aGlzLmRpYWxvZ1JlZi5jbG9zZSh0cnVlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWxlcnQodGl0bGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCBjb25maWc/OiBPRGlhbG9nQ29uZmlnKSB7XG4gICAgY29uZmlnID0gdGhpcy5lbnN1cmVDb25maWcoY29uZmlnKTtcbiAgICB0aGlzLmNvbmZpZ3VyZURlZmF1bHRBbGVydCh0aXRsZSwgbWVzc2FnZSwgY29uZmlnKTtcbiAgfVxuXG4gIHB1YmxpYyBpbmZvKHRpdGxlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgY29uZmlnPzogT0RpYWxvZ0NvbmZpZykge1xuICAgIGNvbmZpZyA9IHRoaXMuZW5zdXJlQ29uZmlnKGNvbmZpZyk7XG4gICAgY29uZmlnLmFsZXJ0VHlwZSA9ICdpbmZvJztcbiAgICBpZiAodHlwZW9mIChjb25maWcuaWNvbikgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25maWcuaWNvbiA9ICdpbmZvJztcbiAgICB9XG4gICAgdGhpcy5jb25maWd1cmVEZWZhdWx0QWxlcnQodGl0bGUsIG1lc3NhZ2UsIGNvbmZpZyk7XG4gIH1cblxuICBwdWJsaWMgd2Fybih0aXRsZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIGNvbmZpZz86IE9EaWFsb2dDb25maWcpIHtcbiAgICBjb25maWcgPSB0aGlzLmVuc3VyZUNvbmZpZyhjb25maWcpO1xuICAgIGNvbmZpZy5hbGVydFR5cGUgPSAnd2Fybic7XG4gICAgaWYgKHR5cGVvZiAoY29uZmlnLmljb24pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uZmlnLmljb24gPSAnd2FybmluZyc7XG4gICAgfVxuICAgIHRoaXMuY29uZmlndXJlRGVmYXVsdEFsZXJ0KHRpdGxlLCBtZXNzYWdlLCBjb25maWcpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKHRpdGxlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgY29uZmlnPzogT0RpYWxvZ0NvbmZpZykge1xuICAgIGNvbmZpZyA9IHRoaXMuZW5zdXJlQ29uZmlnKGNvbmZpZyk7XG4gICAgY29uZmlnLmFsZXJ0VHlwZSA9ICdlcnJvcic7XG4gICAgaWYgKHR5cGVvZiAoY29uZmlnLmljb24pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uZmlnLmljb24gPSAnZXJyb3InO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ3VyZURlZmF1bHRBbGVydCh0aXRsZSwgbWVzc2FnZSwgY29uZmlnKTtcbiAgfVxuXG4gIHB1YmxpYyBjb25maXJtKHRpdGxlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgY29uZmlnPzogT0RpYWxvZ0NvbmZpZykge1xuICAgIGNvbmZpZyA9IHRoaXMuZW5zdXJlQ29uZmlnKGNvbmZpZyk7XG4gICAgdGhpcy5jb25maWd1cmVEZWZhdWx0QWxlcnQodGl0bGUsIG1lc3NhZ2UsIGNvbmZpZyk7XG4gICAgdGhpcy50d29PcHRpb25zID0gdHJ1ZTtcbiAgfVxuXG4gIC8qIFV0aWxpdHkgbWV0aG9kcyAqL1xuICBwcm90ZWN0ZWQgZW5zdXJlQ29uZmlnKGNvbmZpZzogT0RpYWxvZ0NvbmZpZyk6IE9EaWFsb2dDb25maWcge1xuICAgIGlmICghY29uZmlnKSB7XG4gICAgICBjb25maWcgPSB7fTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbmZpZztcbiAgfVxuXG4gIHByb3RlY3RlZCBjb25maWd1cmVEZWZhdWx0QWxlcnQodGl0bGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nLCBjb25maWc/OiBPRGlhbG9nQ29uZmlnKSB7XG4gICAgdGhpcy50d29PcHRpb25zID0gZmFsc2U7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG5cbiAgICB0aGlzLmljb24gPSAodHlwZW9mIChjb25maWcuaWNvbikgIT09ICd1bmRlZmluZWQnKSA/IGNvbmZpZy5pY29uIDogdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLmljb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy51c2VJY29uID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5hbGVydFR5cGUgPSBjb25maWcuYWxlcnRUeXBlO1xuXG4gICAgdGhpcy5va0J1dHRvblRleHQgPSAodHlwZW9mIChjb25maWcub2tCdXR0b25UZXh0KSAhPT0gJ3VuZGVmaW5lZCcpID8gY29uZmlnLm9rQnV0dG9uVGV4dCA6IE9EaWFsb2dDb21wb25lbnQuREVGQVVMVF9PS19CVVRUT05fVEVYVDtcbiAgICB0aGlzLmNhbmNlbEJ1dHRvblRleHQgPSAodHlwZW9mIChjb25maWcuY2FuY2VsQnV0dG9uVGV4dCkgIT09ICd1bmRlZmluZWQnKSA/IGNvbmZpZy5jYW5jZWxCdXR0b25UZXh0IDogT0RpYWxvZ0NvbXBvbmVudC5ERUZBVUxUX0NBTkNFTF9CVVRUT05fVEVYVDtcbiAgfVxuXG4gIGdldCBpc0luZm8oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYWxlcnRUeXBlID09PSAnaW5mbyc7XG4gIH1cblxuICBnZXQgaXNXYXJuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmFsZXJ0VHlwZSA9PT0gJ3dhcm4nO1xuICB9XG5cbiAgZ2V0IGlzRXJyb3IoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYWxlcnRUeXBlID09PSAnZXJyb3InO1xuICB9XG5cbiAgZ2V0IHRpdGxlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3RpdGxlO1xuICB9XG5cbiAgc2V0IHRpdGxlKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fdGl0bGUgPSB2YWw7XG4gIH1cblxuICBnZXQgbWVzc2FnZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9tZXNzYWdlO1xuICB9XG5cbiAgc2V0IG1lc3NhZ2UodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9tZXNzYWdlID0gdmFsO1xuICB9XG5cbiAgZ2V0IG9rQnV0dG9uVGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9va0J1dHRvblRleHQ7XG4gIH1cblxuICBzZXQgb2tCdXR0b25UZXh0KHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fb2tCdXR0b25UZXh0ID0gdmFsO1xuICB9XG5cbiAgZ2V0IGNhbmNlbEJ1dHRvblRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fY2FuY2VsQnV0dG9uVGV4dDtcbiAgfVxuXG4gIHNldCBjYW5jZWxCdXR0b25UZXh0KHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fY2FuY2VsQnV0dG9uVGV4dCA9IHZhbDtcbiAgfVxuXG4gIGdldCBpY29uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2ljb247XG4gIH1cblxuICBzZXQgaWNvbih2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX2ljb24gPSB2YWw7XG4gIH1cblxuICBnZXQgYWxlcnRUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2FsZXJ0VHlwZTtcbiAgfVxuXG4gIHNldCBhbGVydFR5cGUodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9hbGVydFR5cGUgPSB2YWw7XG4gIH1cblxuXG4gIGdldCB0d29PcHRpb25zKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl90d29PcHRpb25zO1xuICB9XG5cbiAgc2V0IHR3b09wdGlvbnModmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdHdvT3B0aW9ucyA9IHZhbDtcbiAgfVxuXG4gIGdldCB1c2VJY29uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl91c2VJY29uO1xuICB9XG5cbiAgc2V0IHVzZUljb24odmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdXNlSWNvbiA9IHZhbDtcbiAgfVxufVxuIl19