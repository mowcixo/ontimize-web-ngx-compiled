export declare const DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS: string[];
export declare class OComponentMenuItems {
    static TYPE_ITEM_MENU: string;
    static TYPE_GROUP_MENU: string;
    static TYPE_SEPARATOR_MENU: string;
    ovisible: boolean | ((item: any) => boolean);
    attr: any;
    type: string;
    readonly isVisible: boolean;
    protected parseInput(value: any, defaultValue?: boolean): boolean;
}
