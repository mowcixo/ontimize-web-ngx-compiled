import { Pipe } from '@angular/core';
var OTableRowClassPipe = (function () {
    function OTableRowClassPipe() {
    }
    OTableRowClassPipe.prototype.transform = function (rowData, rowIndex, rowClassFn) {
        return rowClassFn ? rowClassFn(rowData, rowIndex) : '';
    };
    OTableRowClassPipe.decorators = [
        { type: Pipe, args: [{ name: 'oTableRowClass' },] }
    ];
    return OTableRowClassPipe;
}());
export { OTableRowClassPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1yb3ctY2xhc3MucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL3BpcGVzL28tdGFibGUtcm93LWNsYXNzLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFFcEQ7SUFBQTtJQU9BLENBQUM7SUFKQyxzQ0FBUyxHQUFULFVBQVUsT0FBWSxFQUFFLFFBQWdCLEVBQUUsVUFBMkQ7UUFDbkcsT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN6RCxDQUFDOztnQkFMRixJQUFJLFNBQUMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7O0lBT2hDLHlCQUFDO0NBQUEsQUFQRCxJQU9DO1NBTlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AUGlwZSh7IG5hbWU6ICdvVGFibGVSb3dDbGFzcycgfSlcbmV4cG9ydCBjbGFzcyBPVGFibGVSb3dDbGFzc1BpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICB0cmFuc2Zvcm0ocm93RGF0YTogYW55LCByb3dJbmRleDogbnVtYmVyLCByb3dDbGFzc0ZuPzogKHJvdzogYW55LCBpbmRleDogbnVtYmVyKSA9PiBzdHJpbmcgfCBzdHJpbmdbXSk6IHN0cmluZyB8IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gcm93Q2xhc3NGbiA/IHJvd0NsYXNzRm4ocm93RGF0YSwgcm93SW5kZXgpIDogJyc7XG4gIH1cblxufVxuIl19