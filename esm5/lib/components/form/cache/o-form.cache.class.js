import { EventEmitter } from '@angular/core';
import { Util } from '../../../util/util';
var OFormCacheClass = (function () {
    function OFormCacheClass(form) {
        this.form = form;
        this.initialDataCache = {};
        this.valueChangesStack = [];
        this._componentsSubscritpions = {};
        this.blockCaching = false;
        this.initializedCache = false;
        this.onCacheEmptyStateChanges = new EventEmitter();
        this.onCacheStateChanges = new EventEmitter();
        this.changedFormControls = [];
    }
    OFormCacheClass.prototype.updateFormDataCache = function () {
        this.formDataCache = this.form.getRegisteredFieldsValues();
    };
    OFormCacheClass.prototype.addChangeToStack = function (comp) {
        var currentValue = comp.getFormControl().value;
        var wasEmpty = this.valueChangesStack.length === 0;
        this.valueChangesStack.push({
            attr: comp.getAttribute(),
            value: currentValue
        });
        if (wasEmpty) {
            this.onCacheEmptyStateChanges.emit(false);
        }
        this.onCacheStateChanges.emit();
    };
    OFormCacheClass.prototype.registerComponentCaching = function (comp) {
        var self = this;
        var attr = comp.getAttribute();
        var listenTo = this.form.detectChangesOnBlur ? comp.onValueChange : comp.onChange;
        if (!Util.isDefined(listenTo)) {
            return;
        }
        this._componentsSubscritpions[attr] = listenTo.subscribe(function () {
            if (self.initializedCache && !self.blockCaching && self.hasComponentChanged(attr, comp)) {
                if (self.changedFormControls.indexOf(attr) === -1) {
                    self.changedFormControls.push(attr);
                }
                self.updateFormDataCache();
                self.addChangeToStack(comp);
            }
        });
    };
    OFormCacheClass.prototype.getCachedValue = function (attr) {
        if (this.formDataCache && this.formDataCache.hasOwnProperty(attr)) {
            return this.formDataCache[attr];
        }
        return undefined;
    };
    OFormCacheClass.prototype.destroy = function () {
        var _this = this;
        Object.keys(this._componentsSubscritpions).forEach(function (attr) {
            var subs = _this._componentsSubscritpions[attr];
            subs.unsubscribe();
        });
        this._componentsSubscritpions = {};
        this.formDataCache = undefined;
        this.changedFormControls = [];
    };
    OFormCacheClass.prototype.removeUndefinedProperties = function (arg) {
        Object.keys(arg).forEach(function (key) {
            if (arg[key] === undefined) {
                delete arg[key];
            }
        });
        return arg;
    };
    OFormCacheClass.prototype.registerCache = function () {
        var initialCache = this.form.getRegisteredFieldsValues();
        this.removeUndefinedProperties(initialCache);
        this.initializeCache(initialCache);
        this.formDataCache = initialCache;
        var components = this.form.getComponents();
        var self = this;
        Object.keys(components).forEach(function (attr) {
            var comp = components[attr];
            if (comp.isAutomaticRegistering()) {
                self.registerComponentCaching(comp);
            }
        });
    };
    OFormCacheClass.prototype.initializeCache = function (val) {
        this.initialDataCache = val;
        this.valueChangesStack = [];
        this.onCacheEmptyStateChanges.emit(true);
        this.initializedCache = true;
        this.changedFormControls = [];
    };
    OFormCacheClass.prototype.getInitialDataCache = function () {
        return this.initialDataCache;
    };
    OFormCacheClass.prototype.getDataCache = function () {
        return this.formDataCache;
    };
    OFormCacheClass.prototype.restartCache = function () {
        this.formDataCache = undefined;
        this.initializeCache({});
        this.initializedCache = false;
        this.onCacheStateChanges.emit();
    };
    OFormCacheClass.prototype.setCacheSnapshot = function () {
        this.initializeCache(this.getDataCache());
    };
    OFormCacheClass.prototype.undoLastChange = function (options) {
        if (options === void 0) { options = {}; }
        var lastElement = this.valueChangesStack[this.valueChangesStack.length - 1];
        if (lastElement) {
            var lastCacheValue = this.getCacheLastValue(lastElement.attr);
            var lastValue = (lastCacheValue !== null) ? lastCacheValue : this.initialDataCache[lastElement.attr];
            this.undoComponentValue(lastElement.attr, lastValue);
            this.updateFormDataCache();
            this.onCacheStateChanges.emit();
        }
    };
    OFormCacheClass.prototype.undoComponentValue = function (attr, val) {
        this.blockCaching = true;
        var comp = this.form.getFieldReference(attr);
        if (comp) {
            comp.setValue(val);
        }
        this.blockCaching = false;
    };
    OFormCacheClass.prototype.hasComponentChanged = function (attr, comp) {
        var currentValue = comp.getFormControl().value;
        var cache = this.formDataCache || this.initialDataCache;
        return (currentValue !== cache[attr]);
    };
    OFormCacheClass.prototype.getCacheLastValue = function (attr) {
        this.updateChangesStack(attr);
        var result = null;
        for (var i = this.valueChangesStack.length - 1; i >= 0; i--) {
            var current = this.valueChangesStack[i];
            if (current.attr === attr) {
                result = current.value;
                break;
            }
        }
        return result;
    };
    OFormCacheClass.prototype.updateChangesStack = function (attr) {
        var index;
        for (var i = this.valueChangesStack.length - 1; i >= 0; i--) {
            var current = this.valueChangesStack[i];
            if (current.attr === attr) {
                index = i;
                break;
            }
        }
        if (index !== undefined) {
            for (var i = index; i >= 0; i--) {
                var prev = this.valueChangesStack[i - 1];
                var current = this.valueChangesStack[i];
                if (current.attr === attr) {
                    this.valueChangesStack.splice(i, 1);
                    if (!prev || prev.attr === attr) {
                        continue;
                    }
                    else {
                        break;
                    }
                }
            }
        }
        if (this.valueChangesStack.length === 0) {
            this.onCacheEmptyStateChanges.emit(true);
        }
    };
    Object.defineProperty(OFormCacheClass.prototype, "isCacheStackEmpty", {
        get: function () {
            return (this.valueChangesStack.length === 0);
        },
        enumerable: true,
        configurable: true
    });
    OFormCacheClass.prototype.isInitialStateChanged = function () {
        var currentCache;
        if (this.formDataCache) {
            currentCache = Object.assign({}, this.formDataCache);
            this.removeUndefinedProperties(currentCache);
        }
        var initialKeys = Object.keys(this.initialDataCache);
        var currentKeys = currentCache ? Object.keys(currentCache) : initialKeys;
        if (initialKeys.length !== currentKeys.length) {
            return true;
        }
        var res = false;
        for (var i = 0, len = initialKeys.length; i < len; i++) {
            var key = initialKeys[i];
            res = (this.initialDataCache[key] !== currentCache[key]);
            if (res) {
                break;
            }
        }
        return res;
    };
    OFormCacheClass.prototype.getChangedFormControlsAttr = function () {
        return this.changedFormControls;
    };
    return OFormCacheClass;
}());
export { OFormCacheClass };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLmNhY2hlLmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2Zvcm0vY2FjaGUvby1mb3JtLmNhY2hlLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFLN0MsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRzFDO0lBY0UseUJBQXNCLElBQW9CO1FBQXBCLFNBQUksR0FBSixJQUFJLENBQWdCO1FBWmhDLHFCQUFnQixHQUFXLEVBQUUsQ0FBQztRQUU5QixzQkFBaUIsR0FBZSxFQUFFLENBQUM7UUFDbkMsNkJBQXdCLEdBQVEsRUFBRSxDQUFDO1FBQ25DLGlCQUFZLEdBQVksS0FBSyxDQUFDO1FBQzlCLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQUU1Qyw2QkFBd0IsR0FBMEIsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUM5RSx3QkFBbUIsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUV2RCx3QkFBbUIsR0FBYSxFQUFFLENBQUM7SUFHN0MsQ0FBQztJQUVTLDZDQUFtQixHQUE3QjtRQUNFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0lBQzdELENBQUM7SUFFUywwQ0FBZ0IsR0FBMUIsVUFBMkIsSUFBMkI7UUFDcEQsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNqRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDO1lBQzFCLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3pCLEtBQUssRUFBRSxZQUFZO1NBQ3BCLENB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LFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFDM0UsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDN0MsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQztRQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RELElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUzQixHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEtBQUssWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDekQsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsTUFBTTthQUNQO1NBQ0Y7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxvREFBMEIsR0FBMUI7UUFDRSxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztJQUNsQyxDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBN05ELElBNk5DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSUZvcm1Db250cm9sQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9mb3JtLWNvbnRyb2wtY29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBJRm9ybURhdGFDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL2Zvcm0tZGF0YS1jb21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi9vLWZvcm0uY29tcG9uZW50JztcblxuZXhwb3J0IGNsYXNzIE9Gb3JtQ2FjaGVDbGFzcyB7XG5cbiAgcHJvdGVjdGVkIGluaXRpYWxEYXRhQ2FjaGU6IG9iamVjdCA9IHt9O1xuICBwcm90ZWN0ZWQgZm9ybURhdGFDYWNoZTogb2JqZWN0O1xuICBwcm90ZWN0ZWQgdmFsdWVDaGFuZ2VzU3RhY2s6IEFycmF5PGFueT4gPSBbXTtcbiAgcHJvdGVjdGVkIF9jb21wb25lbnRzU3Vic2NyaXRwaW9uczogYW55ID0ge307XG4gIHByb3RlY3RlZCBibG9ja0NhY2hpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJvdGVjdGVkIGluaXRpYWxpemVkQ2FjaGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBvbkNhY2hlRW1wdHlTdGF0ZUNoYW5nZXM6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgb25DYWNoZVN0YXRlQ2hhbmdlczogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwcm90ZWN0ZWQgY2hhbmdlZEZvcm1Db250cm9sczogc3RyaW5nW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZm9ybTogT0Zvcm1Db21wb25lbnQpIHtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVGb3JtRGF0YUNhY2hlKCkge1xuICAgIHRoaXMuZm9ybURhdGFDYWNoZSA9IHRoaXMuZm9ybS5nZXRSZWdpc3RlcmVkRmllbGRzVmFsdWVzKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYWRkQ2hhbmdlVG9TdGFjayhjb21wOiBJRm9ybUNvbnRyb2xDb21wb25lbnQpIHtcbiAgICBjb25zdCBjdXJyZW50VmFsdWUgPSBjb21wLmdldEZvcm1Db250cm9sKCkudmFsdWU7XG4gICAgY29uc3Qgd2FzRW1wdHkgPSB0aGlzLnZhbHVlQ2hhbmdlc1N0YWNrLmxlbmd0aCA9PT0gMDtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlc1N0YWNrLnB1c2goe1xuICAgICAgYXR0cjogY29tcC5nZXRBdHRyaWJ1dGUoKSxcbiAgICAgIHZhbHVlOiBjdXJyZW50VmFsdWVcbiAgICB9KTtcbiAgICBpZiAod2FzRW1wdHkpIHtcbiAgICAgIHRoaXMub25DYWNoZUVtcHR5U3RhdGVDaGFuZ2VzLmVtaXQoZmFsc2UpO1xuICAgIH1cbiAgICB0aGlzLm9uQ2FjaGVTdGF0ZUNoYW5nZXMuZW1pdCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZ2lzdGVyQ29tcG9uZW50Q2FjaGluZyhjb21wOiBJRm9ybURhdGFDb21wb25lbnQpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBhdHRyID0gY29tcC5nZXRBdHRyaWJ1dGUoKTtcbiAgICBjb25zdCBsaXN0ZW5UbyA9IHRoaXMuZm9ybS5kZXRlY3RDaGFuZ2VzT25CbHVyID8gY29tcC5vblZhbHVlQ2hhbmdlIDogY29tcC5vbkNoYW5nZTtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKGxpc3RlblRvKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9jb21wb25lbnRzU3Vic2NyaXRwaW9uc1thdHRyXSA9IGxpc3RlblRvLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAoc2VsZi5pbml0aWFsaXplZENhY2hlICYmICFzZWxmLmJsb2NrQ2FjaGluZyAmJiBzZWxmLmhhc0NvbXBvbmVudENoYW5nZWQoYXR0ciwgY29tcCkpIHtcbiAgICAgICAgaWYgKHNlbGYuY2hhbmdlZEZvcm1Db250cm9scy5pbmRleE9mKGF0dHIpID09PSAtMSkge1xuICAgICAgICAgIHNlbGYuY2hhbmdlZEZvcm1Db250cm9scy5wdXNoKGF0dHIpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYudXBkYXRlRm9ybURhdGFDYWNoZSgpO1xuICAgICAgICBzZWxmLmFkZENoYW5nZVRvU3RhY2soY29tcCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRDYWNoZWRWYWx1ZShhdHRyOiBzdHJpbmcpOiBhbnkge1xuICAgIGlmICh0aGlzLmZvcm1EYXRhQ2FjaGUgJiYgdGhpcy5mb3JtRGF0YUNhY2hlLmhhc093blByb3BlcnR5KGF0dHIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5mb3JtRGF0YUNhY2hlW2F0dHJdO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9jb21wb25lbnRzU3Vic2NyaXRwaW9ucykuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgY29uc3Qgc3ViczogU3Vic2NyaXB0aW9uID0gdGhpcy5fY29tcG9uZW50c1N1YnNjcml0cGlvbnNbYXR0cl07XG4gICAgICBzdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgfSk7XG4gICAgdGhpcy5fY29tcG9uZW50c1N1YnNjcml0cGlvbnMgPSB7fTtcbiAgICB0aGlzLmZvcm1EYXRhQ2FjaGUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jaGFuZ2VkRm9ybUNvbnRyb2xzID0gW107XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVtb3ZlVW5kZWZpbmVkUHJvcGVydGllcyhhcmc6IGFueSk6IGFueSB7XG4gICAgT2JqZWN0LmtleXMoYXJnKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmIChhcmdba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRlbGV0ZSBhcmdba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYXJnO1xuICB9XG5cbiAgcmVnaXN0ZXJDYWNoZSgpIHtcbiAgICBjb25zdCBpbml0aWFsQ2FjaGUgPSB0aGlzLmZvcm0uZ2V0UmVnaXN0ZXJlZEZpZWxkc1ZhbHVlcygpO1xuICAgIHRoaXMucmVtb3ZlVW5kZWZpbmVkUHJvcGVydGllcyhpbml0aWFsQ2FjaGUpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUNhY2hlKGluaXRpYWxDYWNoZSk7XG4gICAgdGhpcy5mb3JtRGF0YUNhY2hlID0gaW5pdGlhbENhY2hlO1xuXG4gICAgY29uc3QgY29tcG9uZW50cyA9IHRoaXMuZm9ybS5nZXRDb21wb25lbnRzKCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgT2JqZWN0LmtleXMoY29tcG9uZW50cykuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgIGNvbnN0IGNvbXA6IElGb3JtRGF0YUNvbXBvbmVudCA9IGNvbXBvbmVudHNbYXR0cl07XG4gICAgICBpZiAoY29tcC5pc0F1dG9tYXRpY1JlZ2lzdGVyaW5nKCkpIHtcbiAgICAgICAgc2VsZi5yZWdpc3RlckNvbXBvbmVudENhY2hpbmcoY29tcCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBpbml0aWFsaXplQ2FjaGUodmFsOiBhbnkpIHtcbiAgICB0aGlzLmluaXRpYWxEYXRhQ2FjaGUgPSB2YWw7XG4gICAgdGhpcy52YWx1ZUNoYW5nZXNTdGFjayA9IFtdO1xuICAgIHRoaXMub25DYWNoZUVtcHR5U3RhdGVDaGFuZ2VzLmVtaXQodHJ1ZSk7XG4gICAgdGhpcy5pbml0aWFsaXplZENhY2hlID0gdHJ1ZTtcbiAgICB0aGlzLmNoYW5nZWRGb3JtQ29udHJvbHMgPSBbXTtcbiAgfVxuXG4gIGdldEluaXRpYWxEYXRhQ2FjaGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbERhdGFDYWNoZTtcbiAgfVxuXG4gIGdldERhdGFDYWNoZSgpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtRGF0YUNhY2hlO1xuICB9XG5cbiAgcmVzdGFydENhY2hlKCkge1xuICAgIHRoaXMuZm9ybURhdGFDYWNoZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmluaXRpYWxpemVDYWNoZSh7fSk7XG4gICAgdGhpcy5pbml0aWFsaXplZENhY2hlID0gZmFsc2U7XG4gICAgdGhpcy5vbkNhY2hlU3RhdGVDaGFuZ2VzLmVtaXQoKTtcbiAgfVxuXG4gIHNldENhY2hlU25hcHNob3QoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplQ2FjaGUodGhpcy5nZXREYXRhQ2FjaGUoKSk7XG4gIH1cblxuICB1bmRvTGFzdENoYW5nZShvcHRpb25zOiBhbnkgPSB7fSkge1xuICAgIGNvbnN0IGxhc3RFbGVtZW50ID0gdGhpcy52YWx1ZUNoYW5nZXNTdGFja1t0aGlzLnZhbHVlQ2hhbmdlc1N0YWNrLmxlbmd0aCAtIDFdO1xuICAgIGlmIChsYXN0RWxlbWVudCkge1xuICAgICAgY29uc3QgbGFzdENhY2hlVmFsdWUgPSB0aGlzLmdldENhY2hlTGFzdFZhbHVlKGxhc3RFbGVtZW50LmF0dHIpO1xuICAgICAgY29uc3QgbGFzdFZhbHVlID0gKGxhc3RDYWNoZVZhbHVlICE9PSBudWxsKSA/IGxhc3RDYWNoZVZhbHVlIDogdGhpcy5pbml0aWFsRGF0YUNhY2hlW2xhc3RFbGVtZW50LmF0dHJdO1xuICAgICAgdGhpcy51bmRvQ29tcG9uZW50VmFsdWUobGFzdEVsZW1lbnQuYXR0ciwgbGFzdFZhbHVlKTtcblxuICAgICAgdGhpcy51cGRhdGVGb3JtRGF0YUNhY2hlKCk7XG4gICAgICB0aGlzLm9uQ2FjaGVTdGF0ZUNoYW5nZXMuZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB1bmRvQ29tcG9uZW50VmFsdWUoYXR0cjogc3RyaW5nLCB2YWw6IGFueSkge1xuICAgIHRoaXMuYmxvY2tDYWNoaW5nID0gdHJ1ZTtcbiAgICBjb25zdCBjb21wID0gdGhpcy5mb3JtLmdldEZpZWxkUmVmZXJlbmNlKGF0dHIpO1xuICAgIGlmIChjb21wKSB7XG4gICAgICAvLyAoY29tcCBhcyBhbnkpLm9sZFZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgY29tcC5zZXRWYWx1ZSh2YWwpO1xuICAgIH1cbiAgICB0aGlzLmJsb2NrQ2FjaGluZyA9IGZhbHNlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGhhc0NvbXBvbmVudENoYW5nZWQoYXR0cjogc3RyaW5nLCBjb21wOiBJRm9ybUNvbnRyb2xDb21wb25lbnQpOiBib29sZWFuIHtcbiAgICBjb25zdCBjdXJyZW50VmFsdWUgPSBjb21wLmdldEZvcm1Db250cm9sKCkudmFsdWU7XG4gICAgY29uc3QgY2FjaGUgPSB0aGlzLmZvcm1EYXRhQ2FjaGUgfHwgdGhpcy5pbml0aWFsRGF0YUNhY2hlO1xuICAgIHJldHVybiAoY3VycmVudFZhbHVlICE9PSBjYWNoZVthdHRyXSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Q2FjaGVMYXN0VmFsdWUoYXR0cjogc3RyaW5nKTogYW55IHtcbiAgICB0aGlzLnVwZGF0ZUNoYW5nZXNTdGFjayhhdHRyKTtcbiAgICBsZXQgcmVzdWx0ID0gbnVsbDtcbiAgICBmb3IgKGxldCBpID0gdGhpcy52YWx1ZUNoYW5nZXNTdGFjay5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMudmFsdWVDaGFuZ2VzU3RhY2tbaV07XG4gICAgICBpZiAoY3VycmVudC5hdHRyID09PSBhdHRyKSB7XG4gICAgICAgIHJlc3VsdCA9IGN1cnJlbnQudmFsdWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZUNoYW5nZXNTdGFjayhhdHRyOiBzdHJpbmcpIHtcbiAgICBsZXQgaW5kZXg6IG51bWJlcjtcbiAgICBmb3IgKGxldCBpID0gdGhpcy52YWx1ZUNoYW5nZXNTdGFjay5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMudmFsdWVDaGFuZ2VzU3RhY2tbaV07XG4gICAgICBpZiAoY3VycmVudC5hdHRyID09PSBhdHRyKSB7XG4gICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKGxldCBpID0gaW5kZXg7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLnZhbHVlQ2hhbmdlc1N0YWNrW2kgLSAxXTtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMudmFsdWVDaGFuZ2VzU3RhY2tbaV07XG4gICAgICAgIGlmIChjdXJyZW50LmF0dHIgPT09IGF0dHIpIHtcbiAgICAgICAgICB0aGlzLnZhbHVlQ2hhbmdlc1N0YWNrLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBpZiAoIXByZXYgfHwgcHJldi5hdHRyID09PSBhdHRyKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnZhbHVlQ2hhbmdlc1N0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5vbkNhY2hlRW1wdHlTdGF0ZUNoYW5nZXMuZW1pdCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgaXNDYWNoZVN0YWNrRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLnZhbHVlQ2hhbmdlc1N0YWNrLmxlbmd0aCA9PT0gMCk7XG4gIH1cblxuICBpc0luaXRpYWxTdGF0ZUNoYW5nZWQoKTogYm9vbGVhbiB7XG4gICAgbGV0IGN1cnJlbnRDYWNoZTtcbiAgICBpZiAodGhpcy5mb3JtRGF0YUNhY2hlKSB7XG4gICAgICBjdXJyZW50Q2FjaGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmZvcm1EYXRhQ2FjaGUpO1xuICAgICAgdGhpcy5yZW1vdmVVbmRlZmluZWRQcm9wZXJ0aWVzKGN1cnJlbnRDYWNoZSk7XG4gICAgfVxuXG4gICAgY29uc3QgaW5pdGlhbEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmluaXRpYWxEYXRhQ2FjaGUpO1xuICAgIGNvbnN0IGN1cnJlbnRLZXlzID0gY3VycmVudENhY2hlID8gT2JqZWN0LmtleXMoY3VycmVudENhY2hlKSA6IGluaXRpYWxLZXlzO1xuICAgIGlmIChpbml0aWFsS2V5cy5sZW5ndGggIT09IGN1cnJlbnRLZXlzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGxldCByZXMgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gaW5pdGlhbEtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IGluaXRpYWxLZXlzW2ldO1xuICAgICAgLy8gVE9ETyBiZSBjYXJlZnVsIHdpdGggdHlwZXMgY29tcGFyaXNpb25zXG4gICAgICByZXMgPSAodGhpcy5pbml0aWFsRGF0YUNhY2hlW2tleV0gIT09IGN1cnJlbnRDYWNoZVtrZXldKTtcbiAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBnZXRDaGFuZ2VkRm9ybUNvbnRyb2xzQXR0cigpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbmdlZEZvcm1Db250cm9scztcbiAgfVxufVxuIl19