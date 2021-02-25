export declare class OValueChangeEvent {
    type: number;
    newValue: any;
    oldValue: any;
    target: any;
    static USER_CHANGE: number;
    static PROGRAMMATIC_CHANGE: number;
    constructor(type: number, newValue: any, oldValue: any, target: any);
    isUserChange(): boolean;
    isProgrammaticChange(): boolean;
}
