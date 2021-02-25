export declare type Expression = {
    lop: string | Expression;
    op: string;
    rop?: string | any[] | Expression;
};
