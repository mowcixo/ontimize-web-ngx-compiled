import { Component, ElementRef, EventEmitter, forwardRef, Input, NgZone, Output, ViewChild, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Util } from '../../../util/util';
var defaults = {
    contentsCss: [''],
    customConfig: ''
};
var CKEditorComponent = (function () {
    function CKEditorComponent(ngZone) {
        this.ngZone = ngZone;
        this.innerValue = '';
        this._readonly = false;
        this.config = {};
        this.skin = 'moono-lisa';
        this.language = 'en';
        this.fullPage = false;
        this.inline = false;
        this.change = new EventEmitter();
        this.ready = new EventEmitter();
        this.blur = new EventEmitter();
        this.focus = new EventEmitter();
    }
    Object.defineProperty(CKEditorComponent.prototype, "instance", {
        get: function () {
            return this.ckIns;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CKEditorComponent.prototype, "readonly", {
        get: function () {
            return this._readonly;
        },
        set: function (value) {
            var _this = this;
            this._readonly = value;
            setTimeout(function () {
                if (Util.isDefined(_this.ckIns) && Util.isDefined(_this.ckIns.editable())) {
                    _this.ckIns.setReadOnly(_this.readonly);
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    CKEditorComponent.getRandomIdentifier = function (id) {
        if (id === void 0) { id = ''; }
        return 'editor-' + (id !== '' ? id : Math.round(Math.random() * 100000000));
    };
    CKEditorComponent.prototype.ngOnDestroy = function () {
        this.destroyCKEditor();
    };
    CKEditorComponent.prototype.ngAfterViewInit = function () {
        this.destroyCKEditor();
        this.initCKEditor(CKEditorComponent.getRandomIdentifier(this.id));
    };
    CKEditorComponent.prototype.initCKEditor = function (identifier) {
        var _this = this;
        if (typeof CKEDITOR === 'undefined') {
            return console.warn('CKEditor 4.x is missing (http://ckeditor.com/)');
        }
        this.identifier = identifier;
        this.ck.nativeElement.setAttribute('name', this.identifier);
        var opt = Object.assign({}, defaults, this.config, {
            readOnly: this.readonly,
            skin: this.skin,
            language: this.language,
            fullPage: this.fullPage,
            inline: this.inline,
            width: '100%'
        });
        this.ckIns = this.inline
            ? CKEDITOR.inline(this.ck.nativeElement, opt)
            : CKEDITOR.replace(this.ck.nativeElement, opt);
        this.ckIns.setData(this.innerValue);
        this.ckIns.on('change', function () {
            var val = _this.ckIns.getData();
            _this.updateValue(val);
        });
        this.ckIns.on('instanceReady', function (evt) {
            _this.ngZone.run(function () {
                _this.ready.emit(evt);
            });
        });
        this.ckIns.on('blur', function (evt) {
            _this.ngZone.run(function () {
                _this.blur.emit(evt);
                _this.propagateTouch();
            });
        });
        this.ckIns.on('focus', function (evt) {
            _this.ngZone.run(function () {
                _this.focus.emit(evt);
            });
        });
    };
    CKEditorComponent.prototype.destroyCKEditor = function () {
        if (this.ckIns) {
            this.ckIns.removeAllListeners();
            if (CKEDITOR.instances.hasOwnProperty(this.ckIns.name)) {
                CKEDITOR.remove(CKEDITOR.instances[this.ckIns.name]);
            }
            this.ckIns.destroy();
            this.ckIns = null;
            var editorEl = document.querySelector('#cke_' + this.identifier);
            if (Util.isDefined(editorEl) && Util.isDefined(editorEl.parentElement)) {
                editorEl.parentElement.removeChild(editorEl);
            }
        }
    };
    CKEditorComponent.prototype.updateValue = function (value) {
        var _this = this;
        this.ngZone.run(function () {
            _this.innerValue = value;
            _this.propagateChange(value);
            _this.propagateTouch();
            _this.change.emit(value);
        });
    };
    CKEditorComponent.prototype.writeValue = function (value) {
        this.innerValue = value || '';
        if (this.ckIns) {
            this.ckIns.setData(this.innerValue);
            var val = this.ckIns.getData();
            this.ckIns.setData(val);
        }
    };
    CKEditorComponent.prototype.propagateChange = function (_) {
    };
    CKEditorComponent.prototype.propagateTouch = function () {
    };
    CKEditorComponent.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    CKEditorComponent.prototype.registerOnTouched = function (fn) {
        this.propagateTouch = fn;
    };
    CKEditorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ck-editor',
                    template: "<textarea #ck></textarea>",
                    providers: [{
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return CKEditorComponent; }),
                            multi: true
                        }],
                    exportAs: 'ckEditor'
                }] }
    ];
    CKEditorComponent.ctorParameters = function () { return [
        { type: NgZone }
    ]; };
    CKEditorComponent.propDecorators = {
        readonly: [{ type: Input }],
        config: [{ type: Input }],
        skin: [{ type: Input }],
        language: [{ type: Input }],
        fullPage: [{ type: Input }],
        inline: [{ type: Input }],
        id: [{ type: Input }],
        change: [{ type: Output }],
        ready: [{ type: Output }],
        blur: [{ type: Output }],
        focus: [{ type: Output }],
        ck: [{ type: ViewChild, args: ['ck', { static: false },] }]
    };
    return CKEditorComponent;
}());
export { CKEditorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2stZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9tYXRlcmlhbC9ja2VkaXRvci9jay1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFFTixNQUFNLEVBQ04sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFJMUMsSUFBTSxRQUFRLEdBQUc7SUFDZixXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDakIsWUFBWSxFQUFFLEVBQUU7Q0FDakIsQ0FBQztBQUVGO0lBbURFLDJCQUNZLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBckNoQixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBTXhCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFnQnJCLFdBQU0sR0FBUSxFQUFFLENBQUM7UUFDakIsU0FBSSxHQUFXLFlBQVksQ0FBQztRQUM1QixhQUFRLEdBQVcsSUFBSSxDQUFDO1FBQ3hCLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUc5QixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1QixVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMzQixTQUFJLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMxQixVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQU1qQyxDQUFDO0lBcENMLHNCQUFXLHVDQUFRO2FBQW5CO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1FB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QUFPO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7O2dCQWxLRixTQUFTLFNBQUM7b0JBRVQsUUFBUSxFQUFFLFdBQVc7b0JBQ3JCLFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLFNBQVMsRUFBRSxDQUFDOzRCQUNWLE9BQU8sRUFBRSxpQkFBaUI7NEJBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLGlCQUFpQixFQUFqQixDQUFpQixDQUFDOzRCQUNoRCxLQUFLLEVBQUUsSUFBSTt5QkFDWixDQUFDO29CQUNGLFFBQVEsRUFBRSxVQUFVO2lCQUNyQjs7O2dCQTFCQyxNQUFNOzs7MkJBdUNMLEtBQUs7eUJBY0wsS0FBSzt1QkFDTCxLQUFLOzJCQUNMLEtBQUs7MkJBQ0wsS0FBSzt5QkFDTCxLQUFLO3FCQUNMLEtBQUs7eUJBRUwsTUFBTTt3QkFDTixNQUFNO3VCQUNOLE1BQU07d0JBQ04sTUFBTTtxQkFFTixTQUFTLFNBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs7SUFtSHBDLHdCQUFDO0NBQUEsQUFwS0QsSUFvS0M7U0F6SlksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcblxuZGVjbGFyZSB2YXIgQ0tFRElUT1I6IGFueTtcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIGNvbnRlbnRzQ3NzOiBbJyddLFxuICBjdXN0b21Db25maWc6ICcnXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBjb21wb25lbnQtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdjay1lZGl0b3InLFxuICB0ZW1wbGF0ZTogYDx0ZXh0YXJlYSAjY2s+PC90ZXh0YXJlYT5gLFxuICBwcm92aWRlcnM6IFt7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQ0tFZGl0b3JDb21wb25lbnQpLFxuICAgIG11bHRpOiB0cnVlXG4gIH1dLFxuICBleHBvcnRBczogJ2NrRWRpdG9yJ1xufSlcbmV4cG9ydCBjbGFzcyBDS0VkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuXG4gIHByb3RlY3RlZCBja0luczogYW55O1xuICBwcm90ZWN0ZWQgaWRlbnRpZmllcjogc3RyaW5nO1xuICBwcm90ZWN0ZWQgaW5uZXJWYWx1ZTogc3RyaW5nID0gJyc7XG5cbiAgcHVibGljIGdldCBpbnN0YW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy5ja0lucztcbiAgfVxuXG4gIHByb3RlY3RlZCBfcmVhZG9ubHk6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBzZXQgcmVhZG9ubHkodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZWFkb25seSA9IHZhbHVlO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuY2tJbnMpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMuY2tJbnMuZWRpdGFibGUoKSkpIHtcbiAgICAgICAgdGhpcy5ja0lucy5zZXRSZWFkT25seSh0aGlzLnJlYWRvbmx5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldCByZWFkb25seSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVhZG9ubHk7XG4gIH1cblxuICBASW5wdXQoKSBwdWJsaWMgY29uZmlnOiBhbnkgPSB7fTtcbiAgQElucHV0KCkgcHVibGljIHNraW46IHN0cmluZyA9ICdtb29uby1saXNhJztcbiAgQElucHV0KCkgcHVibGljIGxhbmd1YWdlOiBzdHJpbmcgPSAnZW4nO1xuICBASW5wdXQoKSBwdWJsaWMgZnVsbFBhZ2U6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgcHVibGljIGlubGluZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBwdWJsaWMgaWQ6IHN0cmluZztcblxuICBAT3V0cHV0KCkgY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBibHVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQFZpZXdDaGlsZCgnY2snLCB7IHN0YXRpYzogZmFsc2UgfSkgcHVibGljIGNrOiBFbGVtZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBuZ1pvbmU6IE5nWm9uZVxuICApIHsgfVxuXG4gIHByb3RlY3RlZCBzdGF0aWMgZ2V0UmFuZG9tSWRlbnRpZmllcihpZDogc3RyaW5nID0gJycpIHtcbiAgICByZXR1cm4gJ2VkaXRvci0nICsgKGlkICE9PSAnJyA/IGlkIDogTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMDAwMDAwKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3lDS0VkaXRvcigpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZGVzdHJveUNLRWRpdG9yKCk7XG4gICAgdGhpcy5pbml0Q0tFZGl0b3IoQ0tFZGl0b3JDb21wb25lbnQuZ2V0UmFuZG9tSWRlbnRpZmllcih0aGlzLmlkKSk7XG4gIH1cblxuICBwdWJsaWMgaW5pdENLRWRpdG9yKGlkZW50aWZpZXI6IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgQ0tFRElUT1IgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gY29uc29sZS53YXJuKCdDS0VkaXRvciA0LnggaXMgbWlzc2luZyAoaHR0cDovL2NrZWRpdG9yLmNvbS8pJyk7XG4gICAgfVxuXG4gICAgdGhpcy5pZGVudGlmaWVyID0gaWRlbnRpZmllcjtcbiAgICB0aGlzLmNrLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgdGhpcy5pZGVudGlmaWVyKTtcblxuICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCB0aGlzLmNvbmZpZywge1xuICAgICAgcmVhZE9ubHk6IHRoaXMucmVhZG9ubHksXG4gICAgICBza2luOiB0aGlzLnNraW4sXG4gICAgICBsYW5ndWFnZTogdGhpcy5sYW5ndWFnZSxcbiAgICAgIGZ1bGxQYWdlOiB0aGlzLmZ1bGxQYWdlLFxuICAgICAgaW5saW5lOiB0aGlzLmlubGluZSxcbiAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICB9KTtcbiAgICB0aGlzLmNrSW5zID0gdGhpcy5pbmxpbmVcbiAgICAgID8gQ0tFRElUT1IuaW5saW5lKHRoaXMuY2submF0aXZlRWxlbWVudCwgb3B0KVxuICAgICAgOiBDS0VESVRPUi5yZXBsYWNlKHRoaXMuY2submF0aXZlRWxlbWVudCwgb3B0KTtcbiAgICB0aGlzLmNrSW5zLnNldERhdGEodGhpcy5pbm5lclZhbHVlKTtcblxuICAgIHRoaXMuY2tJbnMub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHZhbCA9IHRoaXMuY2tJbnMuZ2V0RGF0YSgpO1xuICAgICAgdGhpcy51cGRhdGVWYWx1ZSh2YWwpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5ja0lucy5vbignaW5zdGFuY2VSZWFkeScsIChldnQ6IGFueSkgPT4ge1xuICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5yZWFkeS5lbWl0KGV2dCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuY2tJbnMub24oJ2JsdXInLCAoZXZ0OiBhbnkpID0+IHtcbiAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMuYmx1ci5lbWl0KGV2dCk7XG4gICAgICAgIHRoaXMucHJvcGFnYXRlVG91Y2goKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5ja0lucy5vbignZm9jdXMnLCAoZXZ0OiBhbnkpID0+IHtcbiAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMuZm9jdXMuZW1pdChldnQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZGVzdHJveUNLRWRpdG9yKCkge1xuICAgIGlmICh0aGlzLmNrSW5zKSB7XG4gICAgICB0aGlzLmNrSW5zLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgICAgaWYgKENLRURJVE9SLmluc3RhbmNlcy5oYXNPd25Qcm9wZXJ0eSh0aGlzLmNrSW5zLm5hbWUpKSB7XG4gICAgICAgIENLRURJVE9SLnJlbW92ZShDS0VESVRPUi5pbnN0YW5jZXNbdGhpcy5ja0lucy5uYW1lXSk7XG4gICAgICB9XG4gICAgICB0aGlzLmNrSW5zLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuY2tJbnMgPSBudWxsO1xuICAgICAgY29uc3QgZWRpdG9yRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2tlXycgKyB0aGlzLmlkZW50aWZpZXIpO1xuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKGVkaXRvckVsKSAmJiBVdGlsLmlzRGVmaW5lZChlZGl0b3JFbC5wYXJlbnRFbGVtZW50KSkge1xuICAgICAgICBlZGl0b3JFbC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGVkaXRvckVsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlVmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICB0aGlzLmlubmVyVmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMucHJvcGFnYXRlQ2hhbmdlKHZhbHVlKTtcbiAgICAgIHRoaXMucHJvcGFnYXRlVG91Y2goKTtcbiAgICAgIHRoaXMuY2hhbmdlLmVtaXQodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5pbm5lclZhbHVlID0gdmFsdWUgfHwgJyc7XG4gICAgaWYgKHRoaXMuY2tJbnMpIHtcbiAgICAgIC8vIEZpeCBidWcgdGhhdCBjYW4ndCBlbWl0IGNoYW5nZSBldmVudCB3aGVuIHNldCBub24taHRtbCB0YWcgdmFsdWUgdHdpY2UgaW4gZnVsbHBhZ2UgbW9kZS5cbiAgICAgIHRoaXMuY2tJbnMuc2V0RGF0YSh0aGlzLmlubmVyVmFsdWUpO1xuICAgICAgY29uc3QgdmFsID0gdGhpcy5ja0lucy5nZXREYXRhKCk7XG4gICAgICB0aGlzLmNrSW5zLnNldERhdGEodmFsKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgcHJvcGFnYXRlQ2hhbmdlKF86IGFueSkge1xuICAgIC8vIGRvIG5vdGhpbmdcbiAgfVxuXG4gIHByb3RlY3RlZCBwcm9wYWdhdGVUb3VjaCgpIHtcbiAgICAvLyBkbyBub3RoaW5nXG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMucHJvcGFnYXRlVG91Y2ggPSBmbjtcbiAgfVxuXG59XG4iXX0=