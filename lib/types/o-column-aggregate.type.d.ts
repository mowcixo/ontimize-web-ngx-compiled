import { AggregateFunction } from './aggregate-function.type';
export declare type OColumnAggregate = {
    title?: string;
    attr?: string;
    operator?: string | AggregateFunction;
};
