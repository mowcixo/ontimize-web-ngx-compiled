import { Util } from '../../util/util';
export var DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS = [
    'attr',
    'ovisible: visible'
];
var OComponentMenuItems = (function () {
    function OComponentMenuItems() {
        this.ovisible = true;
        this.type = OComponentMenuItems.TYPE_GROUP_MENU;
    }
    Object.defineProperty(OComponentMenuItems.prototype, "isVisible", {
        get: function () {
            return this.parseInput(this.ovisible);
        },
        enumerable: true,
        configurable: true
    });
    OComponentMenuItems.prototype.parseInput = function (value, defaultValue) {
        if (value instanceof Function || typeof value === 'boolean') {
            return value;
        }
        return Util.parseBoolean(value, defaultValue);
    };
    OComponentMenuItems.TYPE_ITEM_MENU = 'item_menu';
    OComponentMenuItems.TYPE_GROUP_MENU = 'item_group';
    OComponentMenuItems.TYPE_SEPARATOR_MENU = 'item_separator';
    return OComponentMenuItems;
}());
export { OComponentMenuItems };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250ZW50LW1lbnUuY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY29udGV4dG1lbnUvby1jb250ZW50LW1lbnUuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXZDLE1BQU0sQ0FBQyxJQUFNLG1DQUFtQyxHQUFHO0lBQ2pELE1BQU07SUFDTixtQkFBbUI7Q0FDcEIsQ0FBQztBQUVGO0lBQUE7UUFLUyxhQUFRLEdBQXVDLElBQUksQ0FBQztRQUVwRCxTQUFJLEdBQUcsbUJBQW1CLENBQUMsZUFBZSxDQUFDO0lBYXBELENBQUM7SUFYQyxzQkFBVywwQ0FBUzthQUFwQjtZQUNFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEMsQ0FBQzs7O09BQUE7SUFFUyx3Q0FBVSxHQUFwQixVQUFxQixLQUFVLEVBQUUsWUFBc0I7UUFDckQsSUFBSSxLQUFLLFlBQVksUUFBUSxJQUFJLE9BQU8sS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUMzRCxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBaEJhLGtDQUFjLEdBQUcsV0FBVyxDQUFDO0lBQzdCLG1DQUFlLEdBQUcsWUFBWSxDQUFDO0lBQy9CLHVDQUFtQixHQUFHLGdCQUFnQixDQUFDO0lBZ0J2RCwwQkFBQztDQUFBLEFBcEJELElBb0JDO1NBcEJZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19DT05URVhUX01FTlVfSVRFTVMgPSBbXG4gICdhdHRyJyxcbiAgJ292aXNpYmxlOiB2aXNpYmxlJ1xuXTtcblxuZXhwb3J0IGNsYXNzIE9Db21wb25lbnRNZW51SXRlbXMge1xuXG4gIHB1YmxpYyBzdGF0aWMgVFlQRV9JVEVNX01FTlUgPSAnaXRlbV9tZW51JztcbiAgcHVibGljIHN0YXRpYyBUWVBFX0dST1VQX01FTlUgPSAnaXRlbV9ncm91cCc7XG4gIHB1YmxpYyBzdGF0aWMgVFlQRV9TRVBBUkFUT1JfTUVOVSA9ICdpdGVtX3NlcGFyYXRvcic7XG4gIHB1YmxpYyBvdmlzaWJsZTogYm9vbGVhbiB8ICgoaXRlbTogYW55KSA9PiBib29sZWFuKSA9IHRydWU7XG4gIHB1YmxpYyBhdHRyO1xuICBwdWJsaWMgdHlwZSA9IE9Db21wb25lbnRNZW51SXRlbXMuVFlQRV9HUk9VUF9NRU5VO1xuXG4gIHB1YmxpYyBnZXQgaXNWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBhcnNlSW5wdXQodGhpcy5vdmlzaWJsZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VJbnB1dCh2YWx1ZTogYW55LCBkZWZhdWx0VmFsdWU/OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRnVuY3Rpb24gfHwgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIFV0aWwucGFyc2VCb29sZWFuKHZhbHVlLCBkZWZhdWx0VmFsdWUpO1xuICB9XG5cbn1cbiJdfQ==