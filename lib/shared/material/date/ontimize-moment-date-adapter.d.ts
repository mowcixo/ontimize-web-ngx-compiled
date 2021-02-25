import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
export declare class OntimizeMomentDateAdapter extends MomentDateAdapter {
    oFormat: string;
    constructor(dateLocale: string);
    format(date: any, displayFormat: string): string;
    parse(value: any, parseFormat: string | string[]): any | null;
    deserialize(value: any): Moment | null;
}
