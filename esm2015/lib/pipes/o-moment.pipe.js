import { Injector, Pipe } from '@angular/core';
import { MomentService } from '../services/moment.service';
export class OMomentPipe {
    constructor(injector) {
        this.injector = injector;
        this.momentService = this.injector.get(MomentService);
    }
    transform(value, args) {
        const format = args.format;
        return this.momentService.parseDate(value, format);
    }
}
OMomentPipe.decorators = [
    { type: Pipe, args: [{
                name: 'oMoment'
            },] }
];
OMomentPipe.ctorParameters = () => [
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1tb21lbnQucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvcGlwZXMvby1tb21lbnQucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBVTNELE1BQU0sT0FBTyxXQUFXO0lBSXRCLFlBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQVUsRUFBRSxJQUF5QjtRQUM3QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELENBQUM7OztZQWZGLElBQUksU0FBQztnQkFDSixJQUFJLEVBQUUsU0FBUzthQUNoQjs7O1lBVlEsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdG9yLCBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE1vbWVudFNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9tb21lbnQuc2VydmljZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU1vbWVudFBpcGVBcmd1bWVudCB7XG4gIGZvcm1hdD86IHN0cmluZztcbn1cblxuQFBpcGUoe1xuICBuYW1lOiAnb01vbWVudCdcbn0pXG5cbmV4cG9ydCBjbGFzcyBPTW9tZW50UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gIHByb3RlY3RlZCBtb21lbnRTZXJ2aWNlOiBNb21lbnRTZXJ2aWNlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLm1vbWVudFNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChNb21lbnRTZXJ2aWNlKTtcbiAgfVxuXG4gIHRyYW5zZm9ybSh2YWx1ZTogYW55LCBhcmdzOiBJTW9tZW50UGlwZUFyZ3VtZW50KSB7XG4gICAgY29uc3QgZm9ybWF0ID0gYXJncy5mb3JtYXQ7XG4gICAgcmV0dXJuIHRoaXMubW9tZW50U2VydmljZS5wYXJzZURhdGUodmFsdWUsIGZvcm1hdCk7XG4gIH1cbn1cbiJdfQ==