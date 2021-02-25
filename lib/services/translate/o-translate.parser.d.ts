import { TranslateDefaultParser } from '@ngx-translate/core';
export declare class OTranslateParser extends TranslateDefaultParser {
    templateMatcher: RegExp;
    interpolate(expr: string, params?: any): string;
}
