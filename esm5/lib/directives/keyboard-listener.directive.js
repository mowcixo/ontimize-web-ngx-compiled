import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Util } from '../util/util';
var OKeyboardListenerDirective = (function () {
    function OKeyboardListenerDirective() {
        this.onKeysPressed = new EventEmitter();
        this.keyboardNumberKeysArray = [];
        this.activeKeys = {};
    }
    OKeyboardListenerDirective.prototype.keyDown = function (e) {
        var pressedCode = e.keyCode;
        if (this.keyboardNumberKeysArray.indexOf(pressedCode) !== -1) {
            this.activeKeys[pressedCode] = true;
            this.checkNeededKeys(e);
        }
    };
    OKeyboardListenerDirective.prototype.keyUp = function (e) {
        var pressedCode = e.keyCode;
        if (this.keyboardNumberKeysArray.indexOf(pressedCode) !== -1) {
            this.activeKeys[pressedCode] = false;
        }
    };
    OKeyboardListenerDirective.prototype.ngOnInit = function () {
        this.parseKeyboardKeys();
    };
    OKeyboardListenerDirective.prototype.parseKeyboardKeys = function () {
        var _this = this;
        var keysAsStringArray = Util.parseArray(this.keyboardKeys);
        keysAsStringArray.forEach(function (key) {
            try {
                _this.keyboardNumberKeysArray.push(parseInt(key, 10));
            }
            catch (e) {
                console.error(e);
            }
        });
    };
    OKeyboardListenerDirective.prototype.checkNeededKeys = function (e) {
        var _this = this;
        var trigger = true;
        this.keyboardNumberKeysArray.forEach(function (key) {
            trigger = trigger && _this.activeKeys[key];
        });
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();
            this.onKeysPressed.emit();
        }
    };
    OKeyboardListenerDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[oKeyboardListener]'
                },] }
    ];
    OKeyboardListenerDirective.propDecorators = {
        keyboardKeys: [{ type: Input }],
        onKeysPressed: [{ type: Output }],
        keyDown: [{ type: HostListener, args: ['keydown', ['$event'],] }],
        keyUp: [{ type: HostListener, args: ['keyup', ['$event'],] }]
    };
    return OKeyboardListenerDirective;
}());
export { OKeyboardListenerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQtbGlzdGVuZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL2tleWJvYXJkLWxpc3RlbmVyLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXBDO0lBQUE7UUFNWSxrQkFBYSxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBRWpFLDRCQUF1QixHQUFrQixFQUFFLENBQUM7UUFDNUMsZUFBVSxHQUFXLEVBQUUsQ0FBQztJQStDcEMsQ0FBQztJQTVDQyw0Q0FBTyxHQURQLFVBQ1EsQ0FBZ0I7UUFDdEIsSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDNUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDcEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN6QjtJQUNILENBQUM7SUFHRCwwQ0FBSyxHQURMLFVBQ00sQ0FBZ0I7UUFDcEIsSUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDNUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDdEM7SUFDSCxDQUFDO0lBRUQsNkNBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxzREFBaUIsR0FBakI7UUFBQSxpQkFTQztRQVJDLElBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0QsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRztZQUMzQixJQUFJO2dCQUNGLEtBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3REO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNsQjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG9EQUFlLEdBQWYsVUFBZ0IsQ0FBZ0I7UUFBaEMsaUJBV0M7UUFWQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUc7WUFDdEMsT0FBTyxHQUFHLE9BQU8sSUFBSSxLQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxPQUFPLEVBQUU7WUFDWCxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDbkIsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBRXBCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDM0I7SUFDSCxDQUFDOztnQkF0REYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxxQkFBcUI7aUJBQ2hDOzs7K0JBR0UsS0FBSztnQ0FDTCxNQUFNOzBCQUtOLFlBQVksU0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7d0JBU2xDLFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0lBb0NuQyxpQ0FBQztDQUFBLEFBeERELElBd0RDO1NBckRZLDBCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW29LZXlib2FyZExpc3RlbmVyXSdcbn0pXG5leHBvcnQgY2xhc3MgT0tleWJvYXJkTGlzdGVuZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dCgpIGtleWJvYXJkS2V5czogc3RyaW5nO1xuICBAT3V0cHV0KCkgb25LZXlzUHJlc3NlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwcm90ZWN0ZWQga2V5Ym9hcmROdW1iZXJLZXlzQXJyYXk6IEFycmF5PG51bWJlcj4gPSBbXTtcbiAgcHJvdGVjdGVkIGFjdGl2ZUtleXM6IG9iamVjdCA9IHt9O1xuXG4gIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICBrZXlEb3duKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCBwcmVzc2VkQ29kZSA9IGUua2V5Q29kZTtcbiAgICBpZiAodGhpcy5rZXlib2FyZE51bWJlcktleXNBcnJheS5pbmRleE9mKHByZXNzZWRDb2RlKSAhPT0gLTEpIHtcbiAgICAgIHRoaXMuYWN0aXZlS2V5c1twcmVzc2VkQ29kZV0gPSB0cnVlO1xuICAgICAgdGhpcy5jaGVja05lZWRlZEtleXMoZSk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigna2V5dXAnLCBbJyRldmVudCddKVxuICBrZXlVcChlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3QgcHJlc3NlZENvZGUgPSBlLmtleUNvZGU7XG4gICAgaWYgKHRoaXMua2V5Ym9hcmROdW1iZXJLZXlzQXJyYXkuaW5kZXhPZihwcmVzc2VkQ29kZSkgIT09IC0xKSB7XG4gICAgICB0aGlzLmFjdGl2ZUtleXNbcHJlc3NlZENvZGVdID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5wYXJzZUtleWJvYXJkS2V5cygpO1xuICB9XG5cbiAgcGFyc2VLZXlib2FyZEtleXMoKSB7XG4gICAgY29uc3Qga2V5c0FzU3RyaW5nQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5rZXlib2FyZEtleXMpO1xuICAgIGtleXNBc1N0cmluZ0FycmF5LmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMua2V5Ym9hcmROdW1iZXJLZXlzQXJyYXkucHVzaChwYXJzZUludChrZXksIDEwKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjaGVja05lZWRlZEtleXMoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgIGxldCB0cmlnZ2VyID0gdHJ1ZTtcbiAgICB0aGlzLmtleWJvYXJkTnVtYmVyS2V5c0FycmF5LmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHRyaWdnZXIgPSB0cmlnZ2VyICYmIHRoaXMuYWN0aXZlS2V5c1trZXldO1xuICAgIH0pO1xuICAgIGlmICh0cmlnZ2VyKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgLy8gdGhpcy5hY3RpdmVLZXlzID0ge307XG4gICAgICB0aGlzLm9uS2V5c1ByZXNzZWQuZW1pdCgpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=