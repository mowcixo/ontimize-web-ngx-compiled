import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { TranslateDefaultParser } from '@ngx-translate/core';
import { Util } from '../../util/util';
var OTranslateParser = (function (_super) {
    tslib_1.__extends(OTranslateParser, _super);
    function OTranslateParser() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.templateMatcher = /{\s?([0-9][^{}\s]*)\s?}/g;
        return _this;
    }
    OTranslateParser.prototype.interpolate = function (expr, params) {
        if (typeof expr !== 'string' || !params) {
            return expr;
        }
        return expr.replace(this.templateMatcher, function (substring, index) {
            var argValue = Util.isDefined(params[index]) ? params[index] : '';
            return !isNaN(parseInt(index, 10)) ? argValue : substring;
        });
    };
    OTranslateParser.decorators = [
        { type: Injectable }
    ];
    return OTranslateParser;
}(TranslateDefaultParser));
export { OTranslateParser };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10cmFuc2xhdGUucGFyc2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUucGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTdELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV2QztJQUNzQyw0Q0FBc0I7SUFENUQ7UUFBQSxxRUFhQztRQVhRLHFCQUFlLEdBQVcsMEJBQTBCLENBQUM7O0lBVzlELENBQUM7SUFUUSxzQ0FBVyxHQUFsQixVQUFtQixJQUFZLEVBQUUsTUFBWTtRQUMzQyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUN2QyxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsVUFBQyxTQUFpQixFQUFFLEtBQWE7WUFDekUsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDcEUsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzVELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7Z0JBWkYsVUFBVTs7SUFhWCx1QkFBQztDQUFBLEFBYkQsQ0FDc0Msc0JBQXNCLEdBWTNEO1NBWlksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVHJhbnNsYXRlRGVmYXVsdFBhcnNlciB9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vdXRpbC91dGlsJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE9UcmFuc2xhdGVQYXJzZXIgZXh0ZW5kcyBUcmFuc2xhdGVEZWZhdWx0UGFyc2VyIHtcbiAgcHVibGljIHRlbXBsYXRlTWF0Y2hlcjogUmVnRXhwID0gL3tcXHM/KFswLTldW157fVxcc10qKVxccz99L2c7XG5cbiAgcHVibGljIGludGVycG9sYXRlKGV4cHI6IHN0cmluZywgcGFyYW1zPzogYW55KTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIGV4cHIgIT09ICdzdHJpbmcnIHx8ICFwYXJhbXMpIHtcbiAgICAgIHJldHVybiBleHByO1xuICAgIH1cbiAgICByZXR1cm4gZXhwci5yZXBsYWNlKHRoaXMudGVtcGxhdGVNYXRjaGVyLCAoc3Vic3RyaW5nOiBzdHJpbmcsIGluZGV4OiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IGFyZ1ZhbHVlID0gVXRpbC5pc0RlZmluZWQocGFyYW1zW2luZGV4XSkgPyBwYXJhbXNbaW5kZXhdIDogJyc7XG4gICAgICByZXR1cm4gIWlzTmFOKHBhcnNlSW50KGluZGV4LCAxMCkpID8gYXJnVmFsdWUgOiBzdWJzdHJpbmc7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==