export declare enum ColumnValueFilterOperator {
    IN = 0,
    LESS_EQUAL = 1,
    MORE_EQUAL = 2,
    BETWEEN = 3,
    EQUAL = 4
}
export declare type OColumnValueFilter = {
    attr: string;
    operator: ColumnValueFilterOperator;
    values: any;
};
