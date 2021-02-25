export declare function StringConverter(value: any): any;
export declare function BooleanConverter(value: any): any;
export declare function NumberConverter(value: any): any;
export declare function InputConverter(converter?: (value: any) => any): (target: object, key: string | symbol) => void;
