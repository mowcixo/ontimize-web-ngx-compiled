import { Util } from './util';
var PermissionsUtils = (function () {
    function PermissionsUtils() {
    }
    PermissionsUtils.checkEnabledPermission = function (permission) {
        if (Util.isDefined(permission) && permission.enabled === false) {
            console.warn('MESSAGES.OPERATION_NOT_ALLOWED_PERMISSION');
            return false;
        }
        return true;
    };
    PermissionsUtils.registerDisabledChangesInDom = function (nativeElement, args) {
        var callback = args && args.callback ? args.callback : PermissionsUtils.setDisabledDOMElement;
        var checkStringValue = !!(args && args.checkStringValue);
        if (!Util.isDefined(nativeElement)) {
            return undefined;
        }
        var mutationObserver = new MutationObserver(function (mutations) {
            var mutation = mutations[0];
            if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                var attribute = mutation.target.attributes.getNamedItem('disabled');
                if (attribute === null || (checkStringValue && attribute.value !== 'true')) {
                    callback(mutation);
                }
            }
        });
        mutationObserver.observe(nativeElement, {
            attributes: true,
            attributeFilter: ['disabled']
        });
        return mutationObserver;
    };
    PermissionsUtils.setDisabledDOMElement = function (mutation) {
        var element = mutation.target;
        element.setAttribute('disabled', 'true');
    };
    PermissionsUtils.ACTION_REFRESH = 'refresh';
    PermissionsUtils.ACTION_INSERT = 'insert';
    PermissionsUtils.ACTION_UPDATE = 'update';
    PermissionsUtils.ACTION_DELETE = 'delete';
    PermissionsUtils.STANDARD_ACTIONS = [
        PermissionsUtils.ACTION_REFRESH,
        PermissionsUtils.ACTION_INSERT,
        PermissionsUtils.ACTION_UPDATE,
        PermissionsUtils.ACTION_DELETE
    ];
    return PermissionsUtils;
}());
export { PermissionsUtils };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3V0aWwvcGVybWlzc2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUU5QjtJQUFBO0lBa0RBLENBQUM7SUFyQ1EsdUNBQXNCLEdBQTdCLFVBQThCLFVBQXdCO1FBQ3BELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxVQUFVLENBQUMsT0FBTyxLQUFLLEtBQUssRUFBRTtZQUM5RCxPQUFPLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7WUFDMUQsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLDZDQUE0QixHQUFuQyxVQUFvQyxhQUFrQixFQUFFLElBQVU7UUFDaEUsSUFBTSxRQUFRLEdBQWEsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDO1FBQzFHLElBQU0sZ0JBQWdCLEdBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ2xDLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixDQUFDLFVBQUMsU0FBMkI7WUFDeEUsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxZQUFZLElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxVQUFVLEVBQUU7Z0JBQzNFLElBQU0sU0FBUyxHQUFJLFFBQVEsQ0FBQyxNQUFjLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDL0UsSUFBSSxTQUFTLEtBQUssSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksU0FBUyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsRUFBRTtvQkFDMUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUNwQjthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFO1lBQ3RDLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLGVBQWUsRUFBRSxDQUFDLFVBQVUsQ0FBQztTQUM5QixDQUFDLENBQUM7UUFFSCxPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7SUFFTSxzQ0FBcUIsR0FBNUIsVUFBNkIsUUFBd0I7UUFDbkQsSUFBTSxPQUFPLEdBQXFCLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDbEQsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQWhEYSwrQkFBYyxHQUFHLFNBQVMsQ0FBQztJQUMzQiw4QkFBYSxHQUFHLFFBQVEsQ0FBQztJQUN6Qiw4QkFBYSxHQUFHLFFBQVEsQ0FBQztJQUN6Qiw4QkFBYSxHQUFHLFFBQVEsQ0FBQztJQUV6QixpQ0FBZ0IsR0FBRztRQUMvQixnQkFBZ0IsQ0FBQyxjQUFjO1FBQy9CLGdCQUFnQixDQUFDLGFBQWE7UUFDOUIsZ0JBQWdCLENBQUMsYUFBYTtRQUM5QixnQkFBZ0IsQ0FBQyxhQUFhO0tBQy9CLENBQUM7SUF1Q0osdUJBQUM7Q0FBQSxBQWxERCxJQWtEQztTQWxEWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBQZXJtaXNzaW9uc1V0aWxzIHtcbiAgcHVibGljIHN0YXRpYyBBQ1RJT05fUkVGUkVTSCA9ICdyZWZyZXNoJztcbiAgcHVibGljIHN0YXRpYyBBQ1RJT05fSU5TRVJUID0gJ2luc2VydCc7XG4gIHB1YmxpYyBzdGF0aWMgQUNUSU9OX1VQREFURSA9ICd1cGRhdGUnO1xuICBwdWJsaWMgc3RhdGljIEFDVElPTl9ERUxFVEUgPSAnZGVsZXRlJztcblxuICBwdWJsaWMgc3RhdGljIFNUQU5EQVJEX0FDVElPTlMgPSBbXG4gICAgUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fUkVGUkVTSCxcbiAgICBQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9JTlNFUlQsXG4gICAgUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fVVBEQVRFLFxuICAgIFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX0RFTEVURVxuICBdO1xuXG4gIHN0YXRpYyBjaGVja0VuYWJsZWRQZXJtaXNzaW9uKHBlcm1pc3Npb246IE9QZXJtaXNzaW9ucyk6IGJvb2xlYW4ge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChwZXJtaXNzaW9uKSAmJiBwZXJtaXNzaW9uLmVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ01FU1NBR0VTLk9QRVJBVElPTl9OT1RfQUxMT1dFRF9QRVJNSVNTSU9OJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc3RhdGljIHJlZ2lzdGVyRGlzYWJsZWRDaGFuZ2VzSW5Eb20obmF0aXZlRWxlbWVudDogYW55LCBhcmdzPzogYW55KTogTXV0YXRpb25PYnNlcnZlciB7XG4gICAgY29uc3QgY2FsbGJhY2s6IEZ1bmN0aW9uID0gYXJncyAmJiBhcmdzLmNhbGxiYWNrID8gYXJncy5jYWxsYmFjayA6IFBlcm1pc3Npb25zVXRpbHMuc2V0RGlzYWJsZWRET01FbGVtZW50O1xuICAgIGNvbnN0IGNoZWNrU3RyaW5nVmFsdWU6IGJvb2xlYW4gPSAhIShhcmdzICYmIGFyZ3MuY2hlY2tTdHJpbmdWYWx1ZSk7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZChuYXRpdmVFbGVtZW50KSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9uczogTXV0YXRpb25SZWNvcmRbXSkgPT4ge1xuICAgICAgY29uc3QgbXV0YXRpb24gPSBtdXRhdGlvbnNbMF07XG4gICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gJ2F0dHJpYnV0ZXMnICYmIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT09ICdkaXNhYmxlZCcpIHtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlID0gKG11dGF0aW9uLnRhcmdldCBhcyBhbnkpLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKCdkaXNhYmxlZCcpO1xuICAgICAgICBpZiAoYXR0cmlidXRlID09PSBudWxsIHx8IChjaGVja1N0cmluZ1ZhbHVlICYmIGF0dHJpYnV0ZS52YWx1ZSAhPT0gJ3RydWUnKSkge1xuICAgICAgICAgIGNhbGxiYWNrKG11dGF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKG5hdGl2ZUVsZW1lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFsnZGlzYWJsZWQnXVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG11dGF0aW9uT2JzZXJ2ZXI7XG4gIH1cblxuICBzdGF0aWMgc2V0RGlzYWJsZWRET01FbGVtZW50KG11dGF0aW9uOiBNdXRhdGlvblJlY29yZCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5tdXRhdGlvbi50YXJnZXQ7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ3RydWUnKTtcbiAgfVxufVxuIl19