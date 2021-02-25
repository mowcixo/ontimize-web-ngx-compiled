import { ChangeDetectorRef, Injector, NgModule, Pipe } from '@angular/core';
import { OTranslateService } from '../services/translate/o-translate.service';
import { Util } from '../util/util';
var OTranslatePipe = (function () {
    function OTranslatePipe(injector) {
        this.injector = injector;
        this.value = '';
        this._ref = this.injector.get(ChangeDetectorRef);
        this.oTranslateService = this.injector.get(OTranslateService);
    }
    OTranslatePipe.prototype.ngOnDestroy = function () {
        this._dispose();
    };
    OTranslatePipe.prototype.transform = function (text, args) {
        var _this = this;
        if (!text || text.length === 0) {
            return text;
        }
        if (Util.equals(text, this.lastKey) && Util.equals(args, this.lastParams)) {
            return this.value;
        }
        this.lastKey = text;
        this.lastParams = args;
        this.updateValue(text);
        this._dispose();
        if (!this.onLanguageChanged) {
            this.onLanguageChanged = this.oTranslateService.onLanguageChanged.subscribe(function (lang) {
                if (_this.lastKey) {
                    _this.lastKey = null;
                    _this.updateValue(text);
                }
            });
        }
        return this.value;
    };
    OTranslatePipe.prototype.updateValue = function (key) {
        var args = Util.isDefined(this.lastParams) ? this.lastParams.values || [] : [];
        var res = this.oTranslateService.get(key, args);
        this.value = res !== undefined ? res : key;
        this.lastKey = key;
        this._ref.markForCheck();
    };
    OTranslatePipe.prototype._dispose = function () {
        if (typeof this.onLanguageChanged !== 'undefined') {
            this.onLanguageChanged.unsubscribe();
            this.onLanguageChanged = undefined;
        }
    };
    OTranslatePipe.decorators = [
        { type: Pipe, args: [{
                    name: 'oTranslate',
                    pure: false
                },] }
    ];
    OTranslatePipe.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return OTranslatePipe;
}());
export { OTranslatePipe };
var OTranslateModule = (function () {
    function OTranslateModule() {
    }
    OTranslateModule.forRoot = function () {
        return {
            ngModule: OTranslateModule,
            providers: []
        };
    };
    OTranslateModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OTranslatePipe],
                    imports: [],
                    exports: [OTranslatePipe]
                },] }
    ];
    return OTranslateModule;
}());
export { OTranslateModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10cmFuc2xhdGUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvcGlwZXMvby10cmFuc2xhdGUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUF1QixRQUFRLEVBQWEsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUUzSCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUM5RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBTXBDO0lBZUUsd0JBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFUakMsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQVV4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVNLG9DQUFXLEdBQWxCO1FBQ0UsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFTSxrQ0FBUyxHQUFoQixVQUFpQixJQUFZLEVBQUUsSUFBNkI7UUFBNUQsaUJBZ0NDO1FBL0JDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUdELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUN6RSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDbkI7UUFHRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUdwQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUd2QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBR3ZCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUdoQixJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzNCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFVBQUEsSUFBSTtnQkFDOUUsSUFBSSxLQUFJLENBQUMsT0FBTyxFQUFFO29CQUNoQixLQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztvQkFDcEIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDeEI7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFTSxvQ0FBVyxHQUFsQixVQUFtQixHQUFXO1FBQzVCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUVqRixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVTLGlDQUFRLEdBQWxCO1FBQ0UsSUFBSSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxXQUFXLEVBQUU7WUFDakQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUM7U0FDcEM7SUFDSCxDQUFDOztnQkF4RUYsSUFBSSxTQUFDO29CQUNKLElBQUksRUFBRSxZQUFZO29CQUNsQixJQUFJLEVBQUUsS0FBSztpQkFDWjs7O2dCQVoyQixRQUFROztJQW1GcEMscUJBQUM7Q0FBQSxBQTFFRCxJQTBFQztTQXRFWSxjQUFjO0FBd0UzQjtJQUFBO0lBWUEsQ0FBQztJQU5lLHdCQUFPLEdBQXJCO1FBQ0UsT0FBTztZQUNMLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsU0FBUyxFQUFFLEVBQUU7U0FDZCxDQUFDO0lBQ0osQ0FBQzs7Z0JBWEYsUUFBUSxTQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLGNBQWMsQ0FBQztvQkFDOUIsT0FBTyxFQUFFLEVBQUU7b0JBQ1gsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO2lCQUMxQjs7SUFRRCx1QkFBQztDQUFBLEFBWkQsSUFZQztTQVBZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdG9yUmVmLCBJbmplY3RvciwgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUsIE9uRGVzdHJveSwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElUcmFuc2xhdGVQaXBlQXJndW1lbnQge1xuICB2YWx1ZXM/OiBhbnlbXTtcbn1cblxuQFBpcGUoe1xuICBuYW1lOiAnb1RyYW5zbGF0ZScsXG4gIHB1cmU6IGZhbHNlIC8vIHJlcXVpcmVkIHRvIHVwZGF0ZSB0aGUgdmFsdWUgd2hlbiB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZFxufSlcbmV4cG9ydCBjbGFzcyBPVHJhbnNsYXRlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0sIE9uRGVzdHJveSB7XG5cbiAgcHVibGljIHZhbHVlOiBzdHJpbmcgPSAnJztcbiAgcHVibGljIGxhc3RLZXk6IHN0cmluZztcbiAgcHVibGljIGxhc3RQYXJhbXM6IGFueTtcblxuICBwdWJsaWMgb25MYW5ndWFnZUNoYW5nZWQ6IGFueTsgLy8gQ2hhbmdlIHRoaXMgZnJvbSBFdmVudEVtaXR0ZXI8YW55PiB0byBhbnkgYmVjYXVzZSBFcnJvcjogVHlwZSAnU3Vic2NyaXB0aW9uJyBpcyBtaXNzaW5nIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyBmcm9tIHR5cGUgJ0V2ZW50RW1pdHRlcjxhbnk+JzogZW1pdCwgc3Vic2NyaWJlLCBvYnNlcnZlcnMsIGlzU3RvcHBlZCwgYW5kIDE1IG1vcmUuXG5cbiAgcHJvdGVjdGVkIG9UcmFuc2xhdGVTZXJ2aWNlOiBPVHJhbnNsYXRlU2VydmljZTtcbiAgcHJvdGVjdGVkIF9yZWY6IENoYW5nZURldGVjdG9yUmVmO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLl9yZWYgPSB0aGlzLmluamVjdG9yLmdldChDaGFuZ2VEZXRlY3RvclJlZik7XG4gICAgdGhpcy5vVHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9kaXNwb3NlKCk7XG4gIH1cblxuICBwdWJsaWMgdHJhbnNmb3JtKHRleHQ6IHN0cmluZywgYXJncz86IElUcmFuc2xhdGVQaXBlQXJndW1lbnQpOiBzdHJpbmcge1xuICAgIGlmICghdGV4dCB8fCB0ZXh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuXG4gICAgLy8gaWYgd2UgYXNrIGFub3RoZXIgdGltZSBmb3IgdGhlIHNhbWUga2V5LCByZXR1cm4gdGhlIGxhc3QgdmFsdWVcbiAgICBpZiAoVXRpbC5lcXVhbHModGV4dCwgdGhpcy5sYXN0S2V5KSAmJiBVdGlsLmVxdWFscyhhcmdzLCB0aGlzLmxhc3RQYXJhbXMpKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICB9XG5cbiAgICAvLyBzdG9yZSB0aGUgcXVlcnksIGluIGNhc2UgaXQgY2hhbmdlc1xuICAgIHRoaXMubGFzdEtleSA9IHRleHQ7XG5cbiAgICAvLyBzdG9yZSB0aGUgcGFyYW1zLCBpbiBjYXNlIHRoZXkgY2hhbmdlXG4gICAgdGhpcy5sYXN0UGFyYW1zID0gYXJncztcblxuICAgIC8vIHNldCB0aGUgdmFsdWVcbiAgICB0aGlzLnVwZGF0ZVZhbHVlKHRleHQpO1xuXG4gICAgLy8gaWYgdGhlcmUgaXMgYSBzdWJzY3JpcHRpb24gdG8gb25MYW5ndWFnZUNoYW5nZWQsIGNsZWFuIGl0XG4gICAgdGhpcy5fZGlzcG9zZSgpO1xuXG4gICAgLy8gc3Vic2NyaWJlIHRvIG9uTGFuZ3VhZ2VDaGFuZ2VkIGV2ZW50LCBpbiBjYXNlIHRoZSBsYW5ndWFnZSBjaGFuZ2VzXG4gICAgaWYgKCF0aGlzLm9uTGFuZ3VhZ2VDaGFuZ2VkKSB7XG4gICAgICB0aGlzLm9uTGFuZ3VhZ2VDaGFuZ2VkID0gdGhpcy5vVHJhbnNsYXRlU2VydmljZS5vbkxhbmd1YWdlQ2hhbmdlZC5zdWJzY3JpYmUobGFuZyA9PiB7XG4gICAgICAgIGlmICh0aGlzLmxhc3RLZXkpIHtcbiAgICAgICAgICB0aGlzLmxhc3RLZXkgPSBudWxsOyAvLyB3ZSB3YW50IHRvIG1ha2Ugc3VyZSBpdCBkb2Vzbid0IHJldHVybiB0aGUgc2FtZSB2YWx1ZSB1bnRpbCBpdCdzIGJlZW4gdXBkYXRlZFxuICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUodGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVWYWx1ZShrZXk6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGFyZ3MgPSBVdGlsLmlzRGVmaW5lZCh0aGlzLmxhc3RQYXJhbXMpID8gdGhpcy5sYXN0UGFyYW1zLnZhbHVlcyB8fCBbXSA6IFtdO1xuXG4gICAgY29uc3QgcmVzID0gdGhpcy5vVHJhbnNsYXRlU2VydmljZS5nZXQoa2V5LCBhcmdzKTtcbiAgICB0aGlzLnZhbHVlID0gcmVzICE9PSB1bmRlZmluZWQgPyByZXMgOiBrZXk7XG4gICAgdGhpcy5sYXN0S2V5ID0ga2V5O1xuICAgIHRoaXMuX3JlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZGlzcG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub25MYW5ndWFnZUNoYW5nZWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLm9uTGFuZ3VhZ2VDaGFuZ2VkLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLm9uTGFuZ3VhZ2VDaGFuZ2VkID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG59XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW09UcmFuc2xhdGVQaXBlXSxcbiAgaW1wb3J0czogW10sXG4gIGV4cG9ydHM6IFtPVHJhbnNsYXRlUGlwZV1cbn0pXG5leHBvcnQgY2xhc3MgT1RyYW5zbGF0ZU1vZHVsZSB7XG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IE9UcmFuc2xhdGVNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtdXG4gICAgfTtcbiAgfVxufVxuIl19