import * as tslib_1 from "tslib";
import { Base64 } from './base64';
import { Codes } from './codes';
var Util = (function () {
    function Util() {
    }
    Util.isObject = function (val) {
        var valType = typeof val;
        return valType === 'object';
    };
    Util.isArray = function (val) {
        return val instanceof Array;
    };
    Util.parseBoolean = function (value, defaultValue) {
        if ((typeof value === 'string') && (value.toUpperCase() === 'TRUE' || value.toUpperCase() === 'YES')) {
            return true;
        }
        else if ((typeof value === 'string') && (value.toUpperCase() === 'FALSE' || value.toUpperCase() === 'NO')) {
            return false;
        }
        else if (Util.isDefined(defaultValue)) {
            return defaultValue;
        }
        return false;
    };
    Util.parseArray = function (value, excludeRepeated) {
        if (excludeRepeated === void 0) { excludeRepeated = false; }
        var result = [];
        if (value) {
            result = value.split(Codes.ARRAY_INPUT_SEPARATOR);
        }
        if (excludeRepeated && result.length > 0) {
            result = Array.from(new Set(result));
        }
        return result;
    };
    Util.parseParentKeysEquivalences = function (pKeysArray, separator) {
        if (separator === void 0) { separator = ':'; }
        var equivalences = {};
        if (pKeysArray && pKeysArray.length > 0) {
            pKeysArray.forEach(function (item) {
                var aux = item.split(separator);
                if (aux && aux.length === 2) {
                    if (/.+\[.+\]/.test(aux[1])) {
                        var equivKey = aux[1].substring(0, aux[1].indexOf('['));
                        var equivValue = aux[1].substring(aux[1].indexOf('[') + 1, aux[1].indexOf(']'));
                        var equiv = {};
                        equiv[equivKey] = equivValue;
                        equivalences[aux[0]] = equiv;
                    }
                    else {
                        equivalences[aux[0]] = aux[1];
                    }
                }
                else if (aux && aux.length === 1) {
                    equivalences[item] = item;
                }
            });
        }
        return equivalences;
    };
    Util.encodeParentKeys = function (parentKeys) {
        var encoded = '';
        if (parentKeys) {
            encoded = Base64.encode(JSON.stringify(parentKeys));
        }
        return encoded;
    };
    Util.decodeParentKeys = function (parentKeys) {
        var decoded = {};
        if (parentKeys && parentKeys.length > 0) {
            var d = Base64.decode(parentKeys);
            decoded = JSON.parse(d);
        }
        return decoded;
    };
    Util.isArrayEmpty = function (array) {
        if (array && array.length === 0) {
            return true;
        }
        return false;
    };
    Util.isDataService = function (arg) {
        if (arg === undefined || arg === null) {
            return false;
        }
        return (arg.getDefaultServiceConfiguration !== undefined &&
            arg.configureService !== undefined);
    };
    Util.isPermissionsService = function (arg) {
        if (arg === undefined || arg === null) {
            return false;
        }
        return (arg.loadPermissions !== undefined);
    };
    Util.isFormDataComponent = function (arg) {
        if (arg === undefined || arg === null) {
            return false;
        }
        return (arg.isAutomaticBinding !== undefined);
    };
    Util.isEquivalent = function (a, b) {
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);
        if (aProps.length !== bProps.length) {
            return false;
        }
        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            var bValue = b[propName];
            if (typeof a[propName] === 'number') {
                var intB = parseInt(bValue, 10);
                bValue = isNaN(intB) ? bValue : intB;
            }
            if (a[propName] !== bValue) {
                return false;
            }
        }
        return true;
    };
    Util.equals = function (o1, o2) {
        if (o1 === o2) {
            return true;
        }
        if (o1 === null || o2 === null) {
            return false;
        }
        if (o1 !== o1 && o2 !== o2) {
            return true;
        }
        var t1 = typeof o1;
        var t2 = typeof o2;
        var length;
        var key;
        var keySet;
        if (t1 === t2 && t1 === 'object') {
            if (Array.isArray(o1)) {
                if (!Array.isArray(o2)) {
                    return false;
                }
                length = o1.length;
                if (length === o2.length) {
                    for (key = 0; key < length; key++) {
                        if (!Util.equals(o1[key], o2[key])) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            else {
                if (Array.isArray(o2)) {
                    return false;
                }
                keySet = Object.create(null);
                for (key in o1) {
                    if (!Util.equals(o1[key], o2[key])) {
                        return false;
                    }
                    keySet[key] = true;
                }
                for (key in o2) {
                    if (!(key in keySet) && typeof o2[key] !== 'undefined') {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    };
    Util.isDefined = function (value) {
        return typeof value !== 'undefined' && value !== null;
    };
    Util.normalizeString = function (value, toLowerCase) {
        if (toLowerCase === void 0) { toLowerCase = true; }
        if (value && value.length) {
            var result = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (toLowerCase) {
                result = result.toLowerCase();
            }
            return result;
        }
        return '';
    };
    Util.flatten = function (array) {
        return [].concat.apply([], tslib_1.__spread(array));
    };
    Util.getValuesFromObject = function (obj) {
        if (obj === void 0) { obj = {}; }
        var array = [];
        Object.keys(obj).forEach(function (key) {
            if (typeof obj[key] === 'object') {
                array.push(Util.getValuesFromObject(obj[key]));
            }
            array.push(obj[key]);
        });
        return Util.flatten(array);
    };
    Util.parseIconPosition = function (value, defaultValue) {
        var result = defaultValue || Codes.ICON_POSITION_LEFT;
        var availablePositions = [Codes.ICON_POSITION_LEFT, Codes.ICON_POSITION_RIGHT];
        if (value && value.length) {
            result = value.toLowerCase();
        }
        if (availablePositions.indexOf(result) === -1) {
            result = defaultValue || Codes.ICON_POSITION_LEFT;
        }
        return result;
    };
    Util.copyToClipboard = function (data) {
        document.addEventListener('copy', function (e) {
            e.clipboardData.setData('text/plain', data);
            e.preventDefault();
            document.removeEventListener('copy', null);
        });
        document.execCommand('copy');
    };
    Util.checkPixelsValueString = function (value) {
        return typeof value === 'string' ? value.toLowerCase().endsWith('px') : false;
    };
    Util.extractPixelsValue = function (value, defaultValue) {
        var result = typeof value === 'number' ? value : undefined;
        if (Util.checkPixelsValueString(value)) {
            var parsed = parseFloat(value.substr(0, value.length - 'px'.length));
            result = isNaN(parsed) ? defaultValue : parsed;
        }
        return Util.isDefined(result) ? result : defaultValue;
    };
    Util.parseOInputsOptions = function (elRef, oInputsOptions) {
        if (oInputsOptions.iconColor === Codes.O_INPUTS_OPTIONS_COLOR_ACCENT) {
            var matFormFieldEL = elRef.nativeElement.getElementsByTagName('mat-form-field')[0];
            if (Util.isDefined(matFormFieldEL)) {
                matFormFieldEL.classList.add('accent');
            }
        }
    };
    Util.escapeSpecialCharacter = function (S) {
        var e_1, _a;
        var str = String(S);
        var cpList = Array.from(str[Symbol.iterator]());
        var cuList = [];
        try {
            for (var cpList_1 = tslib_1.__values(cpList), cpList_1_1 = cpList_1.next(); !cpList_1_1.done; cpList_1_1 = cpList_1.next()) {
                var c = cpList_1_1.value;
                if ('^$\\.*+?()[]{}|'.indexOf(c) !== -1) {
                    cuList.push('\\');
                }
                cuList.push(c);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (cpList_1_1 && !cpList_1_1.done && (_a = cpList_1.return)) _a.call(cpList_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var L = cuList.join('');
        return L;
    };
    Util.differenceArrays = function (array1, array2) {
        var _this = this;
        var difference = array1.filter(function (obj) {
            return !array2.some(function (obj2) {
                return _this.equals(obj, obj2);
            });
        });
        return difference;
    };
    Util.convertToODateValueType = function (val) {
        var result = 'timestamp';
        var lowerVal = (val || '').toLowerCase();
        if (lowerVal === 'string' || lowerVal === 'date' || lowerVal === 'timestamp' || lowerVal === 'iso-8601') {
            result = lowerVal;
        }
        return result;
    };
    return Util;
}());
export { Util };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvdXRpbC91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFJQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFaEM7SUFBQTtJQW9WQSxDQUFDO0lBbFZRLGFBQVEsR0FBZixVQUFnQixHQUFRO1FBQ3RCLElBQU0sT0FBTyxHQUFHLE9BQU8sR0FBRyxDQUFDO1FBQzNCLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQztJQUM5QixDQUFDO0lBRU0sWUFBTyxHQUFkLFVBQWUsR0FBUTtRQUNyQixPQUFPLEdBQUcsWUFBWSxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVNLGlCQUFZLEdBQW5CLFVBQW9CLEtBQWEsRUFBRSxZQUFzQjtRQUN2RCxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNwRyxPQUFPLElBQUksQ0FBQztTQUNiO2FBQU0sSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLE9BQU8sSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDM0csT0FBTyxLQUFLLENBQUM7U0FDZDthQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUN2QyxPQUFPLFlBQVksQ0FBQztTQUNyQjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVNLGVBQVUsR0FBakIsVUFBa0IsS0FBYSxFQUFFLGVBQWdDO1FBQWhDLGdDQUFBLEVBQUEsdUJB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QUN2RyxNQUFNLEdBQUcsUUFBUSxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDLEFBcFZELElBb1ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSURhdGFTZXJ2aWNlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9kYXRhLXNlcnZpY2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IElGb3JtRGF0YUNvbXBvbmVudCB9IGZyb20gJy4uL2ludGVyZmFjZXMvZm9ybS1kYXRhLWNvbXBvbmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSVBlcm1pc3Npb25zU2VydmljZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvcGVybWlzc2lvbnMtc2VydmljZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT0RhdGVWYWx1ZVR5cGUgfSBmcm9tICcuLi90eXBlcy9vLWRhdGUtdmFsdWUudHlwZSc7XG5pbXBvcnQgeyBCYXNlNjQgfSBmcm9tICcuL2Jhc2U2NCc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4vY29kZXMnO1xuXG5leHBvcnQgY2xhc3MgVXRpbCB7XG5cbiAgc3RhdGljIGlzT2JqZWN0KHZhbDogYW55KTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmFsVHlwZSA9IHR5cGVvZiB2YWw7XG4gICAgcmV0dXJuIHZhbFR5cGUgPT09ICdvYmplY3QnO1xuICB9XG5cbiAgc3RhdGljIGlzQXJyYXkodmFsOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdmFsIGluc3RhbmNlb2YgQXJyYXk7XG4gIH1cblxuICBzdGF0aWMgcGFyc2VCb29sZWFuKHZhbHVlOiBzdHJpbmcsIGRlZmF1bHRWYWx1ZT86IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICBpZiAoKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpICYmICh2YWx1ZS50b1VwcGVyQ2FzZSgpID09PSAnVFJVRScgfHwgdmFsdWUudG9VcHBlckNhc2UoKSA9PT0gJ1lFUycpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKCh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSAmJiAodmFsdWUudG9VcHBlckNhc2UoKSA9PT0gJ0ZBTFNFJyB8fCB2YWx1ZS50b1VwcGVyQ2FzZSgpID09PSAnTk8nKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoVXRpbC5pc0RlZmluZWQoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RhdGljIHBhcnNlQXJyYXkodmFsdWU6IHN0cmluZywgZXhjbHVkZVJlcGVhdGVkOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmdbXSB7XG4gICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgcmVzdWx0ID0gdmFsdWUuc3BsaXQoQ29kZXMuQVJSQVlfSU5QVVRfU0VQQVJBVE9SKTtcbiAgICB9XG4gICAgaWYgKGV4Y2x1ZGVSZXBlYXRlZCAmJiByZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0ID0gQXJyYXkuZnJvbShuZXcgU2V0KHJlc3VsdCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gb2JqZWN0IHdpdGggcGFyZW50IGtleXMgZXF1aXZhbGVuY2VzLlxuICAgKiBAcGFyYW0gIHBLZXlzQXJyYXkgQXJyYXkgb2Ygc3RyaW5ncy4gQWNjZXB0ZWQgZm9ybWF0OiBrZXkgfCBrZXk6YWxpYXNcbiAgICogQHJldHVybnMgT2JqZWN0XG4gICAqL1xuICBzdGF0aWMgcGFyc2VQYXJlbnRLZXlzRXF1aXZhbGVuY2VzKHBLZXlzQXJyYXk6IEFycmF5PHN0cmluZz4sIHNlcGFyYXRvcjogc3RyaW5nID0gJzonKTogb2JqZWN0IHtcbiAgICBjb25zdCBlcXVpdmFsZW5jZXMgPSB7fTtcbiAgICBpZiAocEtleXNBcnJheSAmJiBwS2V5c0FycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgIHBLZXlzQXJyYXkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgY29uc3QgYXV4ID0gaXRlbS5zcGxpdChzZXBhcmF0b3IpO1xuICAgICAgICBpZiAoYXV4ICYmIGF1eC5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICBpZiAoLy4rXFxbLitcXF0vLnRlc3QoYXV4WzFdKSkge1xuICAgICAgICAgICAgY29uc3QgZXF1aXZLZXkgPSBhdXhbMV0uc3Vic3RyaW5nKDAsIGF1eFsxXS5pbmRleE9mKCdbJykpO1xuICAgICAgICAgICAgY29uc3QgZXF1aXZWYWx1ZSA9IGF1eFsxXS5zdWJzdHJpbmcoYXV4WzFdLmluZGV4T2YoJ1snKSArIDEsIGF1eFsxXS5pbmRleE9mKCddJykpO1xuICAgICAgICAgICAgY29uc3QgZXF1aXYgPSB7fTtcbiAgICAgICAgICAgIGVxdWl2W2VxdWl2S2V5XSA9IGVxdWl2VmFsdWU7XG4gICAgICAgICAgICBlcXVpdmFsZW5jZXNbYXV4WzBdXSA9IGVxdWl2O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcXVpdmFsZW5jZXNbYXV4WzBdXSA9IGF1eFsxXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYXV4ICYmIGF1eC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBlcXVpdmFsZW5jZXNbaXRlbV0gPSBpdGVtO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGVxdWl2YWxlbmNlcztcbiAgfVxuXG4gIHN0YXRpYyBlbmNvZGVQYXJlbnRLZXlzKHBhcmVudEtleXM6IG9iamVjdCk6IHN0cmluZyB7XG4gICAgbGV0IGVuY29kZWQ6IHN0cmluZyA9ICcnO1xuICAgIGlmIChwYXJlbnRLZXlzKSB7XG4gICAgICBlbmNvZGVkID0gQmFzZTY0LmVuY29kZShKU09OLnN0cmluZ2lmeShwYXJlbnRLZXlzKSk7XG4gICAgfVxuICAgIHJldHVybiBlbmNvZGVkO1xuICB9XG5cbiAgc3RhdGljIGRlY29kZVBhcmVudEtleXMocGFyZW50S2V5czogc3RyaW5nKTogb2JqZWN0IHtcbiAgICBsZXQgZGVjb2RlZCA9IHt9O1xuICAgIGlmIChwYXJlbnRLZXlzICYmIHBhcmVudEtleXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZCA9IEJhc2U2NC5kZWNvZGUocGFyZW50S2V5cyk7XG4gICAgICBkZWNvZGVkID0gSlNPTi5wYXJzZShkKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlY29kZWQ7XG4gIH1cblxuICBzdGF0aWMgaXNBcnJheUVtcHR5KGFycmF5OiBhbnlbXSk6IGJvb2xlYW4ge1xuICAgIGlmIChhcnJheSAmJiBhcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHdldGhlciBzcGVjaWZpZWQgc2VydmljZSBhcyBhcmd1bWVudCBpbXBsZW1lbnRzICdJRGF0YVNlcnZpY2UnIGludGVyZmFjZVxuICAgKiBAcGFyYW0gYXJnIFRoZSBzZXJ2aWNlIGluc3RhbmNlIGZvciBjaGVja2luZy5cbiAgICogQHJldHVybnMgYm9vbGVhblxuICAgKi9cbiAgc3RhdGljIGlzRGF0YVNlcnZpY2UoYXJnOiBhbnkpOiBhcmcgaXMgSURhdGFTZXJ2aWNlIHtcbiAgICBpZiAoYXJnID09PSB1bmRlZmluZWQgfHwgYXJnID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAoKGFyZyBhcyBJRGF0YVNlcnZpY2UpLmdldERlZmF1bHRTZXJ2aWNlQ29uZmlndXJhdGlvbiAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAoYXJnIGFzIElEYXRhU2VydmljZSkuY29uZmlndXJlU2VydmljZSAhPT0gdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2V0aGVyIHNwZWNpZmllZCBzZXJ2aWNlIGFzIGFyZ3VtZW50IGltcGxlbWVudHMgJ0lEYXRhU2VydmljZScgaW50ZXJmYWNlXG4gICAqIEBwYXJhbSBhcmcgVGhlIHNlcnZpY2UgaW5zdGFuY2UgZm9yIGNoZWNraW5nLlxuICAgKiBAcmV0dXJucyBib29sZWFuXG4gICAqL1xuICBzdGF0aWMgaXNQZXJtaXNzaW9uc1NlcnZpY2UoYXJnOiBhbnkpOiBhcmcgaXMgSVBlcm1pc3Npb25zU2VydmljZSB7XG4gICAgaWYgKGFyZyA9PT0gdW5kZWZpbmVkIHx8IGFyZyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gKChhcmcgYXMgSVBlcm1pc3Npb25zU2VydmljZSkubG9hZFBlcm1pc3Npb25zICE9PSB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3ZXRoZXIgc3BlY2lmaWVkIGNvbXBvbmVudCBhcyBhcmd1bWVudCBpbXBsZW1lbnRzICdJRm9ybURhdGFDb21wb25lbnQnIGludGVyZmFjZVxuICAgKiBAcGFyYW0gYXJnIFRoZSBjb21wb25lbnQgaW5zdGFuY2UgZm9yIGNoZWNraW5nLlxuICAgKiBAcmV0dXJucyBib29sZWFuXG4gICAqL1xuICBzdGF0aWMgaXNGb3JtRGF0YUNvbXBvbmVudChhcmc6IGFueSk6IGFyZyBpcyBJRm9ybURhdGFDb21wb25lbnQge1xuICAgIGlmIChhcmcgPT09IHVuZGVmaW5lZCB8fCBhcmcgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICgoYXJnIGFzIElGb3JtRGF0YUNvbXBvbmVudCkuaXNBdXRvbWF0aWNCaW5kaW5nICE9PSB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXBhcmUgaXMgZXF1YWwgdHdvIG9iamVjdHNcbiAgICogQHBhcmFtIGEgT2JqZWN0IDFcbiAgICogQHBhcmFtIGIgT2JqZWN0IDJcbiAgICpcbiAgICovXG4gIHN0YXRpYyBpc0VxdWl2YWxlbnQoYSwgYikge1xuICAgIC8vIENyZWF0ZSBhcnJheXMgb2YgcHJvcGVydHkgbmFtZXNcbiAgICBjb25zdCBhUHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhhKTtcbiAgICBjb25zdCBiUHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiKTtcblxuICAgIC8vIElmIG51bWJlciBvZiBwcm9wZXJ0aWVzIGlzIGRpZmZlcmVudCwgb2JqZWN0cyBhcmUgbm90IGVxdWl2YWxlbnRcbiAgICBpZiAoYVByb3BzLmxlbmd0aCAhPT0gYlByb3BzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYVByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwcm9wTmFtZSA9IGFQcm9wc1tpXTtcbiAgICAgIC8vIElmIHZhbHVlcyBvZiBzYW1lIHByb3BlcnR5IGFyZSBub3QgZXF1YWwsIG9iamVjdHMgYXJlIG5vdCBlcXVpdmFsZW50XG4gICAgICBsZXQgYlZhbHVlID0gYltwcm9wTmFtZV07XG4gICAgICBpZiAodHlwZW9mIGFbcHJvcE5hbWVdID09PSAnbnVtYmVyJykge1xuICAgICAgICBjb25zdCBpbnRCID0gcGFyc2VJbnQoYlZhbHVlLCAxMCk7XG4gICAgICAgIGJWYWx1ZSA9IGlzTmFOKGludEIpID8gYlZhbHVlIDogaW50QjtcbiAgICAgIH1cbiAgICAgIGlmIChhW3Byb3BOYW1lXSAhPT0gYlZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBtYWRlIGl0IHRoaXMgZmFyLCBvYmplY3RzIGFyZSBjb25zaWRlcmVkIGVxdWl2YWxlbnRcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHN0YXRpYyBlcXVhbHMobzE6IGFueSwgbzI6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmIChvMSA9PT0gbzIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAobzEgPT09IG51bGwgfHwgbzIgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKG8xICE9PSBvMSAmJiBvMiAhPT0gbzIpIHtcbiAgICAgIC8vIE5hTiA9PT0gTmFOXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgdDEgPSB0eXBlb2YgbzE7XG4gICAgY29uc3QgdDIgPSB0eXBlb2YgbzI7XG4gICAgbGV0IGxlbmd0aDogbnVtYmVyO1xuICAgIGxldCBrZXk6IGFueTtcbiAgICBsZXQga2V5U2V0OiBhbnk7XG4gICAgaWYgKHQxID09PSB0MiAmJiB0MSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG8xKSkge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkobzIpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxlbmd0aCA9IG8xLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gbzIubGVuZ3RoKSB7XG4gICAgICAgICAgZm9yIChrZXkgPSAwOyBrZXkgPCBsZW5ndGg7IGtleSsrKSB7XG4gICAgICAgICAgICBpZiAoIVV0aWwuZXF1YWxzKG8xW2tleV0sIG8yW2tleV0pKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KG8yKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBrZXlTZXQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBmb3IgKGtleSBpbiBvMSkge1xuICAgICAgICAgIGlmICghVXRpbC5lcXVhbHMobzFba2V5XSwgbzJba2V5XSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAga2V5U2V0W2tleV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoa2V5IGluIG8yKSB7XG4gICAgICAgICAgaWYgKCEoa2V5IGluIGtleVNldCkgJiYgdHlwZW9mIG8yW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdGF0aWMgaXNEZWZpbmVkKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSAhPT0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBwcm92aWRlZCBzdHJpbmcgaW4gbG93ZXJjYXNlIGFuZCB3aXRob3V0IGFjY2VudCBtYXJrcy5cbiAgICogQHBhcmFtIHZhbHVlIHRoZSB0ZXh0IHRvIG5vcm1hbGl6ZVxuICAgKi9cbiAgc3RhdGljIG5vcm1hbGl6ZVN0cmluZyh2YWx1ZTogc3RyaW5nLCB0b0xvd2VyQ2FzZTogYm9vbGVhbiA9IHRydWUpOiBzdHJpbmcge1xuICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgIGxldCByZXN1bHQgPSB2YWx1ZS5ub3JtYWxpemUoJ05GRCcpLnJlcGxhY2UoL1tcXHUwMzAwLVxcdTAzNmZdL2csICcnKTtcbiAgICAgIGlmICh0b0xvd2VyQ2FzZSkge1xuICAgICAgICByZXN1bHQgPSByZXN1bHQudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBwcm92aWRlZCBhcnJheSBmbGF0dGVuZC5cbiAgICogQHBhcmFtIGFycmF5IHRoZSBhcnJheSB0byBmbGF0XG4gICAqL1xuICBzdGF0aWMgZmxhdHRlbihhcnJheTogQXJyYXk8YW55Pik6IEFycmF5PGFueT4ge1xuICAgIHJldHVybiBbXS5jb25jYXQoLi4uYXJyYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBsaXN0IHdpdGggYWxsIHRoZSB2YWx1ZXMgZnJvbSB0aGUgcHJvdmlkZWQgb2JqZWN0LlxuICAgKiBAcGFyYW0gb2JqIHRoZSBvYmplY3RcbiAgICovXG4gIHN0YXRpYyBnZXRWYWx1ZXNGcm9tT2JqZWN0KG9iajogb2JqZWN0ID0ge30pOiBBcnJheTxhbnk+IHtcbiAgICBjb25zdCBhcnJheTogQXJyYXk8YW55PiA9IFtdO1xuICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgYXJyYXkucHVzaChVdGlsLmdldFZhbHVlc0Zyb21PYmplY3Qob2JqW2tleV0pKTtcbiAgICAgIH1cbiAgICAgIGFycmF5LnB1c2gob2JqW2tleV0pO1xuICAgIH0pO1xuICAgIHJldHVybiBVdGlsLmZsYXR0ZW4oYXJyYXkpO1xuICB9XG5cbiAgc3RhdGljIHBhcnNlSWNvblBvc2l0aW9uKHZhbHVlOiBzdHJpbmcsIGRlZmF1bHRWYWx1ZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IHJlc3VsdCA9IGRlZmF1bHRWYWx1ZSB8fCBDb2Rlcy5JQ09OX1BPU0lUSU9OX0xFRlQ7XG4gICAgY29uc3QgYXZhaWxhYmxlUG9zaXRpb25zID0gW0NvZGVzLklDT05fUE9TSVRJT05fTEVGVCwgQ29kZXMuSUNPTl9QT1NJVElPTl9SSUdIVF07XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgcmVzdWx0ID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgaWYgKGF2YWlsYWJsZVBvc2l0aW9ucy5pbmRleE9mKHJlc3VsdCkgPT09IC0xKSB7XG4gICAgICByZXN1bHQgPSBkZWZhdWx0VmFsdWUgfHwgQ29kZXMuSUNPTl9QT1NJVElPTl9MRUZUO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgc3RhdGljIGNvcHlUb0NsaXBib2FyZChkYXRhOiBzdHJpbmcpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjb3B5JywgKGU6IENsaXBib2FyZEV2ZW50KSA9PiB7XG4gICAgICBlLmNsaXBib2FyZERhdGEuc2V0RGF0YSgndGV4dC9wbGFpbicsIGRhdGEpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29weScsIG51bGwpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gIH1cblxuICBzdGF0aWMgY2hlY2tQaXhlbHNWYWx1ZVN0cmluZyh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZS50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKCdweCcpIDogZmFsc2U7XG4gIH1cblxuICBzdGF0aWMgZXh0cmFjdFBpeGVsc1ZhbHVlKHZhbHVlOiBhbnksIGRlZmF1bHRWYWx1ZT86IG51bWJlcik6IG51bWJlciB7XG4gICAgbGV0IHJlc3VsdDogbnVtYmVyID0gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogdW5kZWZpbmVkO1xuICAgIGlmIChVdGlsLmNoZWNrUGl4ZWxzVmFsdWVTdHJpbmcodmFsdWUpKSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUZsb2F0KHZhbHVlLnN1YnN0cigwLCB2YWx1ZS5sZW5ndGggLSAncHgnLmxlbmd0aCkpO1xuICAgICAgcmVzdWx0ID0gaXNOYU4ocGFyc2VkKSA/IGRlZmF1bHRWYWx1ZSA6IHBhcnNlZDtcbiAgICB9XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKHJlc3VsdCkgPyByZXN1bHQgOiBkZWZhdWx0VmFsdWU7XG4gIH1cbiAgLyoqXG4gICAqIEFkZGVkIGNsYXNzICdhY2NlbnQnIGluIDxtYXQtZm9ybS1maWVsZD4gYW5kIHNldCB0aGUgY29sb3IgIGFjY2VudCBpbiB0aGUgaWNvbnNcbiAgICogQHBhcmFtIGVsUmVmXG4gICAqIEBwYXJhbSBvSW5wdXRzT3B0aW9uc1xuICAgKi9cblxuICBzdGF0aWMgcGFyc2VPSW5wdXRzT3B0aW9ucyhlbFJlZiwgb0lucHV0c09wdGlvbnMpIHtcblxuICAgIGlmIChvSW5wdXRzT3B0aW9ucy5pY29uQ29sb3IgPT09IENvZGVzLk9fSU5QVVRTX09QVElPTlNfQ09MT1JfQUNDRU5UKSB7XG4gICAgICBjb25zdCBtYXRGb3JtRmllbGRFTCA9IGVsUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ21hdC1mb3JtLWZpZWxkJylbMF07XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQobWF0Rm9ybUZpZWxkRUwpKSB7XG4gICAgICAgIG1hdEZvcm1GaWVsZEVMLmNsYXNzTGlzdC5hZGQoJ2FjY2VudCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqICBSZXR1cm4gc3RyaW5nIHdpdGggZXNjYXBlZCBzcGVjaWFsIGNoYXJhY3RlclxuICAgKi9cbiAgc3RhdGljIGVzY2FwZVNwZWNpYWxDaGFyYWN0ZXIoUzogc3RyaW5nKTogc3RyaW5nIHtcblxuICAgIGNvbnN0IHN0ciA9IFN0cmluZyhTKTtcblxuICAgIGNvbnN0IGNwTGlzdCA9IEFycmF5LmZyb20oc3RyW1N5bWJvbC5pdGVyYXRvcl0oKSk7XG5cbiAgICBjb25zdCBjdUxpc3QgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGMgb2YgY3BMaXN0KSB7XG4gICAgICAvLyBpLiBJZiBjIGlzIGEgU3BlY2lhbENoYXJhY3RlciB0aGVuIGRvOlxuICAgICAgaWYgKCdeJFxcXFwuKis/KClbXXt9fCcuaW5kZXhPZihjKSAhPT0gLTEpIHtcbiAgICAgICAgLy8gYS4gQXBwZW5kIFwiXFxcIiB0byBjdUxpc3QuXG4gICAgICAgIGN1TGlzdC5wdXNoKCdcXFxcJyk7XG4gICAgICB9XG4gICAgICAvLyBBcHBlbmQgYyB0byBjcExpc3QuXG4gICAgICBjdUxpc3QucHVzaChjKTtcbiAgICB9XG4gICAgY29uc3QgTCA9IGN1TGlzdC5qb2luKCcnKTtcbiAgICByZXR1cm4gTDtcblxuICB9XG5cbiAgc3RhdGljIGRpZmZlcmVuY2VBcnJheXMoYXJyYXkxOiBBcnJheTxhbnk+LCBhcnJheTI6IEFycmF5PGFueT4pOiBBcnJheTxhbnk+IHtcbiAgICBjb25zdCBkaWZmZXJlbmNlID0gYXJyYXkxLmZpbHRlcihvYmogPT4ge1xuICAgICAgcmV0dXJuICFhcnJheTIuc29tZShvYmoyID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXF1YWxzKG9iaiwgb2JqMik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGlmZmVyZW5jZTtcbiAgfVxuXG4gIHN0YXRpYyBjb252ZXJ0VG9PRGF0ZVZhbHVlVHlwZSh2YWw6IGFueSk6IE9EYXRlVmFsdWVUeXBlIHtcbiAgICBsZXQgcmVzdWx0OiBPRGF0ZVZhbHVlVHlwZSA9ICd0aW1lc3RhbXAnO1xuICAgIGNvbnN0IGxvd2VyVmFsID0gKHZhbCB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAobG93ZXJWYWwgPT09ICdzdHJpbmcnIHx8IGxvd2VyVmFsID09PSAnZGF0ZScgfHwgbG93ZXJWYWwgPT09ICd0aW1lc3RhbXAnIHx8IGxvd2VyVmFsID09PSAnaXNvLTg2MDEnKSB7XG4gICAgICByZXN1bHQgPSBsb3dlclZhbDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19